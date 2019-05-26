import { UtilService } from './util.service';
import { User } from './../classes/user';
import { Shop } from './../classes/shop';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  public myCoords:any=false
  constructor(
    private util:UtilService
  ){
    navigator.geolocation.getCurrentPosition((location)=> {
      this.myCoords=location;
    });
  }

  distanceTo(to:firebase.firestore.GeoPoint, unit='flex') {
    let loc;
    if(this.myCoords){
      loc=this.myCoords;
    }else{
      return '...'
    }

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
  }

  shopDistanceByOrder(shops:Shop[],callBack){
    console.log('geoloc');
    (navigator as any).permissions.query({ name: 'geolocation' }).then(permission=>{
      if(permission.state!='granted'){
        this.util.openSnackBar('For better Experience please Accept the GeoLocation service, Thanks');
      }
    })
    navigator.geolocation.getCurrentPosition((location)=> {
      shops.forEach(aShop => {
        let lat1=location.coords.latitude;
        let lon1=location.coords.longitude;
        let lat2=aShop.location.latitude;
        let lon2=aShop.location.longitude;
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2-lat1) * Math.PI / 180;
        var dLon = (lon2-lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;

        aShop['distanceByM']=Math.round(d*1000);

        if (d>1) aShop['distance']= Math.round(d)+"km";
        else if (d<=1) aShop['distance']= Math.round(d*1000)+"m";
      });
      let data= shops.sort((shopA,shopB)=>shopA['distanceByM']-shopB['distanceByM'])
      callBack(data)
    },(e)=>{
      callBack(shops)
      this.util.openSnackBar('Could Not get Your Location Please Accept the GeoLocation Service',200000);
    });

  }
}
