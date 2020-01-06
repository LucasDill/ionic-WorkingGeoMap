import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {AngularFireDatabase, AngularFireList } from '@angular/fire/database';

declare var google;
var gmarkers, gmarkers2,gmarkers3, gmarkers4, gmarkers5, gmarkers6, gmarkers7;
var clicked_marker;
gmarkers = [];
gmarkers2 = [];
gmarkers3 = [];
gmarkers4 = [];
gmarkers5 = [];
gmarkers6 = [];
gmarkers7 = [];
clicked_marker = [];

var chosen_location;

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
public hospital: AngularFireList<any>;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;


  constructor(public navCtrl: NavController, public DataBase: AngularFireDatabase ) {
this.hospital=DataBase.list('/Medical_Centers')
this.getDataFromFirebase();
this.getData();



  }
  items;


  getDataFromFirebase(){
    this.DataBase.list('/Medical_Centers/').valueChanges().subscribe(
      data =>{
        console.log(data[3].lat)
        this.items = data
      }
    )
  }
  getData(){
    firebase.database().ref('/Medical_Centers/').once('value').then(function(data){
    console.log(JSON.stringify(data.val()));
    })
  }

  ionViewDidLoad(){
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 8,
      center: {lat: 48.424889, lng: -89.270721},
    
    });
    this.addMarker(this.map);
    

    this.directionsDisplay.setMap(this.map);
  }

  addEndLocation(name){

      this.DataBase.list('/Medical_Centers/').valueChanges().subscribe(
      data =>{
        this.items = data

      for (var i = 0; i < data.length; i++){
      console.log(data[i].bHospital)
      if(data[i].name == name){

          chosen_location = new google.maps.LatLng(data[i].lat, data[i].lng);

        }
      }
      
    }
  
      //chosen_location = new google.maps.LatLng(lat, lng);
      //console.log(chosen_location);
)}

  addMarker(map:any){
   

// MAP CLICKED EVENT
var start, end;
    map.addListener('click', function(e) {
    placeMarker(e.latLng, map);
      });

    function placeMarker(position, map) {

      for(var i=0; i<clicked_marker.length; i++)
        clicked_marker[i].setMap(null);

    let clickedm = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true
    });
    clicked_marker.push(clickedm);
    markerCoords(clickedm);

    start= new google.maps.LatLng(clickedm.position.lat(),clickedm.position.lng());
    //end= new google.maps.LatLng(48.424889, -89.270721);
    //console.log(end);
    end = chosen_location; 
    console.log(end);
    var distance= google.maps.geometry.spherical.computeDistanceBetween(start,end);
    distance=distance/1000;
    var dist=distance.toFixed(2)
  
   document.getElementById("Dist").innerText="Straight Line Distance: "+dist+" Km";
   //console.log(distance)
   
   let geocoder= new google.maps.Geocoder;
   let latlng={lat:position.lat(),lng: position.lng()};
   geocoder.geocode({'location':latlng}, (results, status)=> {
     //console.log(results);
     if(results[0].formatted_address!=null)
     {
      console.log("test if");
      //document.getElementById("address").innerText=(results[0].formatted_address);
     }
     else{
      console.log("test else");
      //document.getElementById("address").innerText="No Address Available";
     }
     
   })
      end = chosen_location;
      calculateAndDisplayRoute(start, end);
      
  }

function markerCoords(markerobject){
  let infoWindow = new google.maps.InfoWindow({
    });
    // slight bug --- the marker needs to be clicked twice when it is first dropped for coords to appear
    google.maps.event.addListener(markerobject, 'click', function(evt){
        infoWindow.setOptions({
            content: '<p>Latitude: ' + evt.latLng.lat().toFixed(3) + '<br>Longitude: ' + evt.latLng.lng().toFixed(3) + '</p>'
        });
      google.maps.event.addListener(markerobject, 'click', () => {
      infoWindow.open(map, markerobject);
     
    });
        
    });
    google.maps.event.addListener(markerobject, 'dragend', function(evt){
        infoWindow.setOptions({
            content: '<p>Latitude: ' + evt.latLng.lat().toFixed(3) + '<br>Longitude: ' + evt.latLng.lng().toFixed(3) + '</p>'
        });
      google.maps.event.addListener(markerobject, 'click', () => {
      infoWindow.open(map, markerobject);
      
    });
        start = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());
        end = chosen_location;
        calculateAndDisplayRoute(start, end);
        
    });
    google.maps.event.addListener(markerobject, 'drag', function(evt){
        console.log("marker is being dragged");
    });  
}

function calculateAndDisplayRoute(start,end) {
    var directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setDirections(response);
        var dist=response.routes[0].legs[0].distance.text;
        var time=response.routes[0].legs[0].duration.text;
        document.getElementById("display").innerText="Distance by Road to "+end +": "+dist+"\nTime By Road to "+end+": "+time;
       
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }





}



calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        var dist=response.routes[0].legs[0].distance.text;
        var time=response.routes[0].legs[0].duration.text;
        document.getElementById("display").innerText="Distance by Road to "+this.end +": "+dist+"\nTime By Road to "+this.end+": "+time;
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
 
 /*mapClicked($event: MouseEvent) {

  google.maps.event.addListener(this.map, 'click', function(event) {
  placeMarker(this.map, event.latLng);
});


   function placeMarker(map:any, location) {
   let marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: location
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'Latitude: ' + location.lat() +
    '<br>Longitude: ' + location.lng()
  });
  infowindow.open(map,marker);
}

}*/

  
AddHospitals(e)
{

  if(e._value==true)
  {
    //add markers 

      this.DataBase.list('/Medical_Centers/').valueChanges().subscribe(
      data =>{
        console.log(data[3].lat)
        this.items = data

            var icon = 
            {
              url: 'https://287x912zvqyps9a1m2sjek0l-wpengine.netdna-ssl.com/wp-content/uploads/2016/08/Hospital-Symbol.png', // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
            };

            var icon2 = 
            {
              url: 'https://www.pinclipart.com/picdir/middle/150-1503142_greek-mythology-medusa-symbol-clipart.png', // url
              scaledSize: new google.maps.Size(30, 30), // scaled size  
            };

      for (var i = 0; i < data.length; i++){
      console.log(data[i].bHospital)
      if(data[i].bHospital == true && data[i].bRegionalStrokeCentre == false){
      let marker1=new google.maps.Marker
      ({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: {lat:data[i].lat,lng:data[i].lng},
        icon: icon
      });

    let content= "<b>Name:</b> "+data[i].name + "<br>"+"<b>Address:</b> " + data[i].address;
    this.addInfoWindow(marker1,content);

    gmarkers.push(marker1);
    
}
else if(data[i].bRegionalStrokeCentre == true){
  let markerTB=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},
      icon: icon2

    });

    let content="<b>Name:</b> " + data[i].name + "<br>"+"<b>Address:</b> " + data[i].address;
    this.addInfoWindow(markerTB,content);

    gmarkers.push(markerTB);

}

      }
      }
    )
  


  }
  
  else if(e._value==false)
{
  //remove markers


    for(var i=0; i<gmarkers.length; i++)
        gmarkers[i].setMap(null);
    
}

}
AddTele(e)
{
  if(e._value==true)
  {
    //add markers 
this.DataBase.list('/Medical_Centers/').valueChanges().subscribe(
      data =>{
        this.items = data

var icon = {
    url: 'https://www.freeiconspng.com/uploads/letter-t-icon-png-18.png', // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
   
};


for (var i = 0; i < data.length; i++){
if(data[i].bTelestroke == true){
  let marker2=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},
      icon: icon

    });

    let content="<b>Name:</b> " +data[i].name + "<br>" +"<b>Address:</b> "+ data[i].address;
    this.addInfoWindow(marker2,content);

    gmarkers2.push(marker2);
    
}

      }
      }
    )
  


  }
  
  else if(e._value==false)
{
  //remove markers


    for(var i=0; i<gmarkers2.length; i++)
        gmarkers2[i].setMap(null);
    
}
}
AddHealthService(e)
{
  if(e._value==true)
  {
    //add markers 
this.DataBase.list('/Medical_Centers/').valueChanges().subscribe(
      data =>{
        this.items = data

var icon = {
    url: 'https://f-scope.net/images/health-services-png-1.png', // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
   
};


for (var i = 0; i < data.length; i++){
if(data[i].bHealthServices == true){
  let marker3=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},
      icon: icon

    });

    let content="<b>Name:</b> "+ data[i].name + "<br>"+"<b>Address:</b> " + data[i].address;
    this.addInfoWindow(marker3,content);

    gmarkers3.push(marker3);
    
}

      }
      }
    )
  


  }
  
  else if(e._value==false)
{
  //remove markers


    for(var i=0; i<gmarkers3.length; i++)
        gmarkers3[i].setMap(null);
    
}
}

AddHele(e)
{
  {
  if(e._value==true)
  {
    //add markers 
this.DataBase.list('/Landing Sites/').valueChanges().subscribe(
      data =>{
        this.items = data

var icon = {
    url: 'https://cdn0.iconfinder.com/data/icons/medical-line-vol-2/56/helipad__landing__helicopter__emergency__fly-512.png', // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
   
};

for (var i = 0; i < data.length; i++){
if(data[i].type == "Helipad"){
  let marker4=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},//parsefloat is temporary need to fix write to database 
      icon: icon
    });

    let content= "<b>Site Name:</b> "+data[i].siteName + "<br>" +"<b>Address:</b> " +data[i].Address+"<br>"+"<b>Identifier:</b> "+data[i].ident;
    this.addInfoWindow(marker4,content);

    gmarkers4.push(marker4);
    
}
        }
      }
    )
  }
  else if(e._value==false)
    {
  //remove markers


    for(var i=0; i<gmarkers4.length; i++)
        gmarkers4[i].setMap(null);
    
    }
  }
}

AddAirport(e)
{
  {
  if(e._value==true)
  {
    //add markers 
this.DataBase.list('/Landing Sites/').valueChanges().subscribe(
      data =>{
        this.items = data

var icon = {
    url: 'https://images.vexels.com/media/users/3/128926/isolated/preview/c60c97eba10a56280114b19063d04655-plane-airport-round-icon-by-vexels.png', // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
   
};

for (var i = 0; i < data.length; i++){
if(data[i].type == "Airport"){
  let marker5=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},//parsefloat is temporary need to fix write to database 
      icon: icon
    });

    let content= "<b>Site Name:</b> "+data[i].siteName + "<br>" +"<b>Address:</b> " +data[i].Address+"<br>"+"<b>Identifier:</b> "+data[i].ident;
    this.addInfoWindow(marker5,content);

    gmarkers5.push(marker5);
    
}
        }
      }
    )
  }
  else if(e._value==false)
    {
  //remove markers


    for(var i=0; i<gmarkers5.length; i++)
        gmarkers5[i].setMap(null);
    
    }
  }
}
AddAmbBase(e)
{
  {
  if(e._value==true)
  {
    //add markers 
this.DataBase.list('/Ambulance Sites/').valueChanges().subscribe(
      data =>{
        this.items = data

var icon = {
    url: 'https://cdn.imgbin.com/11/7/2/imgbin-car-alarm-vehicle-computer-icons-truck-car-QhcxwW7Bm783X59tkTYw9HMYd.jpg', // url
    scaledSize: new google.maps.Size(26, 20), // scaled size
   
};

for (var i = 0; i < data.length; i++){

  let marker6=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},//parsefloat is temporary need to fix write to database 
      icon: icon
    });

    let content= "<b>Site Name:</b> "+data[i].SiteName + "<br>" +"<b>Address:</b> " +data[i].Address+"<br>"+"<b>City:</b> "+data[i].city;
    this.addInfoWindow(marker6,content);

    gmarkers6.push(marker6);
    

        }
      }
    )
  }
  else if(e._value==false)
    {
  //remove markers


    for(var i=0; i<gmarkers6.length; i++)
        gmarkers6[i].setMap(null);
    
    }
  }
}
AddORNGE(e)
{
  if(e._value==true)
  {
    //add markers 
this.DataBase.list('/ORNGE Sites/').valueChanges().subscribe(
      data =>{
        this.items = data

var icon = {
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Ornge_Logo.svg/1200px-Ornge_Logo.svg.png', // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
   
};

for (var i = 0; i < data.length; i++){

  let marker7=new google.maps.Marker({
     
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {lat:data[i].lat,lng:data[i].lng},//parsefloat is temporary need to fix write to database 
      icon: icon
    });

    let content= "<b>Site Name:</b> "+data[i].base_name + "<br>" +"<b>Address:</b> " +data[i].Address+"<br>";
    this.addInfoWindow(marker7,content);

    gmarkers7.push(marker7);
    

        }
      }
    )
  }
  else if(e._value==false)
    {
  //remove markers


    for(var i=0; i<gmarkers7.length; i++)
        gmarkers7[i].setMap(null);
    
    }
  }


}
