const functions = require('firebase-functions');
const admin = require('firebase-admin');
const got = require('got');
const parser = require('fast-xml-parser');
const parse = require('date-fns/parse');

const app = admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.casTicket = functions.https.onRequest(async (req, res) => {
  const devMode = JSON.parse(req.query.dev);
  const ticket = req.query.ticket;
  functions.logger.debug({ devMode, ticket });
  const casData = await got(`https://accounts.esn.org/cas/serviceValidate`, {
    searchParams: {
      ticket,
      service: `https://us-central1-esn-speakers.cloudfunctions.net/casTicket?dev=${devMode}`,
    },
  }).catch((err) => functions.logger.error(err.body));
  const userdata = parser.parse(casData.body.replace(/cas:/g, ''))
    .serviceResponse.authenticationSuccess;
  const uid = userdata.user;
  const user = await admin
    .auth()
    .getUser(uid)
    .catch(() => false);
  const firebaseUser = {
    email: userdata.attributes.mail,
    emailVerified: !!userdata.attributes.mail,
    displayName: `${userdata.attributes.first} ${userdata.attributes.last}`,
    photoURL: userdata.attributes.picture,
  };
  functions.logger.debug({ userdata });
  functions.logger.debug({ firebaseUser });
  functions.logger.debug({ user });
  if (!user) {
    functions.logger.debug('Creating user');
    functions.logger.debug({
      uid,
      ...firebaseUser,
    });
    await admin.auth().createUser({
      uid,
      ...firebaseUser,
    });
    functions.logger.info('Created user: ', uid);
  } else {
    await admin.auth().updateUser(uid, firebaseUser);
    functions.logger.debug('Updated user: ', uid);
  }
  const userRef = admin.firestore().collection('users').doc(uid);
  const savedUser = await userRef.get();
  let extraData = {};
  if (!savedUser.exists) {
    extraData = { isAdmin: false, isCt: false, hasAccess: false, votes: 0 };
  }
  try {
    await userRef.set(
      {
        ...firebaseUser,
        uid,
        // nationality: userdata.attributes.nationality || '',
        firstName: userdata.attributes.first,
        lastName: userdata.attributes.last,
        // birthday: parse(userdata.attributes.birthdate, 'dd/LL/yyyy', new Date()),
        // gender: userdata.attributes.gender,
        section: userdata.attributes.section,
        sectionId: userdata.attributes.sc,
        country: userdata.attributes.country,
        roles: userdata.attributes.roles,
        fullRoles: userdata.attributes.extended_roles,
        ...extraData,
      },
      { merge: true }
    );
  } catch (e) {
    functions.logger.error('Error when trying to save user');
    functions.logger.error(e);
    functions.logger.info({ firebaseUser, user });
  }
  const token = await admin
    .auth()
    .createCustomToken(uid)
    .catch((err) => res.json(err));
  const redirectTarget =
    devMode === 1
      ? `http://localhost:4200/callback?token=${token}`
      : `https://esn-speakers.web.app/callback?token=${token}`;
  res.redirect(redirectTarget);
});

exports.recordVote = functions.https.onCall(
  async ({ list, entry, answer }, context) => {
    functions.logger.debug({ list, entry, answer });
    functions.logger.debug(context.auth);
    const answersRef = app
      .firestore()
      .collection('lists')
      .doc(list)
      .collection('entries')
      .doc(entry)
      .collection('answers');
    const entryRef = app
      .firestore()
      .collection('lists')
      .doc(list)
      .collection('entries')
      .doc(entry);
    const userRef = app.firestore().collection('users').doc(context.auth.uid);
    try {
      return await app.firestore().runTransaction(async (transaction) => {
        const entry = await transaction.get(entryRef);
        const answers = await transaction.get(answersRef);
        const usedVotes = answers.docs
          .map((a) => a.data().votes.map((v) => v.uid))
          .reduce(
            (acc, curr) =>
              acc + curr.filter((id) => id === context.auth.uid).length,
            0
          );
        const userDoc = await transaction.get(userRef);
        functions.logger.debug(entry.data());
        functions.logger.debug(
          'Votes gone: ',
          (entry.data().randomQuestion ? 1 : userDoc.data().votes) <= usedVotes
        );
        if (
          (entry.data().randomQuestion ? 1 : userDoc.data().votes) <= usedVotes
        ) {
          throw new Error('User already used their votes.');
        }
        const answerDoc = await transaction.get(answersRef.doc(answer));
        const votes = [...answerDoc.data().votes, userDoc.data()];
        functions.logger.debug({ votes });
        transaction.update(answersRef.doc(answer), { votes });
        return 'Vote Logged';
      });
    } catch (e) {
      console.log('Transaction failure:', e);
      return e;
    }
  }
);
