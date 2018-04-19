import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SmartCitiesComponent } from './smart-cities.component';
import { MapContainerComponent } from './modules/mapTrip/map-container.component';
import { StatisticsContainerComponent } from './modules/statistics/statistics-container.component';
import { MapEarthquakeComponent } from './modules/mapEarthquake/map-earthquake.component';

// Se van a borrar
import { HomeSmartCitiesComponent } from './components/home-smart-cities/home-smart-cities.component';

// Elementos del template
import { TemplateModule } from '../../template/template.module';

// Submodulos
import { UserAccountModule } from './modules/user-account/user-account.module';
import { NotificationModule } from './modules/notification/notification.module';

import { ModalPopupModule  } from '../../usable-component/modal-popup/modalpopup.module';

import { UserManagerModule } from './modules/user-manager/user-manager.module';
import { UserVehicleModule } from './modules/user-vehicle/user-vehicle.module';
import { GroupModule } from './modules/group/group.module';
import { VehicleTypeModule } from './modules/vehicle-type/vehicle-type.module';
import { TransportScheduleModule } from './modules/transport-schedule/transport-schedule.module';
import { PublicTransportModule } from './modules/public-transport/public-transport.module';



@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    UserAccountModule,
    NotificationModule,
    TemplateModule,
    UserManagerModule,
    UserVehicleModule,
    GroupModule,
    VehicleTypeModule,
    ModalPopupModule,
    TransportScheduleModule,
    PublicTransportModule
  ],
  declarations: [
    SmartCitiesComponent,
    HomeSmartCitiesComponent,
    MapContainerComponent,
    MapEarthquakeComponent,
    StatisticsContainerComponent
  ],
  exports: [
    SmartCitiesComponent
  ]
})
export class SmartCitiesModule { }
