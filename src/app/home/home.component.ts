import { GeolocationService } from './../services/geolocation.service';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FirestorageService } from './../services/firestorage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { MatTableDataSource, MatPaginator, MatSortable } from '@angular/material';
import { Shop } from '../classes/shop';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns: string[] = ['shop'];
  public allShops:MatTableDataSource<Shop>;
  constructor(
    public shopS:ShopService,
    public storageS:FirestorageService,
    public geoLocS:GeolocationService,
    private _sanitizer: DomSanitizer,
    private auth:AuthService,
  ) {
    this.shopS.allShops().subscribe(async (allshops)=>{
      allshops.forEach(async (ashop)=>{
        let url:Observable<any>=await this.storageS.getURL(ashop.photo);
        ashop['photoURL']=url;
        ashop['distanceToM']= await this.geoLocS.distanceTo(ashop.location,'m')
        ashop['distanceTo']= await this.geoLocS.distanceTo(ashop.location)
      })
      // sort by distance
      setTimeout(() => {
        allshops.forEach(e=>console.log(e['distanceTo']))
      }, 1000);
      // remove Liked Shops
      // mydata=mydata.filter(e=>e.Likes.indexOf(this.auth.user.id)==-1)
      this.allShops=new MatTableDataSource(allshops);

      this.allShops.paginator=this.paginator;
    })
  }
  ngOnInit() {
  }
  get sortedShops(){

    return
  }
  getBackground(imgurl){
    return this._sanitizer.bypassSecurityTrustStyle('url('+imgurl+')');
  }
  like(element:Shop){
    if(element.Likes.indexOf(this.auth.user.id)==-1){
      if (element['distanceToM'])delete element['distanceToM'];
      if (element['distanceTo'])delete element['distanceTo'];
      if (element['photoURL'])delete element['photoURL'];
      let shop= Object.assign({},element)
      console.log(shop);
      element.Likes.push(this.auth.user.id);
      // this.shopS.saveShop(element)
    }
  }
}
