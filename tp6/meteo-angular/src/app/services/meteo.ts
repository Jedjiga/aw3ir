
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor() { }

  // Météo actuelle
  getMeteo(name: string): Promise<any> {

    return fetch('https://api.openweathermap.org/data/2.5/weather/?q=' + name + '&units=metric&lang=fr&appid=b08f45d2c15b7fb5b4f4274fa71fd2b1')
      .then(function(response) {
        
        return response.json();
      })
      .then(function(json) {
        
        if (json.cod == 200) {
          return Promise.resolve(json);
        } else {
          return Promise.reject('Météo introuvable pour ' + name + ' (' + json.message + ')');
        }
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  }

  // Prévisions sur 5 jours
  getForecast(name: string): Promise<any> {

    return fetch('https://api.openweathermap.org/data/2.5/forecast/?q=' + name + '&units=metric&lang=fr&appid=b08f45d2c15b7fb5b4f4274fa71fd2b1')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        
        if (json.cod == "200") {
          return Promise.resolve(json);
        } else {
          return Promise.reject('Prévisions introuvables pour ' + name);
        }
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  }
}