import { Component } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { NavController } from 'ionic-angular';
import {AgmDirectionModule} from 'agm-direction';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles:[`
  agm-map {
    height: 50%;
  }
  `]
})
export class HomePage {
// google maps zoom level
  zoom: number = 8;
  
  // initial center position for the map
  lat: number = 48.425185;
  lng: number = -89.269674;

  constructor(public navCtrl: NavController) {
  }
//directionsService = new google.maps.DirectionsService;



clickedMarker(label: string, index: number) {
   // console.log(`clicked the marker: ${label || index}`)
  }
  markers=undefined;
  travel=undefined;
  mapClicked($event: MouseEvent) {
    this.markers={
      Marklat: $event.coords.lat,
      Marklng: $event.coords.lng,
      Markdraggable: true
    }
    const start= new google.maps.LatLng(this.markers.Marklat,this.markers.Marklng);
    const end= new google.maps.LatLng(this.lat,this.lng);
    var distance= google.maps.geometry.spherical.computeDistanceBetween(start,end);
    distance=distance/1000;
    var dist=distance.toFixed(2)
    document.getElementById("Dist").innerText="Straight Line Distance: "+dist+" Km";
   // console.log(distance)
   
   let geocoder= new google.maps.Geocoder;
   let latlng={lat:this.markers.Marklat,lng: this.markers.Marklng};
   geocoder.geocode({'location':latlng}, (results, status)=> {
     //console.log(results);
     if(results[0].formatted_address!=null)
     {
      document.getElementById("address").innerText=(results[0].formatted_address);
     }
     else{
       document.getElementById("address").innerText="No Adress Available";
     }
     
   })
   this.calcRoute(start,end);
  }
calcRoute(start,end) {
     var directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        var dist=response.routes[0].legs[0].distance.text;
        var time=response.routes[0].legs[0].duration.text;
        document.getElementById("Route").innerText="Distance by Road to TBRHSC: "+dist+"\nTime By road to TBRHSC: "+time;
      } else if(status="ZERO_RESULTS") {
        document.getElementById("Route").innerText='No Route Available by Road Status: '+status;
      }
    });
  }


  markerDragEnd( markers, $event: MouseEvent) {
    console.log('dragEnd', markers, $event);
    this.markers.Marklat=$event.coords.lat;
    this.markers.Marklng=$event.coords.lng;
    const start= new google.maps.LatLng($event.coords.lat,$event.coords.lng);
    const end= new google.maps.LatLng(this.lat,this.lng);
    var distance= google.maps.geometry.spherical.computeDistanceBetween(start,end);
    distance=distance/1000;
    var dist=distance.toFixed(2)
    document.getElementById("Dist").innerText="Straight Line Distance: "+dist+" Km";
   // console.log(distance)
   this.calcRoute(start,end);
  }
  

  
}

// just an interface for type safety.
interface marker {
	Marklat: number;
	Marklng: number;
	Markdraggable: boolean;
}
