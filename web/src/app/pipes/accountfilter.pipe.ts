import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountfilter'
})
export class AccountfilterPipe implements PipeTransform {

  transform(accountsName: any, searchTerm?: any): any {
    if(searchTerm === undefined) return accountsName;
    
    return accountsName.filter(function(account){
      return account.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

}
