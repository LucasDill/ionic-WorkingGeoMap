import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import {AgmDirectionModule} from 'agm-direction';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import {} from 'google-maps';




import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
     AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU',
      libraries: ['geometry']
    }),
    AngularFireModule.initializeApp({
      apikey: "AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU",
       authDomain: "geo-mapping-proj-1574028047763.firebaseapp.com",
        databaseURL: "https://geo-mapping-proj-1574028047763.firebaseio.com",
        projectId: "geo-mapping-proj-1574028047763",
        storageBucket: "geo-mapping-proj-1574028047763.appspot.com",
        messagingSenderId: "712405217170",
        //appId: "1:712405217170:web:a223f8f2320eb644b4db4b",
        //measurementId: "G-9D0R7N8P3V" 
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
