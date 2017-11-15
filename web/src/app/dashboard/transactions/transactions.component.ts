import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NoteService } from "../../services/note.service";
import { TransactionService } from "../../services/transaction.service";
import { MdDialog } from "@angular/material";
import { TransopsComponent } from "./transops/transops.component";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  bookid;
  accountId;
  userid = this.authService.currentUser._id;
  bookName: string = null;
  accountName: string = null;
  isLoading = false;

  zeroTransFound = false;
  zeroNotesFound = false;

  accountData;
  transactions;
  allNotes;

  toggleTabView = true;
  showTransEditForm = false;
  showNoteEditForm = false;
  sortDateAscending = true;
  
  notesTitle: string = "Account Notes";
  showTrash = false;
  
  editDate = null;
  editDescription = null;
  editAmountRadio = null;
  editType = null;
  editAmount = null;
  editTransId = null;
  
  editNoteId = null;
  editNoteTextArea = null;

  deleteTransId;

  toggleView() {
    if(this.toggleTabView === true) {
      this.toggleTabView = false;
    } else {
      this.toggleTabView = true;
    }
  }

  constructor(
    private dialog: MdDialog,
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private noteService: NoteService,
    private authService: AuthService) { }

  ngOnInit() { 

    this.route.paramMap
      .subscribe(params => {
        this.bookid = params.get('bookid'),
        this.accountId = params.get('accountid')
      });

      this.getAllTransactions();
      this.getAllNotes();
  }

  getAllTransactions() {
    this.isLoading = true;
    this.transactionService.getTransactions(this.userid, this.bookid, this.accountId)
      .subscribe(response => {
        this.isLoading = false;
        this.bookName = response.bookName;
        this.accountName = response.accountName;
        if(response.status === 200 && response.data.length !== 0) {
          let allTransactions = [];
          response.data.reduce(function(sum, eachTransaction){
              eachTransaction.balance = sum + eachTransaction.debitAmt - eachTransaction.creditAmt;
              allTransactions.push(eachTransaction);
              return eachTransaction.balance;
          }, 0);
          this.transactions = allTransactions;
          this.zeroTransFound = false;
        } else if(response.status === 204 || response.data.length === 0) {
          this.zeroTransFound = true;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          console.log("Error");
          console.log(response);
        }
      });
  }

  openCreateTransDialog() {
    let dialogRef = this.dialog.open(TransopsComponent, {
      data : { purposeCode: 1, bookId: this.bookid, accountId: this.accountId }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHING
        } else if (response.status === 200) {
          this.getAllTransactions();
        } else if (response.status !== 204) {
          console.log("Error");
        }
      });
  }

  openEditTransDialog(editTransData) {
    let dialogRef = this.dialog.open(TransopsComponent, {
      data : { purposeCode: 2, bookId: this.bookid, accountId: this.accountId, transData: editTransData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHING
        } else if (response.status === 200) {
          this.getAllTransactions();
        } else if (response.status !== 204) {
          console.log("Error");
        }
      });
  }

  openDeleteTransDialog(deleteTransData) {
    let dialogRef = this.dialog.open(TransopsComponent, {
      data : { purposeCode: 3, bookId: this.bookid, accountId: this.accountId, transData: deleteTransData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
            //DO NOTHING
        } else if (response.status === 200) {
            this.getAllTransactions();
        } else if (response.status !== 204) {
            console.log("Error");
        }
      });
  }

  switchTransactionsSorting() {
    if(this.sortDateAscending === false) {
      this.sortDateAscending = true;
      this.transactions.sort(function(a,b){
        var dateA:any = new Date(a.date), dateB:any = new Date(b.date);
        return dateA - dateB;
      });
    } else {
      this.sortDateAscending = false;
      this.transactions.sort(function(a,b){
        var dateA:any = new Date(a.date), dateB:any = new Date(b.date);
        return dateB - dateA;
      });
    }
  }

  // ================================= NOTES METHODS  ================================= //

  getAllNotes(flag?) {

    var activeFlag = flag === 0? 0 : 1;
    this.showTrash = activeFlag === 1? false: true;
    this.notesTitle = activeFlag === 1? "Account Notes" : "Deleted Notes";

    this.noteService.getAllNotes(this.userid, this.bookid, this.accountId, activeFlag)
      .subscribe(response => {
        if(response.status === 200) {
            this.allNotes = response.data;
            this.zeroNotesFound = false;
        } else if (response.status === 204) {
          this.zeroNotesFound = true;
        } else {
          this.zeroNotesFound = true;
          console.log("Error Getting Notes")
        }
    });
  }

  openCreateNoteDialog() {
    let dialogRef = this.dialog.open(TransopsComponent, {
      data : { purposeCode: 4, bookId: this.bookid, accountId: this.accountId }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHING
        } else if (response.status === 200) {
          this.getAllNotes();
        } else if (response.status !== 204) {
          console.log("Error");
        }
      });
  }

  openEditNoteDialog(editNoteData) {
    let dialogRef = this.dialog.open(TransopsComponent, {
      data : { purposeCode: 5, bookId: this.bookid, accountId: this.accountId, noteData: editNoteData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHING
        } else if (response.status === 200) {
          this.getAllNotes();
        } else if (response.status !== 204) {
          console.log("Error");
        }
      });
  }

  openDeleteNoteDialog(deleteNoteData) {
    let dialogRef = this.dialog.open(TransopsComponent, {
      data : { purposeCode: 6, bookId: this.bookid, accountId: this.accountId, noteData: deleteNoteData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
            //DO NOTHING
        } else if (response.status === 200) {
            this.getAllNotes();
        } else if (response.status !== 204) {
            console.log("Error");
        }
      });
  }

}
