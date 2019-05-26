import { AuthService } from './auth.service';
import { Shop } from './../classes/shop';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as firebase from 'firebase/app'
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(
    private firestore:AngularFirestore,
    private util:UtilService,
    private auth:AuthService,
    ) {
    // I used this to Insert Data to firestore database;
    // this.allShops().pipe(take(1)).subscribe((shops:Shop[])=>{
    //   shops.forEach(shop=>{
    //     let lat=(Math.random()* 2 - 1) *0.05+33.995179 as any;
    //     let lng=(Math.random()* 2 - 1 )*0.06+(-6.851253) as any;
    //     shop.location= new firebase.firestore.GeoPoint(+lat.toFixed(5),+lng.toFixed(5));
    //     this.saveShop(shop);
    //   })
    // })
    // this.allShops().subscribe(e=>console.log(e))
  }

  get(shopid:string):Observable<Shop>{
    let b = this.firestore.collection('shops').doc(shopid).valueChanges().pipe(
      map( (e:any)=> {
        return e as Shop;
      } )
    );
    return b ;
  }
  allShops(){
    return this.firestore.collection('shops').valueChanges().pipe(map((e:Shop[])=>e));
  }
  allUnlikedShops(){
    return this.auth.user$.pipe(
      switchMap((user:firebase.User)=>{
        if(!user){
          return this.allShops();
        }
        return this.firestore.collection('shops').valueChanges().pipe(map((shops:Shop[])=>{
          return shops.filter(shop=>{
            let Disliked=shop.dislikes.find(dislike=>dislike.id==user.uid)
            if(Disliked){
              let dislikeTime=moment(Disliked.date);
              Disliked=dislikeTime.isSameOrAfter(moment().subtract(2, 'hours'))
            }
            return shop.Likes.indexOf(user.uid)==-1 && !Disliked
          })
        }));
      })
    )
  }
  allLikedShops(){
    return this.firestore.collection('shops'
    // ,ref => ref.orderBy('annee', 'desc')
    ).valueChanges().pipe(map((e:Shop[])=>{
      return e.filter(shop=>shop.Likes.indexOf(this.auth.user.id)!=-1)
    }));
  }
  saveShop(shop:Shop,merge=false){
    this.util.showloading();
    shop = Object.assign({}, shop);
    delete shop['distanceByM'];
    delete shop['distance']
    delete shop['photoURL'];
    return this.firestore.doc('shops/' + shop.id).set(Object.assign({}, shop), {merge: merge}).then(e=>{
      this.util.hideloading();
    }).catch(e=>{
      console.log('error')
    });
  }
  editShop(shop:Shop){
    return this.firestore.doc('shops/' + shop.id).set(Object.assign({}, shop), {merge: true}).catch(e=>{
      this.util.openSnackBar(e.message)
    })
  }
   deleteShop(id){
    return this.firestore.doc('shops/' + id).delete().catch(r=>{
      this.util.openSnackBar(r.message)
    })
  }

}
