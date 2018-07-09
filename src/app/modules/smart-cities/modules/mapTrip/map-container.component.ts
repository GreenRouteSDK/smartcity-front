import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {

  map_url:SafeUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.map_url = this.sanitizer.bypassSecurityTrustResourceUrl(environment.routingmap_url);
  }

  ngOnInit() {
  }

}
