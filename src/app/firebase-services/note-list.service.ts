import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId))
      .catch((error) => {
        console.log('Error: ', error);
      })
      .then(() => {
        console.log('Note deleted successfully');
      });
  }

  async updateNote(note: Note) {
    if (note.id) {
      // Eine Referenz zum Dokument in der Datenbank wird geholt. Die Sammlung wird durch den Typ der Notiz bestimmt (von getColIdFromNote).
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);

      // Die Notiz wird in der Datenbank aktualisiert. updateDoc ist die Funktion, die das Dokument mit den neuen Daten (von getCleanJson(note)) aktualisiert.
      await updateDoc(docRef, this.getCleanJson(note))
        .catch((error) => {
          console.log('Error: ', error);
        })
        .then(() => {
          console.log('Note updated successfully');
        });
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    // addDoc muss zwei Dinge wissen -> Wo solls rein/ Was soll rein?
    let collectionRef =
      colId == 'notes' ? this.getNotesRef() : this.getTrashRef();

    await addDoc(collectionRef, item)
      .catch((error) => {
        console.log('Error: ', error);
      })
      .then((docRef) => {
        console.log('Document successfully written with ID: ', docRef?.id);
      });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  subNotesList() {
    const q = query(this.getNotesRef());
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        console.log(element.id, element.data());
      });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where('marked', '==', true), limit(4));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach((element) => {
        this.normalMarkedNotes.push(
          this.setNoteObject(element.data(), element.id)
        );
        console.log(element.id, element.data());
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  ngOnDestroy() {
    // Entfernt den Echtzeit-Listener, falls es einen gibt
    if (this.unsubNotes) {
      this.unsubNotes();
    }
    if (this.unsubTrash) {
      this.unsubTrash();
    }
    if (this.unsubMarkedNotes) {
      this.unsubMarkedNotes();
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }
}

///////////////////////////////////////////////////////////////////////////////////

// VARIANTE 1 für Echtzeitabruf von Daten:

// @Injectable({
//   providedIn: 'root'
// })
// export class NoteListService {

//     items$;
//     firestore: Firestore = inject(Firestore);

//     constructor() {
//       this.items$ = collectionData(this.getNotesRef());
//     }

//   getNotesRef() {
//     return collection(this.firestore, 'notes');
//   }

//   getTrashRef() {
//     return collection(this.firestore, 'trash');
//   }

//   getSingleDocRef(colId: string, docId: string) {
//     return doc(collection(this.firestore, colId), docId);

//   }

// }
