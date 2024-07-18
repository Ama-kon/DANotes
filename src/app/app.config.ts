import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-143fb","appId":"1:706769602846:web:0c3e6a4e2a8413dfe5a10f","storageBucket":"danotes-143fb.appspot.com","apiKey":"AIzaSyA3ObShDZMYsGpOqTQzAPf8xeXEHddIxWQ","authDomain":"danotes-143fb.firebaseapp.com","messagingSenderId":"706769602846"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
