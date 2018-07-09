import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'statistics-container',
  templateUrl: './statistics-container.component.html',
  styleUrls: ['./statistics-container.component.css']
})
export class StatisticsContainerComponent implements OnInit {

  statistics_url:SafeUrl;
  
  constructor(private sanitizer: DomSanitizer) {
    this.statistics_url = this.sanitizer.bypassSecurityTrustResourceUrl(environment.statistics_url);
   }

  ngOnInit() {
  }

}
