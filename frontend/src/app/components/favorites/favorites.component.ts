import { Component, OnInit, ViewChild } from '@angular/core';
import { Book } from '../../models/book';
import { MatSort } from '@angular/material/sort';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  books: Book[] = [];
  tableColumns = ['title', 'author', 'genre', 'status']; //The columns we want our book-list table to display
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {
    if (localStorageService.getData('language') === 'en') {
      this.translate.setDefaultLang('en'); //Set the default language to English
      this.translate.use('en');
    } else {
      this.translate.setDefaultLang('est'); //Set the default language to Estonian
      this.translate.use('est');
    }
  }

  ngOnInit(): void {
    const items = this.localStorageService.getAllData();
    console.log(items);
    this.books = items.map((item: string) => JSON.parse(item) as Book);
  }
  

  clearFavorites(): void {
    this.localStorageService.clearData();
    this.ngOnInit(); //Refresh the table
  }
}