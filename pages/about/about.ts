import { Component, ViewChild, ElementRef } from "@angular/core";

import { IonicPage } from "ionic-angular";

import { NavController } from "ionic-angular";

import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

import * as firebase from "firebase/app";

import "firebase/auth";

import "firebase/firestore";
declare var google;
let data: Array<Provider>;
interface Provider {
  lat: any;
  lng: any;
  bHospital: any;
  name: any;
}
let routes: Array<routecalc> = [];
interface routecalc {
  start: any;
  end: any;
  distance: any;
  time: any;
  name: any;
}

var gmarkers, gmarkers2, gmarkers3, gmarkers4, gmarkers5, gmarkers6, gmarkers7;

var clicked_marker;
var end1, end2, end3, end4, end5;
gmarkers = [];

gmarkers2 = [];

gmarkers3 = [];

gmarkers4 = [];

gmarkers5 = [];

gmarkers6 = [];

gmarkers7 = [];

clicked_marker = [];

var chosen_location;

@IonicPage()
@Component({
  selector: "page-about",

  templateUrl: "about.html"
})
export class AboutPage {
  public hospital: AngularFireList<any>;
  //public routes: Array<routecalc>;
  //routes: <routecalc>=[];
  routelist;
  @ViewChild("map") mapElement: ElementRef;

  map: any;

  directionsService = new google.maps.DirectionsService();

  directionsDisplay = new google.maps.DirectionsRenderer();

  constructor(
    public navCtrl: NavController,
    public DataBase: AngularFireDatabase
  ) {
    this.hospital = DataBase.list("/Medical_Centers");

    this.getDataFromFirebase();

    this.getData();
  }

  items;

  getDataFromFirebase() {
    this.DataBase.list("/Medical_Centers/")
      .valueChanges()
      .subscribe(data => {
        //console.log((<any>data[3]).lat);//just for testing

        this.items = data;
      });
  }

  getData() {
    firebase
      .database()
      .ref("/Medical_Centers/")
      .once("value")
      .then(function(data) {
        //console.log(JSON.stringify(data.val()));// for testing
      });
  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 8,

      center: { lat: 48.424889, lng: -89.270721 }
    });

    this.addMarker(this.map);

    this.directionsDisplay.setMap(this.map);

    end1 = new google.maps.LatLng(48.424818, -89.270847);
    end2 = new google.maps.LatLng(49.770121, -92.838622);
    end3 = new google.maps.LatLng(48.60634, -93.392308);
    end4 = new google.maps.LatLng(49.768015, -94.499514);
    end5 = new google.maps.LatLng(50.105711, -91.927465);
  }

  addEndLocation(name) {
    this.DataBase.list("/Medical_Centers/")
      .valueChanges()
      .subscribe(
        data => {
          this.items = data;

          for (var i = 0; i < data.length; i++) {
            //console.log((<any>data[i]).bHospital);// for testing

            if ((<any>data[i]).name == name) {
              chosen_location = new google.maps.LatLng(
                (<any>data[i]).lat,
                (<any>data[i]).lng
              );
            }
          }
        }

        //chosen_location = new google.maps.LatLng(lat, lng);

        //console.log(chosen_location);
      );
    //this.getLocationNames();
  }

  getLocationNames() {
    //end1 = new google.maps.LatLng(48.424889, -89.270721);
    end1 = new google.maps.LatLng(48.42481802320564, -89.27084651730922);
    //end1 = this.addEndLocation("Thunder Bay Regional Health Science Centre");
    end2 = new google.maps.LatLng(49.770121, -92.83862199999999);
    //end2 = this.addEndLocation("Dryden Regional Health Centre");
    end3 = new google.maps.LatLng(48.60634, -93.39230800000001);
    //end3 = this.addEndLocation("Riverside Health Care Facilities");
    end4 = new google.maps.LatLng(49.768015, -94.49951399999998);
    //end4 = this.addEndLocation("Lake of the Woods District Hospital");
    end5 = new google.maps.LatLng(50.105711, -91.92746499999998);
    //end5 = this.addEndLocation("Sioux Lookout Meno Ya Win Health Centre");
  }

  addMarker(map: any) {
    // MAP CLICKED EVENT
    //console.log(routes);
    var start, end;

    var directionsService = new google.maps.DirectionsService();

    var directionsDisplay = new google.maps.DirectionsRenderer();

    map.addListener("click", function(e) {
      placeMarker(e.latLng, map);
    });

    function placeMarker(position, map) {
      for (var i = 0; i < clicked_marker.length; i++)
        clicked_marker[i].setMap(null);

      let clickedm = new google.maps.Marker({
        position: position,

        map: map,

        draggable: true
      });

      clicked_marker.push(clickedm);

      markerCoords(clickedm);

      start = new google.maps.LatLng(
        clickedm.position.lat(),
        clickedm.position.lng()
      );

      //end= new google.maps.LatLng(48.424889, -89.270721);

      //console.log(end);

      end = chosen_location;

      //console.log(end);// for testing

      //console.log(distance)

      let geocoder = new google.maps.Geocoder();

      let latlng = { lat: position.lat(), lng: position.lng() };

      geocoder.geocode({ location: latlng }, (results, status) => {
        //console.log(results);

        if (results[0].formatted_address != null) {
          //console.log("test if");// for testing
          //document.getElementById("address").innerText=(results[0].formatted_address);
        } else {
          //console.log("test else");// for testing
          //document.getElementById("address").innerText="No Address Available";
        }
      });

      end = chosen_location;

      if (end == null) {
        calculateAllRoutes(start);
      } else {
        calculateAndDisplayRoute(start, end);
      }
    }

    function markerCoords(markerobject) {
      let infoWindow = new google.maps.InfoWindow({});

      // slight bug --- the marker needs to be clicked twice when it is first dropped for coords to appear

      google.maps.event.addListener(markerobject, "click", function(evt) {
        infoWindow.setOptions({
          content:
            "<p>Latitude: " +
            evt.latLng.lat().toFixed(3) +
            "<br>Longitude: " +
            evt.latLng.lng().toFixed(3) +
            "</p>"
        });

        google.maps.event.addListener(markerobject, "click", () => {
          infoWindow.open(map, markerobject);
        });
      });

      google.maps.event.addListener(markerobject, "dragend", function(evt) {
        infoWindow.setOptions({
          content:
            "<p>Latitude: " +
            evt.latLng.lat().toFixed(3) +
            "<br>Longitude: " +
            evt.latLng.lng().toFixed(3) +
            "</p>"
        });

        google.maps.event.addListener(markerobject, "click", () => {
          infoWindow.open(map, markerobject);
        });

        start = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());

        end = chosen_location;

        if (end == null) {
          calculateAllRoutes(start);
        } else {
          calculateAndDisplayRoute(start, end);
        }
      });

      google.maps.event.addListener(markerobject, "drag", function(evt) {
        //console.log("marker is being dragged");// for testing
      });
    }

    function calculateAndDisplayRoute(start, end) {
      var routes: Array<routecalc>;
      interface routecalc {
        start: any;
        end: any;
        distance: any;
        time: any;
      }
      var div = document.getElementById("divID");

      // selected location
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            directionsDisplay.setOptions({
              draggable: false,
              map: map
            });

            directionsDisplay.setDirections(response);
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            //routes[0].start=start;
            console.log("here");
            //routes.push(start, end, dist, time);
            // console.log(this.routes);

            document.getElementById("display").innerText +=
              "Distance by Road to " +
              end +
              ": " +
              dist +
              "\nTime By Road to " +
              end +
              ": " +
              time +
              "here";
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // TBRHSC

      directionsService.route(
        {
          origin: start,
          destination: end1,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            //routes.push(start, end1, dist, time);
            document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "TBRHSC" +
              ": " +
              dist +
              "\nTime By Road to " +
              "TBRHSC" +
              ": " +
              time;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Dryden
      directionsService.route(
        {
          origin: start,
          destination: end2,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            //routes.push(start, end2, dist, time);
            document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Dryden" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Dryden" +
              ": " +
              time;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Fort Frances
      directionsService.route(
        {
          origin: start,
          destination: end3,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            //routes.push(start, end3, dist, time);
            document.getElementById("display").innerText +=
            "\nDistance by Road to " +
              "Fort Frances" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Fort Frances" +
              ": " +
              time;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Kenora
      directionsService.route(
        {
          origin: start,
          destination: end4,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            //routes.push(start, end4, dist, time);
            document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Kenora" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Kenora" +
              ": " +
              time;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Sioux Lookout
      directionsService.route(
        {
          origin: start,
          destination: end5,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            //routes.push(start, end5, dist, time);
            document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Sioux Lookout" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Sioux Lookout" +
              ": " +
              time;
            console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }

    function calculateAllRoutes(start) {
      routes.length = 0;
      /*let routes: Array<routecalc>=[];
      interface routecalc {
        start: any;
        end: any;
        distance: any;
        time: any;
      }*/
      document.getElementById("display").innerText = "";
      var div = document.getElementById("divID");
      // TBRHSC
      directionsService.route(
        {
          origin: start,
          destination: end1,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            let putin = {} as routecalc;
            putin.start = start;
            putin.end = end1;
            putin.distance = dist;
            putin.time = time;
            putin.name = "TBRHSC";
            routes.push(putin);
            /*document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "TBRHSC" +
              ": " +
              dist +
              "\nTime By Road to " +
              "TBRHSC" +
              ": " +*/
              time;
              document.getElementById("TBrad").innerHTML+="<b>Time:</b>"+time+"        <b> Distance:</b>"+dist;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Dryden
      directionsService.route(
        {
          origin: start,
          destination: end2,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            let putin = {} as routecalc;
            putin.start = start;
            putin.end = end2;
            putin.distance = dist;
            putin.time = time;
            putin.name = "Dryden";
            routes.push(putin);
            /*document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Dryden" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Dryden" +
              ": " +
              time;*/
              document.getElementById("Drad").innerHTML+="<b>Time:</b>"+time+"        <b> Distance:</b>"+dist;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Fort Frances
      directionsService.route(
        {
          origin: start,
          destination: end3,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            let putin = {} as routecalc;
            putin.start = start;
            putin.end = end3;
            putin.distance = dist;
            putin.time = time;
            putin.name = "Fort Francis";
            routes.push(putin);
           /* document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Fort Frances" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Fort Frances" +
              ": " +
              time;*/
              document.getElementById("Frad").innerHTML+="<b>Time:</b>"+time+"        <b> Distance:</b>"+dist;
            //console.log("test");
            console.log(routes);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Kenora
      directionsService.route(
        {
          origin: start,
          destination: end4,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            let putin = {} as routecalc;
            putin.start = start;
            putin.end = end4;
            putin.distance = dist;
            putin.time = time;
            putin.name = "Kenora";
            routes.push(putin);
           /* document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Kenora" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Kenora" +
              ": " +
              time;*/
              document.getElementById("Krad").innerHTML+="<b>Time:</b>"+time+"        <b> Distance:</b>"+dist;
            //console.log("test");
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Sioux Lookout
      directionsService.route(
        {
          origin: start,
          destination: end5,
          travelMode: "DRIVING"
        },
        (response, status, request) => {
          if (status === "OK") {
            var dist = response.routes[0].legs[0].distance.text;
            var time = response.routes[0].legs[0].duration.text;
            let putin = {} as routecalc;
            putin.start = start;
            putin.end = end5;
            putin.distance = dist;
            putin.time = time;
            putin.name = "Sioux Lookout";
            routes.push(putin);
           /* document.getElementById("display").innerText +=
              "\nDistance by Road to " +
              "Sioux Lookout" +
              ": " +
              dist +
              "\nTime By Road to " +
              "Sioux Lookout" +
              ": " +
              time;*/
              document.getElementById("Srad").innerHTML+="<b>Time:</b>"+time+"        <b> Distance:</b>"+dist;
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
      console.log(routes.length);
    }
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }
  CheckRoutes() {
    if (routes != null) {
      return 1;
      console.log("lookedat1");
    } else {
      return 0;
      console.log("wasnull");
    }
  }

  AddMapMarkers(e) {
    console.log(routes);
    // var last = e[e.length - 1];
    // find more sensible way to do this
    for (var i = 0; i < gmarkers.length; i++) gmarkers[i].setMap(null);
    for (var i = 0; i < gmarkers2.length; i++) gmarkers2[i].setMap(null);
    for (var i = 0; i < gmarkers3.length; i++) gmarkers3[i].setMap(null);
    for (var i = 0; i < gmarkers4.length; i++) gmarkers4[i].setMap(null);
    for (var i = 0; i < gmarkers5.length; i++) gmarkers5[i].setMap(null);
    for (var i = 0; i < gmarkers6.length; i++) gmarkers6[i].setMap(null);
    for (var i = 0; i < gmarkers7.length; i++) gmarkers7[i].setMap(null);

    console.log(e);
    console.log(e[0]);
    for (var i = 0; i < e.length; i++) {
      if (e[i] == 1) {
        this.AddHospitals();
      }
      if (e[i] == 2) {
        this.AddTele();
      }
      if (e[i] == 3) {
        this.AddHealthService();
      }
      if (e[i] == 4) {
        this.AddHele();
      }
      if (e[i] == 5) {
        this.AddAirport();
      }
      if (e[i] == 6) {
        this.AddAmbBase();
      }
      if (e[i] == 7) {
        this.AddORNGE();
      }
    }
  }

  //for (var i = 0; i < gmarkers.length; i++) gmarkers[i].setMap(null);

  AddHospitals() {
    //console.log(e);
    //add markers

    this.DataBase.list("/Medical_Centers/")
      .valueChanges()
      .subscribe(data => {
        //console.log((<any>data[3]).lat);// for testing

        this.items = data;

        var icon = {
          url:
            "https://287x912zvqyps9a1m2sjek0l-wpengine.netdna-ssl.com/wp-content/uploads/2016/08/Hospital-Symbol.png", // url

          scaledSize: new google.maps.Size(30, 30) // scaled size
        };

        var icon2 = {
          url:
            "https://www.pinclipart.com/picdir/middle/150-1503142_greek-mythology-medusa-symbol-clipart.png", // url

          scaledSize: new google.maps.Size(30, 30) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          //console.log((<any>data[i]).bHospital);// for testing

          if (
            (<any>data[i]).bHospital == true &&
            (<any>data[i]).bRegionalStrokeCentre == false
          ) {
            let marker1 = new google.maps.Marker({
              map: this.map,

              animation: google.maps.Animation.DROP,

              position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng },

              icon: icon
            });

            let content =
              "<b>Name:</b> " +
              (<any>data[i]).name +
              "<br>" +
              "<b>Address:</b> " +
              (<any>data[i]).address;

            this.addInfoWindow(marker1, content);

            gmarkers.push(marker1);
          } else if ((<any>data[i]).bRegionalStrokeCentre == true) {
            let markerTB = new google.maps.Marker({
              map: this.map,

              animation: google.maps.Animation.DROP,

              position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng },

              icon: icon2
            });

            let content =
              "<b>Name:</b> " +
              (<any>data[i]).name +
              "<br>" +
              "<b>Address:</b> " +
              (<any>data[i]).address;

            this.addInfoWindow(markerTB, content);

            gmarkers.push(markerTB);
          }
        }
      });
  }

  AddTele() {
    //add markers

    this.DataBase.list("/Medical_Centers/")
      .valueChanges()
      .subscribe(data => {
        this.items = data;

        var icon = {
          url: "https://www.freeiconspng.com/uploads/letter-t-icon-png-18.png", // url

          scaledSize: new google.maps.Size(25, 25) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          if ((<any>data[i]).bTelestroke == true) {
            let marker2 = new google.maps.Marker({
              map: this.map,

              animation: google.maps.Animation.DROP,

              position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng },

              icon: icon
            });

            let content =
              "<b>Name:</b> " +
              (<any>data[i]).name +
              "<br>" +
              "<b>Address:</b> " +
              (<any>data[i]).address;

            this.addInfoWindow(marker2, content);

            gmarkers2.push(marker2);
          }
        }
      });
  }

  AddHealthService() {
    //add markers

    this.DataBase.list("/Medical_Centers/")
      .valueChanges()
      .subscribe(data => {
        this.items = data;

        var icon = {
          url: "https://f-scope.net/images/health-services-png-1.png", // url

          scaledSize: new google.maps.Size(25, 25) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          if (
            (<any>data[i]).bHealthServices == true &&
            (<any>data[i]).bTelestroke == false &&
            (<any>data[i]).bHospital == false
          ) {
            let marker3 = new google.maps.Marker({
              map: this.map,

              animation: google.maps.Animation.DROP,

              position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng },

              icon: icon
            });

            let content =
              "<b>Name:</b> " +
              (<any>data[i]).name +
              "<br>" +
              "<b>Address:</b> " +
              (<any>data[i]).address;

            this.addInfoWindow(marker3, content);

            gmarkers3.push(marker3);
          }
        }
      });
  }

  AddHele() {
    //add markers

    this.DataBase.list("/Landing Sites/")
      .valueChanges()
      .subscribe(data => {
        this.items = data;

        var icon = {
          url:
            "https://cdn0.iconfinder.com/data/icons/medical-line-vol-2/56/helipad__landing__helicopter__emergency__fly-512.png", // url

          scaledSize: new google.maps.Size(25, 25) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          if ((<any>data[i]).type == "Helipad") {
            let marker4 = new google.maps.Marker({
              map: this.map,

              animation: google.maps.Animation.DROP,

              position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng }, //parsefloat is temporary need to fix write to database

              icon: icon
            });

            let content =
              "<b>Site Name:</b> " +
              (<any>data[i]).siteName +
              "<br>" +
              "<b>Address:</b> " +
              (<any>data[i]).Address +
              "<br>" +
              "<b>Identifier:</b> " +
              (<any>data[i]).ident;

            this.addInfoWindow(marker4, content);

            gmarkers4.push(marker4);
          }
        }
      });
  }

  AddAirport() {
    this.DataBase.list("/Landing Sites/")
      .valueChanges()
      .subscribe(data => {
        this.items = data;

        var icon = {
          url:
            "https://images.vexels.com/media/users/3/128926/isolated/preview/c60c97eba10a56280114b19063d04655-plane-airport-round-icon-by-vexels.png", // url

          scaledSize: new google.maps.Size(25, 25) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          if ((<any>data[i]).type == "Airport") {
            let marker5 = new google.maps.Marker({
              map: this.map,

              animation: google.maps.Animation.DROP,

              position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng }, //parsefloat is temporary need to fix write to database

              icon: icon
            });

            let content =
              "<b>Site Name:</b> " +
              (<any>data[i]).siteName +
              "<br>" +
              "<b>Address:</b> " +
              (<any>data[i]).Address +
              "<br>" +
              "<b>Identifier:</b> " +
              (<any>data[i]).ident;

            this.addInfoWindow(marker5, content);

            gmarkers5.push(marker5);
          }
        }
      });
  }

  AddAmbBase() {
    //add markers

    this.DataBase.list("/Ambulance Sites/")
      .valueChanges()
      .subscribe(data => {
        this.items = data;

        var icon = {
          url:
            "https://cdn.imgbin.com/11/7/2/imgbin-car-alarm-vehicle-computer-icons-truck-car-QhcxwW7Bm783X59tkTYw9HMYd.jpg", // url

          scaledSize: new google.maps.Size(26, 20) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          let marker6 = new google.maps.Marker({
            map: this.map,

            animation: google.maps.Animation.DROP,

            position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng }, //parsefloat is temporary need to fix write to database

            icon: icon
          });

          let content =
            "<b>Site Name:</b> " +
            (<any>data[i]).SiteName +
            "<br>" +
            "<b>Address:</b> " +
            (<any>data[i]).Address +
            "<br>" +
            "<b>City:</b> " +
            (<any>data[i]).city;

          this.addInfoWindow(marker6, content);

          gmarkers6.push(marker6);
        }
      });
  }

  AddORNGE() {
    //add markers

    this.DataBase.list("/ORNGE Sites/")
      .valueChanges()
      .subscribe(data => {
        this.items = data;

        var icon = {
          url:
            "https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Ornge_Logo.svg/1200px-Ornge_Logo.svg.png", // url

          scaledSize: new google.maps.Size(25, 25) // scaled size
        };

        for (var i = 0; i < data.length; i++) {
          let marker7 = new google.maps.Marker({
            map: this.map,

            animation: google.maps.Animation.DROP,

            position: { lat: (<any>data[i]).lat, lng: (<any>data[i]).lng }, //parsefloat is temporary need to fix write to database

            icon: icon
          });

          let content =
            "<b>Site Name:</b> " +
            (<any>data[i]).base_name +
            "<br>" +
            "<b>Address:</b> " +
            (<any>data[i]).Address +
            "<br>";

          this.addInfoWindow(marker7, content);

          gmarkers7.push(marker7);
        }
      });
  }
}

