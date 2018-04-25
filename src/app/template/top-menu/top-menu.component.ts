import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../core/services/login/login.service';
import { IdentityUser } from '../../core/models/identity-user';
import { NotificationType } from '../../core/models/notification-type';
import { NotificationTypeService } from 'app/core/services/notification-type/notification-type.service';

import { constants } from '../../core/common/constants';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.sass']
})
export class TopMenuComponent implements OnInit {

  identityUser: IdentityUser;
  idUser:             string;
  isAdmin:            boolean;
  isSA:               boolean;
  isTransportAdmin:   boolean;
  isUser:             boolean;
  notifications:      Array<NotificationType>;
  nTraffic:           number;
  nWeather:           number;
  nEnvironment:       number;
  nPollen:            number;
  nHealth:            number;
  nSecurity:          number;
  nSOS:               number;
  nCount:             number;

  constructor(private loginService: LoginService, private router: Router, private notificationTypeService: NotificationTypeService) {
  }

  ngOnInit() {
    this.identityUser = this.loginService.getLoggedUser();
    this.isAdmin = this.loginService.isAdmin();
    this.isSA = this.loginService.isSA();
    this.isTransportAdmin = this.loginService.isTransportAdmin();
    this.isUser = this.loginService.isUser();
    this.notifications = new Array<NotificationType>();
    if (this.isUser) {
      this.idUser = this.identityUser.id;
        this.notificationTypeService
        .loadNotificationByUserId(this.idUser).subscribe(
          notifications => {
            this.notifications = notifications;
            // Setting here for javascript asynchrone
            this.nTraffic = this.checkNotification(this.notifications, 'Traffic');
            this.nWeather = this.checkNotification(this.notifications, 'Weather');
            this.nEnvironment = this.checkNotification(this.notifications, 'Environment');
            this.nPollen = this.checkNotification(this.notifications, 'Pollen');
            this.nHealth = this.checkNotification(this.notifications, 'Health');
            this.nSecurity = this.checkNotification(this.notifications, 'Security');
            this.nSOS = this.checkNotification(this.notifications, 'SOSAlerts');
            this.nCount = this.nTraffic + this.nWeather + this.nEnvironment + this.nPollen + this.nHealth + this.nSecurity + this.nSOS;
          }
      );

    }
  }

  checkNotification(notifications: Array<NotificationType>, notificationSearch: string): number {
    for (let i = 0; i < notifications.length; i++) {
      if ( notifications[i].id === notificationSearch) {
         return notifications[i].count ;
      }
    }
    return 0;
  }

  logout() {
    this.loginService.logout().subscribe(
      (res) => {
        this.router.navigate(constants.logoutRoute);
      }
    );
  }

  toggleSidebar() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle('push-right');
    }

    onChangeLocation(val) {
      this.router.navigate(['/smart-cities/notification/notification-all-user-tray/' + val]);
      // location.reload();
    }

}
