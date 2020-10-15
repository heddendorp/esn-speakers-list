import { User } from './user';
import { Observable } from 'rxjs';

export type ListEntry = QuestionEntry | ProceduralEntry | PollEntry;

interface BaseEntry {
  id: string;
  type: EntryType;
  text: string;
  user: User;
  done: boolean;
  doneComment?: string;
  timestamp: Date;
}

interface QuestionEntry extends BaseEntry {
  type: EntryType.QUESTION;
  answer: string;
  reactions$: Observable<Reaction[]>;
}

interface ProceduralEntry extends BaseEntry {
  answer: string;
  type: EntryType.PROCEDURAL;
}

interface PollEntry extends BaseEntry {
  type: EntryType.POLL;
  answers$: Observable<Answer[]>;
  votesLeft$: Observable<number>;
}

export enum EntryType {
  QUESTION = 'question',
  PROCEDURAL = 'procedural',
  POLL = 'poll',
}

export interface Reaction {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

export interface Answer {
  voted?: number;
  id: string;
  text: string;
  votes: User[];
}
