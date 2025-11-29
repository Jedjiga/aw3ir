
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Import des composants
import { App } from './app';
import { Meteo } from './meteo/meteo';
import { MeteoDetail } from './meteo-detail/meteo-detail';

// Configuration des routes
const appRoutes: Routes = [
  {
    path: '',                    // Page d'accueil
    component: Meteo
  },
  {
    path: 'meteo/:name',         // Page détail météo avec paramètre
    component: MeteoDetail
  },
  {
    path: '**',                  // Route par défaut (404)
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  // Déclaration de tous les composants
  declarations: [
    App,
    Meteo,
    MeteoDetail
  ],
  
  // Import des modules nécessaires
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }  // Active les logs du routeur (pour debug)
    )
  ],
  
  // Services et pipes
  providers: [DatePipe],
  
  // Composant de démarrage
  bootstrap: [App]
})
export class AppModule { }