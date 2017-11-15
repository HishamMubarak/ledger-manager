import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookfilter'
})
export class BookfilterPipe implements PipeTransform {

  transform(booksName: any, searchTerm?: any): any {
    if(searchTerm === undefined) return booksName;
    
    return booksName.filter(function(book){
      return book.bookName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
  }

}
