import { Shop } from './../classes/shop';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(
    private firestore:AngularFirestore,
    private util:UtilService
  ) {
    // console.log("shopservice")
    // for (let i = 0; i < 30; i++) {
    //   // 34.024750, -6.786269 | 34.027000, -6.789391 | 34.022250, -6.833092 | 34.044450, -6.819653
    //   let shop = new Shop();
    //   shop.photo='photo'+i+'.jpg';
    //   shop.title='Shop N'+i;
    //   shop.description='Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium officiis, accusantium, eaque delectus aperiam labore fugit aut quaerat minus dignissimos sint. Eaque numquam a hic nostrum alias commodi, amet minus?';
    //   let lat=Math.random()*0.01+34.024750 as any;
    //   let lng=Math.random()*0.01+(-6.786269) as any;
    //   shop.location= new firebase.firestore.GeoPoint(+lat.toFixed(5),+lng.toFixed(5));
    //   this.saveShop(shop);
    //   console.log(shop)
    // }
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
    return this.firestore.collection('shops'
    // ,ref => ref.orderBy('annee', 'desc')
    ).valueChanges().pipe(map(e=>e as Shop[]));
  }
  saveShop(shop:Shop){
    this.util.showloading();
    shop = Object.assign({}, shop);
    this.firestore.collection('shops').add(shop).then(e=>{
      shop.id = e.id;
      if(!shop.id){
        e.set(shop);
      }
      this.util.hideloading();
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
