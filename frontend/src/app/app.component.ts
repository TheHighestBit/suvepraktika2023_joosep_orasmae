import { Component } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(private localStorageService: LocalStorageService) {
  }

  changeLanguage() { //When the user clicks on the change language button
    if (this.localStorageService.getData('language') === 'en') {
    this.localStorageService.saveData('language', 'est');
    } else {
      this.localStorageService.saveData('language', 'en');
    }

    window.location.reload(); //Reload the page to render the new language
}
}
