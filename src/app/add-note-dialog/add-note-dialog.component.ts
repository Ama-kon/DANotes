import { Component, Output, EventEmitter } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-note-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-note-dialog.component.html',
  styleUrl: './add-note-dialog.component.scss',
})
export class AddNoteDialogComponent {
  @Output() addDialogClosed: EventEmitter<boolean> = new EventEmitter();

  title = '';
  content = '';

  constructor(private noteService: NoteListService) {}

  closeDialog() {
    this.title = '';
    this.content = '';
    this.addDialogClosed.emit(false);
  }

  addNote() {
    let item: Note = {
      type: 'note',
      title: this.title,
      content: this.content,
      marked: false,
    };
    this.noteService.addNote(item, 'notes');
    //beachte das closeDialog() zum Schluss kommt, denn es leert die Variablen
    this.closeDialog();
  }
}
