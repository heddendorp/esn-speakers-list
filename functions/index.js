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
    phoneNumber: `+${userdata.attributes.telephone}`,
    displayName: `${userdata.attributes.first} ${userdata.attributes.last}`,
    photoURL: userdata.attributes.picture,
  };
  functions.logger.debug({ userdata });
  functions.logger.debug({ firebaseUser });
  if (!user) {
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
  await userRef.set(
    {
      ...firebaseUser,
      nationality: userdata.attributes.nationality,
      firstName: userdata.attributes.first,
      lastName: userdata.attributes.last,
      birthday: parse(userdata.attributes.birthdate, 'dd/LL/yyyy', new Date()),
      gender: userdata.attributes.gender,
      section: userdata.attributes.section,
      sectionId: userdata.attributes.sc,
      country: userdata.attributes.country,
      roles: userdata.attributes.roles,
      fullRoles: userdata.attributes.extended_roles,
    },
    { merge: true }
  );
  const token = await admin
    .auth()
    .createCustomToken(uid)
    .catch((err) => res.json(err));
  res.redirect(`http://localhost:4200/callback?token=${token}`);
});
