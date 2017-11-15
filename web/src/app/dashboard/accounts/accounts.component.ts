import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { AuthService } from "../../services/auth.service";
import { MdDialog } from "@angular/material";
import { AccountopsComponent } from "./accountops/accountops.component";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  userData: any = this.authService.currentUser;
  public userId = this.userData._id;

  bookid;
  bookName = null;
  allAccounts;
  totalAccountBalance = 0;
  isLoading = false;

  newAccountName = null;

  editAccountId = null;
  editAccountName = null;
  showEditForm = false;
  
  deleteAccountId;
  
  zeroAccountsFound = false;
  accountSearchTerm;

  constructor(
    private dialog: MdDialog,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {this.bookid = params.get('bookid');}); //Get BookID from Route
    this.getAllAccounts(); //Get all accounts in this book.
  } //End ngOnInit

  getAllAccounts() {

    this.isLoading = true;
    this.totalAccountBalance = 0;
    this.accountService.getAllAccounts(this.userId, this.bookid)
      .subscribe(response => {

        if(response.status === 200) {

          this.bookName = response.bookName;
          if(response.data.length !== 0) {
            this.allAccounts = response.data;
            this.zeroAccountsFound = false;
            this.allAccounts.forEach(function(element) {
                if(element.transactions == undefined) {
                    element.totalBalance = 0;
                } else {
                    element.totalBalance = element.transactions.reduce(function(sum, eachTransaction){
                        return sum + eachTransaction.creditAmt - eachTransaction.debitAmt;
                    }, 0);
                    this.totalAccountBalance += element.totalBalance;
                }
            }, this);

            this.allAccounts.sort(function(a, b) {
              var nameA = a.accountName.toUpperCase(); // ignore upper and lowercase
              var nameB = b.accountName.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // names must be equal
              return 0;
            });
            this.isLoading = false;

          } else {
            this.isLoading = false;
            this.zeroAccountsFound = true;
          }
        } else {
          this.isLoading = false;
          console.log("Error getting all accounts")
          console.log(response);
        }
    });
  }

  openCreateDialog() {
    let dialogRef = this.dialog.open(AccountopsComponent, {
      data: { purposeCode: 1, bookId: this.bookid }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHINGS
        } else if(response.status === 200) {
          this.getAllAccounts();
        } else if (response.status !== 204 ) {
          console.log(response);
        }
      });
  }

  openEditDialog(accountData) {
    let dialogRef = this.dialog.open(AccountopsComponent, {
      data: { purposeCode: 2, editData: accountData }
    })
      .afterClosed()
      .subscribe(response => {
        if(response === undefined) {
          //DO NOTHINGS
        } else if(response.status === 200) {
          this.getAllAccounts();
        } else if (response.status !== 204 ) {
          console.log(response);
        }
      });
  }

  submitAccountEdit(editedAccountData) {
    this.accountService.editAccount(this.userId, this.bookid, this.editAccountId, editedAccountData)
      .subscribe(response => {
        if(response.status === 200) {
          this.getAllAccounts();
          this.showEditForm = false;
        } else {
          console.log("Error Editing Account Name")
        }
      });
  }

  openDeleteDialog(accountData) {
    let dialogRef = this.dialog.open(AccountopsComponent, {
     data: { purposeCode: 3, deleteData: accountData }
    })
      .afterClosed()
      .subscribe(response => {
      if(response === undefined) {
          //DO NOTHING
        } else if(response.status === 200) {
          this.getAllAccounts();
        } else if (response.status === 500) {
          console.log("Error Deleting Account");
        }
      });
  }

}
