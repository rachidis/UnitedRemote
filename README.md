# Rachid
Hello Remoters,

- There is no cloud function in this project, all security rules have been set in the firestore rules;
- In order to sort the shops by the distance, the user will need accept the geolocation request;
- Unauthenticated user may still see the shops list but will be redirected to login page if he clicks like or dislike button;
- Adapted with Mobile devices
- App is RealTime.

#fireStore Rules
fireStore Rules:
```JS
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{idUser} {
      allow read: if isSignedIn() && isOwner(idUser)
      // backOffice User can only be created from the Back office 'it uses ADMIN SDK in Firebase Functions' 
      allow update: if isOwner(idUser)
      allow create: if isSignedIn()
    }
    match /shops/{idshops} {
      allow read;
      allow update: if isSignedIn()
    }
    function isSignedIn(){
      return request.auth != null
    }
    function isOwner(userID){
      return userID==request.auth.uid
    }
  }
}
```

#Demo
here is the demo; hope we get in touch soon;

[Demo Link](https://rachidur-7e19a.web.app/)

# UnitedR
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

