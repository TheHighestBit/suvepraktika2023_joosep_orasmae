import { Component, OnInit, ViewChild } from '@angular/core';
import { Book } from '../../models/book';
import { MatSort } from '@angular/material/sort';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    const items = this.localStorageService.getAllData();
    this.books = items.map((item: string) => JSON.parse(item) as Book);
  }
  

  clearFavorites(): void {
    this.localStorageService.clearData();
    this.ngOnInit(); //Refresh the table
  }
}