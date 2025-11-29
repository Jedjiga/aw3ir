
import { Component, OnInit } from '@angular/core';
import { MeteoItem } from '../meteoItem';

@Component({
  selector: 'app-meteo',
  standalone: false,
  templateUrl: './meteo.html',
  styleUrls: ['./meteo.css']
})
export class Meteo implements OnInit {
  city: MeteoItem = {
    name: '',
    id: 0,
    weather: null
  };

  cityList: MeteoItem[] = [];

  constructor() { }

  ngOnInit() {
    
    const storedList = localStorage.getItem('cityList');
    
    if (storedList !== undefined && storedList !== null) {
      this.cityList = JSON.parse(storedList);
      
    } else {
      this.cityList = [];
    }
  }

  onSubmit() {
    if (this.city.name !== undefined && this.isCityExist(this.city.name) === false) {
      let currentCity = new MeteoItem();
      currentCity.name = this.city.name;
      this.cityList.push(currentCity);
      
      this.saveCityList();
      

      
      // Réinitialiser le formulaire
      this.city.name = '';
    } 
  }

  remove(_city: MeteoItem) {
    // Filtre pour retourner une liste sans la ville supprimée
    this.cityList = this.cityList.filter((item: MeteoItem) => item.name != _city.name);
    this.saveCityList();
    
  }

  isCityExist(_cityName: string): boolean {
    // Vérifie si la ville existe déjà (insensible à la casse)
    if (this.cityList.filter((item: MeteoItem) => 
      item.name?.toUpperCase() == _cityName.toUpperCase()).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
    
  }
}