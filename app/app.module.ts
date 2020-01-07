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
      apiKey: "AIzaSyB6NmY0iFundTq06rk3mpc5Wk7LwbWdUw0",
    authDomain: "degree-project-database.firebaseapp.com",
    databaseURL: "https://degree-project-database.firebaseio.com",
    projectId: "degree-project-database",
    storageBucket: "degree-project-database.appspot.com",
    messagingSenderId: "527765428487",
    appId: "1:527765428487:web:57170a630f65e0bc8b4da2",
    measurementId: "G-ML39B2PXC4" 
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
