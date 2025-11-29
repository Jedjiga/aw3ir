
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MeteoService } from "../services/meteo";

@Component({
  selector: "app-meteo-detail",
  standalone: false,
  templateUrl: "./meteo-detail.html",
  styleUrls: ["./meteo-detail.css"],
})
export class MeteoDetail implements OnInit {
  meteo: any;
  forecast: any;
  dailyForecast: any[] = [];
  latlon: string = "";

  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getMeteo();
    this.getForecast();
  }

  getMeteo(): void {
    const name = this.route.snapshot.paramMap.get("name");

    
    if (name) {
      this.meteoService
        .getMeteo(name)
        .then((response) => {
          this.meteo = response;
          this.latlon = `${this.meteo.coord.lat},${this.meteo.coord.lon}`;
          this.cdr.detectChanges();
        })
        .catch((fail) => {
          this.meteo = fail;
          this.cdr.detectChanges();
        });
    }
  }

  getForecast(): void {
    const name = this.route.snapshot.paramMap.get("name");

    
    if (name) {
      this.meteoService
        .getForecast(name)
        .then((response) => {
          this.forecast = response;
          
          
          // Traiter les prévisions pour obtenir 1 prévision par jour
          this.processForecast();
          
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error("❌ Erreur forecast:", error);
        });
    }
  }

  processForecast(): void {
    if (!this.forecast || !this.forecast.list) {
      return;
    }

    // Grouper les prévisions par jour
    const dailyData: { [key: string]: any[] } = {};

    this.forecast.list.forEach((item: any) => {
      // Extraire la date (format: YYYY-MM-DD)
      const date = item.dt_txt.split(' ')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Prendre la prévision de midi (12:00) pour chaque jour
    // ou la première disponible si 12:00 n'existe pas
    this.dailyForecast = Object.keys(dailyData).slice(0, 5).map(date => {
      const dayData = dailyData[date];
      
      // Chercher la prévision de 12:00 ou prendre la première
      const noonForecast = dayData.find(item => item.dt_txt.includes('12:00:00'));
      const selectedForecast = noonForecast || dayData[0];
      
      // Calculer les min/max de température pour la journée
      const temps = dayData.map(item => item.main.temp);
      const tempMin = Math.min(...temps);
      const tempMax = Math.max(...temps);
      
      return {
        date: selectedForecast.dt,
        temp: selectedForecast.main.temp,
        tempMin: tempMin,
        tempMax: tempMax,
        description: selectedForecast.weather[0].description,
        weatherId: selectedForecast.weather[0].id,
        icon: this.getWeatherIconForId(selectedForecast.weather[0].id)
      };
    });

  }
  
  getWeatherIcon(): string {
    if (!this.meteo?.weather?.[0]) return '🌤️';
    return this.getWeatherIconForId(this.meteo.weather[0].id);
  }

  getWeatherIconForId(weatherId: number): string {
    // Orage
    if (weatherId >= 200 && weatherId < 300) return '⛈️';
    // Bruine
    if (weatherId >= 300 && weatherId < 400) return '🌧️';
    // Pluie
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    // Neige
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    // Atmosphère (brouillard, brume, etc.)
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    // Ciel dégagé
    if (weatherId === 800) return '☀️';
    // Nuages
    if (weatherId > 800) return '☁️';
    
    return '🌤️';
  }
  
  onImageError(event: any) {
    
    event.target.style.display = 'none';
    
    const parent = event.target.parentElement;
    if (parent) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-warning text-center m-2';
      errorDiv.innerHTML = '🗺️ Carte non disponible - Cliquez pour ouvrir Google Maps';
      parent.appendChild(errorDiv);
    }
  }
}