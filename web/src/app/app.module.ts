import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdCheckboxModule, MdCardModule, MdButtonModule,
         MdInputModule, MdIconModule, MdDialogModule, 
         MdTableModule, MdTabsModule, MdRadioModule, MdDatepickerModule, MdDatepicker, MdNativeDateModule, MdMenuModule, MdProgressSpinnerModule, MdSidenavModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { BooksComponent } from './dashboard//books/books.component';
import { AccountsComponent } from './dashboard/accounts/accounts.component';
import { TransactionsComponent } from './dashboard/transactions/transactions.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { AuthGuard } from "./services/auth-guard.service";
import { AuthService } from './services/auth.service';
import { BookService } from "./services/book.service";
import { AccountService } from "./services/account.service";
import { TransactionService } from "./services/transaction.service";
import { NoteService } from "./services/note.service";
import { BookOpsComponent } from './dashboard/books/bookops/bookops.component';
import { AccountopsComponent } from './dashboard/accounts/accountops/accountops.component';
import { TransopsComponent } from './dashboard/transactions/transops/transops.component';
import { BookfilterPipe } from './pipes/bookfilter.pipe';
import { AccountfilterPipe } from './pipes/accountfilter.pipe';

const appRoutes: Routes = [
  { path: '404', component: NotFoundComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'books', component: BooksComponent, canActivate: [AuthGuard] },
    { path: 'books/:bookid', component: AccountsComponent, canActivate: [AuthGuard] },
    { path: 'books/:bookid/:accountid', component: TransactionsComponent, canActivate: [AuthGuard] },
  ] },
  { path: '**', redirectTo: '/404' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingComponent,
    LoginComponent,
    BooksComponent,
    NotFoundComponent,
    AccountsComponent,
    TransactionsComponent,
    RegisterComponent,
    DashboardComponent,
    HomeComponent,
    BookOpsComponent,
    AccountopsComponent,
    TransopsComponent,
    BookfilterPipe,
    AccountfilterPipe
  ],
  entryComponents: [
    TransopsComponent,
    BookOpsComponent,
    AccountopsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),    
    BrowserModule,
    BrowserAnimationsModule,
    MdCheckboxModule,
    MdInputModule,
    MdIconModule,
    MdButtonModule,
    MdTableModule,
    MdCardModule,
    MdDialogModule,
    MdTabsModule,
    MdRadioModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdProgressSpinnerModule,
    MdSidenavModule,
    MdMenuModule,
    FormsModule,
    HttpModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    BookService,
    AccountService,
    TransactionService,
    NoteService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
