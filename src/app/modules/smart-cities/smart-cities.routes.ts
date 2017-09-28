import { Routes } from '@angular/router';

import { SmartCitiesComponent } from './index';
import { UserAccountRoutes } from './modules/user-account/index';
import { NotificationRoutes } from './modules/notification/index';

import { HomeSmartCitiesComponent } from './components/home-smart-cities/home-smart-cities.component';
import { MapContainerComponent } from './modules/mapTrip/map-container.component';
import { MapCreateSpotComponent } from './modules/map-createspots/map-createspot.component';

import { LoggedInGuard } from '../../core/services/login/logged-in.guard';
import { LoggedInAdminGuard } from '../../core/services/login/logged-in-admin.guard';
import { LoggedInTransportAdminGuard } from '../..//core/services/login/logged-in-transport-admin.guard';

import { UserManagerRoutes } from './modules/user-manager/index';
import { UserVehicleRoutes } from './modules/user-vehicle/index';
import { GroupRoutes } from './modules/group/index';
import { VehicleTypesRoutes } from './modules/vehicle-type/index';
import { TransportScheduleRoutes } from './modules/transport-schedule/index';
import { PublicTransportRoutes } from './modules/public-transport/index';



export const SmartCitiesRoutes: Routes = [
  {
    path: 'smart-cities',
    component: SmartCitiesComponent,
    canActivate: [ LoggedInGuard ],
    children: [
      { path: '', component: HomeSmartCitiesComponent, canActivate: [ LoggedInGuard ]},
      { path: 'mapTrip', component: MapContainerComponent },
      { path: 'mapCreateSpots', component: MapCreateSpotComponent, canActivate: [ LoggedInGuard, LoggedInTransportAdminGuard ] },
      ... UserAccountRoutes,
      ... NotificationRoutes,
      ... UserManagerRoutes,
      ... UserVehicleRoutes,
      ... GroupRoutes,
      ... VehicleTypesRoutes,
      ... TransportScheduleRoutes,
      ... PublicTransportRoutes
    ]
  }
];
