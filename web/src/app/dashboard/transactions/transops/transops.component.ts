import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
import { AuthService } from "../../../services/auth.service";
import { TransactionService } from "../../../services/transaction.service";
import { NoteService } from "../../../services/note.service";

@Component({
  selector: 'app-transops',
  templateUrl: './transops.component.html',
  styleUrls: ['./transops.component.css']
})
export class TransopsComponent implements OnInit {

  dialogData;

  userid = this.authService.currentUser._id;
  bookId;
  accountId;

  showNewTransForm = false;
  similarNewTransExists= false;
  currentDate = new Date();

  showEditTransForm = false;
  editTransData;
  editDate = null;
  editDescription = null;
  editAmountRadio = null;
  editType = null;
  editAmount = null;
  editTransId = null;

  showDeleteTransForm = false;
  deleteTransId = null;
  
  showNewNoteForm = false;

  showEditNoteForm= false;
  editNoteTextArea = null;
  noteTextBeforeEdit = null;
  editNoteId = null;

  showDeleteNoteForm = false;
  deleteNoteId = null;

  dialogError = false;

  constructor(
    @Inject(MD_DIALOG_DATA) dialogData: any,
    public dialogRef: MdDialogRef<TransopsComponent>,
    private authService: AuthService,
    private transactionService: TransactionService,
    private noteService: NoteService) { this.dialogData = dialogData }

  ngOnInit() {
    if(this.dialogData.purposeCode === 1) {
      this.showNewTransForm = true;
      this.showEditTransForm = false;
      this.showDeleteTransForm = false;
      this.showNewNoteForm = false;
      this.showEditNoteForm= false;
      this.showDeleteNoteForm = false;
      this.dialogError = false;
      this.bookId = this.dialogData.bookId;
      this.accountId = this.dialogData.accountId;

    } else if (this.dialogData.purposeCode === 2) {
      this.showNewTransForm = false;
      this.showEditTransForm = true;
      this.showDeleteTransForm = false;
      this.showNewNoteForm = false;
      this.showEditNoteForm= false;
      this.showDeleteNoteForm = false;
      this.dialogError = false;
      this.bookId = this.dialogData.bookId;
      this.accountId = this.dialogData.accountId;
      this.editTransData = this.dialogData.transData;
      this.editDate = this.editTransData.date;
      this.editDescription = this.editTransData.description;
      this.editAmountRadio = this.editTransData.transType;
      this.editType = this.editTransData.transType;
      this.editAmount = this.editType == "credit" ? this.editTransData.creditAmt : this.editTransData.debitAmt;
      this.editTransId = this.editTransData.transId;

    } else if (this.dialogData.purposeCode === 3) {
      this.showNewTransForm = false;
      this.showEditTransForm = false;
      this.showDeleteTransForm = true;
      this.showNewNoteForm = false;
      this.showEditNoteForm= false;
      this.showDeleteNoteForm = false;
      this.dialogError = false;
      this.bookId = this.dialogData.bookId;
      this.accountId = this.dialogData.accountId;
      this.deleteTransId = this.dialogData.transData.transId;

    } else if (this.dialogData.purposeCode === 4) {
      this.showNewTransForm = false;
      this.showEditTransForm = false;
      this.showDeleteTransForm = false;
      this.showNewNoteForm = true;
      this.showEditNoteForm= false;
      this.showDeleteNoteForm = false;
      this.dialogError = false;
      this.bookId = this.dialogData.bookId;
      this.accountId = this.dialogData.accountId;

    } else if (this.dialogData.purposeCode === 5) {
      this.showNewTransForm = false;
      this.showEditTransForm = false;
      this.showDeleteTransForm = false;
      this.showNewNoteForm = false;
      this.showEditNoteForm= true;
      this.showDeleteNoteForm = false;
      this.dialogError = false;
      this.bookId = this.dialogData.bookId;
      this.accountId = this.dialogData.accountId;
      this.editNoteId = this.dialogData.noteData.noteId;
      this.editNoteTextArea = this.dialogData.noteData.noteText;
      this.noteTextBeforeEdit = this.dialogData.noteData.noteText;

    } else if (this.dialogData.purposeCode === 6) {
      this.showNewTransForm = false;
      this.showEditTransForm = false;
      this.showDeleteTransForm = false;
      this.showNewNoteForm = false;
      this.showEditNoteForm= false;
      this.showDeleteNoteForm = true;
      this.dialogError = false;
      this.bookId = this.dialogData.bookId;
      this.accountId = this.dialogData.accountId;
      this.editNoteId = this.dialogData.noteData.noteId;
      this.deleteNoteId = this.dialogData.noteData.noteId;
    } else {
      this.showNewTransForm = false;
      this.showEditTransForm = false;
      this.showDeleteTransForm = false;
      this.showNewNoteForm = false;
      this.showEditNoteForm= false;
      this.showDeleteNoteForm = false;
      this.dialogError = true;
    }
  }

  closeDialog() {
      this.dialogRef.close({ status: 204 });
  }

  addNewTrans(formData) {
    this.transactionService.addTransaction(this.userid, this.bookId, this.accountId, formData)
      .subscribe(response => {
        if(response.status === 200) {
          this.similarNewTransExists = false;
          this.dialogRef.close({ status: 200 });
        } else {
          console.log("Returned Status NOT 200 or 409")
        }
      });
  }

  editTrans(formData) {
    formData.editTransId = this.editTransId;
    this.transactionService.editTransaction(this.userid, this.bookId, this.accountId, formData)
      .subscribe(response => {
        if(response.status === 200) {
          this.similarNewTransExists = false;
          this.dialogRef.close({ status: 200 });
        } else {
          console.log(response);
        }
      });
  }

  deleteTrans() {
    this.transactionService.deleteTransaction(this.userid, this.bookId, this.accountId, this.deleteTransId)
      .subscribe(response => {
        if(response.status === 200) {
          this.dialogRef.close({ status: 200 });
        } else {
          console.log("Error Deleting Transaction")
        }
      })
  }

  addNote(formData) {
    this.noteService.addNewNote(this.userid, this.bookId, this.accountId, formData)
      .subscribe(response => {
        if(response.status === 200) {
          this.dialogRef.close({ status: 200 });
        } else {
          console.log("Error Adding New Note");
        }
    });
  } 

  editNote(formData) {
    formData.noteId = this.editNoteId;
    this.noteService.editNote(this.userid, this.bookId, this.accountId, formData)
      .subscribe(response => {
        if(response.status === 200) {
          this.dialogRef.close({ status: 200 });
        } else {
          console.log("Error Edit Note Modal");
        }
      });
  }

  deleteNote() {
    this.noteService.deleteNote(this.userid, this.bookId, this.accountId, this.deleteNoteId)
      .subscribe(response => {
        if(response.status === 200) {
          this.dialogRef.close({ status: 200 });
        } else {
          this.dialogRef.close({ status: 500 });
        }
      });
  }

}
