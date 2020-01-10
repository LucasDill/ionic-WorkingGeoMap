import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
//import { AboutPage } from '../pages/about/about';// delete to go back to tabs 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;//change to TabsPage to go back to tabs

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    });
  }
}
