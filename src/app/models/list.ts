import { Observable } from 'rxjs';
import { ListEntry } from './list-entry';

export interface List {
  id: string;
  isOpen: boolean;
  isVisible: boolean;
  name: string;
  activeItem: string;
  // entries$: Observable<ListEntry[]>;
}
