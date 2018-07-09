import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../core/services/login/login.service';
import { IdentityUser } from '../../core/models/identity-user';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

import { constants } from '../../core/common/constants';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass']
})
export class MainMenuComponent implements OnInit {

  isActive = false;
  showMenu = '';
  showSetting = '';
  showMenuManageSite = '';
  showMenuPublicTransport = '';
  showMenuTransportSchedule = '';
  showMenuAlert = '';
  showMenuPlanMyTrip = '';
  showMenuSubscriptionToGroups = '';

  identityUser: IdentityUser;

  alerts_url: SafeUrl;

  isAdmin:            boolean;
  isSA:               boolean;
  isTransportAdmin:   boolean;
  isUser:             boolean;

  constructor(private loginService: LoginService, private router: Router, private sanitizer: DomSanitizer) {
    this.alerts_url = this.sanitizer.bypassSecurityTrustUrl(environment.alerts_url);
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addExpandSubClass(element: any) {
    if (element === this.showSetting) {
      this.showSetting = '0';
    } else {
      this.showSetting = element;
    }
  }

  addExpandshowMenuManageSite(element: any) {
    if (element === this.showMenuManageSite) {
      this.showMenuManageSite = '0';
    } else {
      this.showMenuManageSite = element;
    }
  }

  addExpandshowPublicTransport(element: any) {
    if (element === this.showMenuPublicTransport) {
      this.showMenuPublicTransport = '0';
    } else {
      this.showMenuPublicTransport = element;
    }
  }

  addExpandshowTransportSchedule(element: any) {
    if (element === this.showMenuTransportSchedule) {
      this.showMenuTransportSchedule = '0';
    } else {
      this.showMenuTransportSchedule = element;
    }
  }

  addMenuAlert(element: any) {
    if (element === this.showMenuAlert) {
        this.showMenuAlert = '0';
    } else {
        this.showMenuAlert = element;
    }
  }

  addMenuPlanMyTrip (element: any ){
    if (element === this.showMenuPlanMyTrip) {
      this.showMenuPlanMyTrip = '0';
    } else {
        this.showMenuPlanMyTrip = element;
     }
  }

  addMenuSubscriptionToGroups (element: any ) {
    if (element === this.showMenuSubscriptionToGroups) {
      this.showMenuSubscriptionToGroups = '0';
    } else {
      this.showMenuSubscriptionToGroups = element;
    }
  }

  ngOnInit() {
    this.identityUser = this.loginService.getLoggedUser();
    this.isAdmin = this.loginService.isAdmin();
    this.isSA = this.loginService.isSA();
    this.isTransportAdmin = this.loginService.isTransportAdmin();
    this.isUser = this.loginService.isUser();
  }

  logout() {
    this.loginService.logout().subscribe(
      (res) => {
        this.router.navigate(constants.logoutRoute);
      }
    );
  }

  onChangeLocation(val) {
    this.router.navigate(['/smart-cities/notification/notification-all-user-tray/' + val]);
  }

}
