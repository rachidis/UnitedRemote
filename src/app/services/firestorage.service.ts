import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {
  constructor(
    private afStorage: AngularFireStorage,
  ) { }

  getURL(id){
    if(!id){
      return of(false);
    }
    return this.afStorage.ref(id).getDownloadURL()
  }
}
