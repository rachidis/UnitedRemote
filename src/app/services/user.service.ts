import { User } from './../classes/user';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private firestore:AngularFirestore
  ) { }
  saveUser(user:User){
    return this.firestore.doc('users/' + user.id).set(Object.assign({}, user), {merge: true})
  }

  get(userid:string):Observable<User>{
    let b = this.firestore.collection('users').doc(userid).valueChanges().pipe(
      map( (e:any)=> {
        return e as User;
      } )
    );
    return b ;
  }

}
