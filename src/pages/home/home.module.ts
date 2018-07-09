import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { HttpLoaderFactory } from '../../app/app.module'

import { HomePage } from './home';


@NgModule({
  declarations: [HomePage],
  imports: [
  	IonicPageModule.forChild(HomePage),
  	TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [Http]
            }
        })
  ],
  exports: [TranslateModule]
})
export class HomePageModule { }