import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";
import { Router, RouterLink  } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { BookService } from "../../services/book.service";
import { MdDialog } from "@angular/material";
import { BookOpsComponent } from "./bookops/bookops.component";


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {

  userData: any = this.authService.currentUser;
  public userId = this.userData._id;

  bookPageTitle = "Your Books";
  allBooks;
  dataNum;
  isLoading = false;
  deleteBookId = null;

  zeroBooksFound = false;
  bookSearchTerm;
  constructor(
    private dialog: MdDialog,    
    private router: Router, 
    private authService: AuthService,
    private bookService: BookService) { }

  ngOnInit() {
    this.getAllBooks();
  }

  bookDetails(bookid) {
    this.router.navigate(['/dashboard/books/', bookid]);
  }

  getAllBooks() {
    this.isLoading = true;
    this.bookService.getAllBooks(this.userId).subscribe((response) => {
      if(response.status === 200) {
        if(response.allBooks.length !== 0) {
          this.isLoading = false;
          this.allBooks = response.allBooks;
          this.zeroBooksFound = false;

          this.allBooks.sort(function(a, b) {
            var nameA = a.bookName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.bookName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });

        } else {
          this.isLoading = false;
          this.zeroBooksFound = true;
        }
      } else {
        this.isLoading = false;
        console.log("Error getting all books")
        console.log(response);
      }
    });
  }

  openCreateDialog() {
    let dialogRef = this.dialog.open(BookOpsComponent, {
      data: { purposeCode: 1 }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          // DO NOTHING
        } else if(response.status === 200) {
          this.getAllBooks();
        } else if (response.status !== 204 ) {
          console.log(response);
        }
      });
  }

  openEditDialog(editData) {
    let dialogRef = this.dialog.open(BookOpsComponent, {
      data: { purposeCode: 2, bookData: editData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHING
        } else if(response.status === 200) {
          this.getAllBooks();
        } else if (response.status !== 204) {
          console.log(response);
        }
      });
  }

  openDeleteDialog(deleteData) {
    let dialogRef = this.dialog.open(BookOpsComponent, {
      data: { purposeCode: 3, bookData: deleteData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHING
        } else if(response.status === 200) {
          this.getAllBooks();
        } else if (response.status !== 204) {
          console.log(response);
        }
      });
  }

}
