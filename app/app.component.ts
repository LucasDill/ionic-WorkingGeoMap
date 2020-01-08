import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import {AfterViewInit} from '@angular/core';
import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})


export class MyApp implements AfterViewInit {

  ngAfterViewInit(): void {
    // Load google maps script after view init
    const DSLScript = document.createElement('script');
    //DSLScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU'; // replace by your API key
    DSLScript.type = 'text/javascript';
    document.body.appendChild(DSLScript);
    document.body.removeChild(DSLScript);
  }

  rootPage:any = AboutPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    });
  }
}
