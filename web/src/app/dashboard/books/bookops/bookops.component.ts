import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
import { BookService } from "../../../services/book.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-add-book',
  templateUrl: './bookops.component.html',
  styleUrls: ['./bookops.component.css']
})
export class BookOpsComponent implements OnInit {

  userData: any = this.authService.currentUser;
  public userId = this.userData._id;
  
  newBookAlreadyExists;
  enterAnyNewBookName;

  editBookId;
  editBookName;
  editBookAlreadyExists;
  enterAnyEditBookName;
  bookNameBeforeEdit;

  deleteBookName;
  deleteBookId;
  errorDeletingBook = false; 

  showCreateBookDialog = false;
  showUpdateBookDialog = false;
  showDeleteBookDialog = false;
  
  dialogData;

  constructor(
    @Inject(MD_DIALOG_DATA) dialogData: any,
    public dialogRef: MdDialogRef<BookOpsComponent>,
    private bookService: BookService,
    private authService: AuthService) { this.dialogData = dialogData; }

  ngOnInit() {
    if(this.dialogData.purposeCode === 1) {
        this.showCreateBookDialog = true;
        this.showUpdateBookDialog = false;
        this.showDeleteBookDialog = false;
      } else if (this.dialogData.purposeCode === 2) {
        this.showCreateBookDialog = false;
        this.showUpdateBookDialog = true;
        this.showDeleteBookDialog = false;
        this.bookNameBeforeEdit = this.dialogData.bookData.bookName;
        this.editBookName = this.dialogData.bookData.bookName;
        this.editBookId = this.dialogData.bookData._id;
      } else if (this.dialogData.purposeCode === 3) {
        this.showCreateBookDialog = false;
        this.showUpdateBookDialog = false;
        this.showDeleteBookDialog = true;
        this.deleteBookName = this.dialogData.bookData.bookName;
        this.deleteBookId = this.dialogData.bookData._id;
      } else {
        this.dialogRef.close({ status: 204 });
      }
  }

  closeDialog() {
      this.dialogRef.close({ status: 204 });
  }

  createBook(newBookData) {
    if(newBookData.newBookName !== undefined && newBookData.newBookName != '') {
      let bookName = newBookData.newBookName;
      this.bookService.createNewBook(this.userId, bookName).subscribe((response) => {
          if(response.status === 200) {
            this.newBookAlreadyExists = false;
            this.dialogRef.close({ status: 200 });
          } else if(response.status === 409) {
            this.newBookAlreadyExists = true;
          } else {
            console.log(response);
          }
      });
    } else if (newBookData !== undefined || newBookData.newBookName != ''){
      this.enterAnyNewBookName = true;
      this.newBookAlreadyExists = false;
    } else {
      this.dialogRef.close({ status: 500 });
      console.log("CRITICAL ERROR");
    }
  }//End Create New Book    
  
editBook(editBookData) {
    if(this.editBookName !== undefined && this.editBookName != '') {
      this.bookService.editBook(this.userId, this.editBookId, this.editBookName).subscribe((response) => {
        if(response.status === 200) {
          this.editBookAlreadyExists = false;
          this.dialogRef.close({ status: 200 });
        } else if (response.status === 409 ) {
          this.editBookAlreadyExists = true;
        } else {
          console.log(response);
        }
      });
    } else if(this.editBookName !== undefined || this.editBookName != '') {
      this.enterAnyEditBookName = true;
      this.editBookAlreadyExists = false;
    } else {
      this.dialogRef.close({ status: 500 });
      console.log("CRITICAL ERROR");
    }
  }

  deleteBook() {
    this.bookService.deleteBook(this.userId, this.deleteBookId).subscribe((response) => {
      if(response.status === 200) {
        this.dialogRef.close({ status: 200 });
      } else {
        this.errorDeletingBook = true;
        console.log("Error Deleting Book");
      }
    });
  }


}
