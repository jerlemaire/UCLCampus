/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of Stud.UCLouvain
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    Stud.UCLouvain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Stud.UCLouvain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Stud.UCLouvain.  If not, see <http://www.gnu.org/licenses/>.
*/
import { IonicModule } from '@ionic/angular';
import { CacheModule } from 'ionic-cache';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MapService } from '../services/map-services/map-service';
import { POIService } from '../services/map-services/poi-service';
import { EventsService } from '../services/rss-services/events-service';
import { NewsService } from '../services/rss-services/news-service';
import { RssService } from '../services/rss-services/rss-service';
import { SportsService } from '../services/rss-services/sports-service';
import { AdeService } from '../services/studies-services/ade-service';
import { CourseService } from '../services/studies-services/course-service';
import { StudiesService } from '../services/studies-services/studies-service';
import { ConnectivityService } from '../services/utils-services/connectivity-service';
import { FacService } from '../services/utils-services/fac-service';
import { UserService } from '../services/utils-services/user-service';
import { UtilsService } from '../services/utils-services/utils-service';
import { LibrariesService } from '../services/wso2-services/libraries-service';
import { RepertoireService } from '../services/wso2-services/repertoire-service';
import { StudentService } from '../services/wso2-services/student-service';
import { Wso2Service } from '../services/wso2-services/wso2-service';
import { MyApp } from './app.component';
import { SettingsProvider } from "../services/utils-services/settings-service";
import { HomePage } from "../pages/home/home";
import { TutoPage } from "../pages/tuto/tuto";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { ServiceWorkerModule } from '@angular/service-worker';

// import { environment } from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [MyApp, HomePage, TutoPage],
  exports: [TranslateModule],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    CacheModule.forRoot({keyPrefix: 'UCL-cache'}),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true })
  ],
  bootstrap: [MyApp],
  providers: [
    {provide: ErrorHandler, useClass: ErrorHandler},
    AppAvailability,
    ConnectivityService,
    CourseService,
    StudiesService,
    EventsService,
    MapService,
    Market,
    POIService,
    UserService,
    Device,
    SplashScreen,
    SettingsProvider,
    StatusBar,
    GoogleMaps,
    Network,
    NewsService,
    RssService,
    LibrariesService,
    AdeService,
    CourseService,
    UtilsService,
    Wso2Service,
    SportsService,
    RepertoireService,
    StudentService,
    FacService,
    InAppBrowser,
    Geolocation
  ]
})
export class AppModule {
}
