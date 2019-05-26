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
    public geoLocS:GeolocationService,
    private _sanitizer: DomSanitizer,
    private auth:AuthService,
  ) {
    this.shopS.allShops().subscribe(async(allshops)=>{
      // sort by distance
      let mydata=await allshops
      mydata.sort((a,b)=>a['distanceToM']-b['distanceToM']);
      // remove Liked Shops
      // mydata=mydata.filter(e=>e.Likes.indexOf(this.auth.user.id)==-1)
      this.allShops=new MatTableDataSource(mydata);
      this.allShops.paginator=this.paginator;
    })
  }
  ngOnInit(){

  }
  getBackground(imgurl){
    return this._sanitizer.bypassSecurityTrustStyle('url('+imgurl+')');
  }
  like(element:Shop){
    if(element.Likes.indexOf(this.auth.user.id)==-1){
      element.Likes.push(this.auth.user.id);
      this.shopS.saveShop(element)
    }
  }
}
