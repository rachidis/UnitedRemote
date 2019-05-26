import { UtilService } from './../services/util.service';
import { GeolocationService } from './../services/geolocation.service';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FirestorageService } from './../services/firestorage.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { MatTableDataSource, MatPaginator, MatSortable } from '@angular/material';
import { Shop } from '../classes/shop';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { take, first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns: string[] = ['shop'];
  public allShops:Shop[]=[];
  public dataSource:MatTableDataSource<Shop>=new MatTableDataSource();
  private sub:Subscription;
  constructor(
    public shopS:ShopService,
    public geoLocS:GeolocationService,
    private _sanitizer: DomSanitizer,
    private auth:AuthService,
    private util:UtilService,
    public storageS:FirestorageService,
    private router:Router
  ) {
    this.sub=this.auth.user$.pipe(take(1)).subscribe(user=>{
      this.shopS.allUnlikedShops().subscribe(allShops=>{
        this.allShops=allShops;
        this.allShops.forEach((ashop,index)=>{
          let url:Observable<any>=this.storageS.getURL(ashop.photo);
          ashop['photoURL']=url;
        })
        // getting Unorderedlist
        this.dataSource=new MatTableDataSource(allShops)
        this.dataSource.paginator=this.paginator;

        // Getting Oredering if user accepts GeoLocation
        this.geoLocS.shopDistanceByOrder(this.allShops,result=>{
          this.dataSource=new MatTableDataSource(result)
          this.dataSource.paginator=this.paginator;
        })
      })
    })
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  ngOnInit(){

  }
  getBackground(imgurl){
    return this._sanitizer.bypassSecurityTrustStyle('url('+imgurl+')');
  }
  like(element:Shop,index){
    if(!this.auth.user){
      this.util.openSnackBar('Please Login to Add '+element.title+' to your favorite list');
      this.router.navigate(['/login'])
      return
    }
    // just an other Check
    if(element.Likes.indexOf(this.auth.user.id)==-1){
      element.Likes.push(this.auth.user.id);
      this.shopS.saveShop(element).then(()=>{
        this.util.openSnackBar(element.title+' has been added to your favorite Shops list')
      })
    }
  }
  dislike(element:Shop,index){
    if(!this.auth.user){
      this.util.openSnackBar('Please Login to dislike '+element.title);
      this.router.navigate(['/login'])
      return
    }
    element.dislikes.push({
      id:this.auth.user.id,
      date:moment().utc().valueOf()
    });
    this.shopS.saveShop(element).then(()=>{
      this.util.openSnackBar(element.title+' wont be listed for the next two Hours')
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
