import { Component, OnInit, InjectionToken, Inject  } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
import { AccountService } from "../../../services/account.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-accountops',
  templateUrl: './accountops.component.html',
  styleUrls: ['./accountops.component.css']
})
export class AccountopsComponent implements OnInit {

  userData: any = this.authService.currentUser;
  public userId = this.userData._id;
  
  bookId;

  dialogData;
  showCreateAccountDialog = false;
  showUpdateAccountDialog = false;
  showDeleteAccountDialog = false;

  newAccountAlreadyExists = false;
  enterAnyNewAccountName = false;

  editAccountAlreadyExists = false;
  enterAnyEditAccountName = false;
  accountNameBeforeEditing = null;

  editAccountName;
  editAccountId;

  deleteAccountId;
  deleteAccountName;


  constructor(
    @Inject(MD_DIALOG_DATA) dialogData: any,
    public dialogRef: MdDialogRef<AccountopsComponent>,
    private accountService: AccountService,
    private authService: AuthService) { this.dialogData = dialogData; }

  ngOnInit() {
    if(this.dialogData.purposeCode === 1) {
        this.showCreateAccountDialog = true;
        this.showUpdateAccountDialog = false;
        this.showDeleteAccountDialog = false;
        this.bookId = this.dialogData.bookId;
      } else if (this.dialogData.purposeCode === 2) {
        this.showCreateAccountDialog = false;
        this.showUpdateAccountDialog = true;
        this.showDeleteAccountDialog = false;
        this.bookId = this.dialogData.editData.bookId;
        this.editAccountName = this.dialogData.editData.accountName;
        this.accountNameBeforeEditing = this.dialogData.editData.accountName;
        this.editAccountId = this.dialogData.editData._id;
      } else if (this.dialogData.purposeCode === 3) {
        this.showCreateAccountDialog = false;
        this.showUpdateAccountDialog = false;
        this.showDeleteAccountDialog = true;
        this.deleteAccountName = this.dialogData.deleteData.accountName;
        this.deleteAccountId = this.dialogData.deleteData._id;
        this.bookId = this.dialogData.deleteData.bookId;
      } else {
        this.dialogRef.close({ status: 204 });
      }
  }

  closeDialog() {
      this.dialogRef.close({ status: 204 });
  }

  createAccount(newAccountData) {
    if (newAccountData.newAccountName !== undefined && newAccountData.newAccountName != '') {
      let newAccountName = newAccountData.newAccountName;
      this.accountService.createNewAccount(this.userId, this.bookId, newAccountName).subscribe((response) => {
        if(response.status === 200) {
          this.newAccountAlreadyExists = false;
          this.dialogRef.close({ status:200 });
        } else if (response.status === 409) {
          this.newAccountAlreadyExists = true
        } else {
          console.log(response);
        }
      });
    } else if (newAccountData.newAccountName === undefined && newAccountData.newAccountName == '') {
      this.enterAnyNewAccountName = true;
      this.newAccountAlreadyExists = false;
    } else {
      this.dialogRef.close({ status: 500 });
      console.log("CRITICAL ERROR");
    }
  }//Create Account

  editAccount(editedAccountData) {
    if(this.editAccountName !== undefined && this.editAccountName != '') {
      this.accountService.editAccount(this.userId, this.bookId, this.editAccountId, editedAccountData)
      .subscribe(response => {
        if(response.status === 200) {
          this.editAccountAlreadyExists = false;
          this.dialogRef.close({ status:200 });
        } else if(response.status === 409) {
          this.editAccountAlreadyExists = true;
          this.enterAnyEditAccountName = false;
        } else {
          console.log(response)
        }
      });
    } else if(this.editAccountName === undefined || this.editAccountName == '') {
      this.enterAnyEditAccountName = true;
    } else {
      this.dialogRef.close({ status: 500 });
      console.log("CRITICAL ERROR");
    }
  }

  deleteAccount() {
    this.accountService.deleteAccount(this.userId, this.bookId, this.deleteAccountId)
      .subscribe(response => {
        if(response.status === 200) {
          this.dialogRef.close({ status:200 });
        } else {
          console.log(response);
          this.dialogRef.close({ status:500 });
        }
      });
  }

}
