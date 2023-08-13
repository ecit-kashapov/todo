import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  title: string;

  constructor(private translateService: TranslateService) {
    this.translateService.get('app-title').subscribe((translation: string) => {
      this.title = translation;
    });
  }
}
