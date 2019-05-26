import { GeolocationService } from './../services/geolocation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from './../services/auth.service';
import { FirestorageService } from './../services/firestorage.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Shop } from './../classes/shop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-fav-list',
  templateUrl: './fav-list.component.html',
  styleUrls: ['./fav-list.component.css']
})
export class FavListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns: string[] = ['shop'];
  public allShops:Shop[]=[];
  public dataSource:MatTableDataSource<Shop>=new MatTableDataSource();
  constructor(
    public shopS:ShopService,
    public geoLocS:GeolocationService,
    private _sanitizer: DomSanitizer,
    private auth:AuthService,
    private util:UtilService,
    public storageS:FirestorageService,
  ) {
    this.shopS.allLikedShops().subscribe(allShops=>{
      this.allShops=allShops
      this.allShops.forEach((ashop,index)=>{
        let url:Observable<any>=this.storageS.getURL(ashop.photo);
        ashop['photoURL']=url;
      })
      // if didNot Accept geoLocation
      this.dataSource=new MatTableDataSource(allShops)
      this.dataSource.paginator=this.paginator;

      // if didnt accept GeoLocation
      this.geoLocS.shopDistanceByOrder(this.allShops,result=>{
        this.dataSource=new MatTableDataSource(result)
        this.dataSource.paginator=this.paginator;
      })
    })
  }
  ngOnInit(){

  }
  getBackground(imgurl){
    return this._sanitizer.bypassSecurityTrustStyle('url('+imgurl+')');
  }
  unlike(element:Shop){
    let index= element.Likes.indexOf(this.auth.user.id)
    // just an other quick Check
    if(index=>-1){
      element.Likes.splice(index,1)
      this.shopS.saveShop(element).then(()=>{
        this.util.openSnackBar(element.title+' has been removed from your favorite Shops list')
      })
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
