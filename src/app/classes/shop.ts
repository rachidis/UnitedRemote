
export class Shop {
  id:string;
  title:string;
  description:string;
  location:firebase.firestore.GeoPoint;
  photo:string;
  Likes=[];
  dislikes=[];
  distance:any;
}
