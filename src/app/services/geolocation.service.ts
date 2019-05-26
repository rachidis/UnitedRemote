import { User } from './../classes/user';
import { Shop } from './../classes/shop';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  public myCoords:any=false
  constructor(){
    this.mylocation().then(coords=>{
      this.myCoords=coords;
    })
  }

  mylocation(){
   return new Promise((resolve)=>{
    navigator.geolocation.getCurrentPosition((location)=> {
      resolve(location)
    });
   })
  }
  distanceTo(to:firebase.firestore.GeoPoint, unit='flex') {
    return this.mylocation().then((loc:Position)=>{
      let lat1=loc.coords.latitude;
      let lon1=loc.coords.longitude;
      let lat2=to.latitude;
      let lon2=to.longitude;
      var R = 6371; // km (change this constant to get miles)
      var dLat = (lat2-lat1) * Math.PI / 180;
      var dLon = (lon2-lon1) * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      if(unit=='km'){
        return Math.round(d)
      }else if(unit=='m'){
        return Math.round(d*1000)
      }
      if (d>1) return Math.round(d)+"km";
      else if (d<=1) return Math.round(d*1000)+"m";
      return d;
    })
  }

}
