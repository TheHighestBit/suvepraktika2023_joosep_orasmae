import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getAllData() {
    const items: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== 'language') { //The currently selected language is also stored here
        const value = localStorage.getItem(key);
        if (value) {
          items.push(value);
        }
      }
    }
    return items;
  }
  
  public getData(key: string) {
    return localStorage.getItem(key)
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public hasKey(key: string): boolean {
    console.log(localStorage.getItem(key));
    return this.getData(key) !== null;
  }
}
