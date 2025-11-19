var app;
window.onload = function () {
  app = new Vue({
    el: "#weatherApp",
    data: {
      loaded: false,
      formCityName: "",
      message: "",
      messageForm: "",
      
      cityList: [],
      cityWeather: null,
      cityWeatherLoading: false,
      
      apiKey: "b08f45d2c15b7fb5b4f4274fa71fd2b1"
    },

    mounted: function () {
      this.loaded = true;
      this.readData();
    },

    methods: {
      readData: function () {
        console.log("Initial cityList:", JSON.stringify(this.cityList));
      },

      // ajoute une ville à la liste
      addCity: function (event) {
        event.preventDefault();

        var name = this.formCityName.trim();
        if (!name) {
          this.messageForm = "Le nom de la ville est vide.";
          return;
        }

        if (this.isCityExist(name)) {
          this.messageForm = "existe déjà";
        
          return;
        }

        this.cityList.push({ name: name });
        this.messageForm = "";
        this.formCityName = "";
      },

      // teste si la ville existe déjà 
      isCityExist: function (_cityName) {
        return this.cityList.filter(item =>
          item.name.toUpperCase() === _cityName.toUpperCase()
        ).length > 0;
      },

      // supprime une ville
      remove: function (_city) {
        this.cityList = this.cityList.filter(item => item.name !== _city.name);
        
        if (this.cityWeather && this.cityWeather.name === _city.name) {
          this.cityWeather = null;
        }
      },

      // efface toute la liste 
      clearCities: function () {
        this.cityList = [];
        this.cityWeather = null;
      },

      // ferme la carte météo
      closeWeather: function () {
         this.cityWeather = null;
     },

      // récupère la météo pour une ville (via objet city {name: ...})
      meteo: function (_city) {
        if (!this.apiKey || this.apiKey === "") {
          this.message = "Erreur:Invalid API key ";
          return;
        }

        this.cityWeatherLoading = true;
        this.message = "";

        var url = 'https://api.openweathermap.org/data/2.5/weather?q=' +
          encodeURIComponent(_city.name) +
          '&units=metric&lang=fr&appid=' + encodeURIComponent(this.apiKey);

        fetch(url)
          .then(response => response.json())
          .then(json => {
            this.cityWeatherLoading = false;
            if (json.cod == 200) {
              this.cityWeather = json;
              this.message = "";
            } else {
              this.cityWeather = null;
              // json.message contient la raison renvoyée par OWM 
              this.message = 'Météo introuvable pour ' + _city.name + ' (' + json.message + ')';
            }
          })
          .catch(err => {
            this.cityWeatherLoading = false;
            this.cityWeather = null;
            this.message = "Erreur réseau ou API : " + err.message;
            console.error(err);
          });
      },

      //utiliser la géolocalisation pour obtenir la météo à la position actuelle
      useMyPosition: function () {
        var self = this;
        if (!navigator.geolocation) {
          this.message = "Géolocalisation non supportée par votre navigateur.";
          return;
        }

        this.cityWeatherLoading = true;
        this.message = "Récupération de votre position...";

        navigator.geolocation.getCurrentPosition(function (pos) {
          var lat = pos.coords.latitude;
          var lon = pos.coords.longitude;

          var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' +
            encodeURIComponent(lat) + '&lon=' + encodeURIComponent(lon) +
            '&units=metric&lang=fr&appid=' + encodeURIComponent(self.apiKey);

          fetch(url)
            .then(response => response.json())
            .then(json => {
              self.cityWeatherLoading = false;
              if (json.cod == 200) {
                self.cityWeather = json;
                //ajouter la ville dans la liste si pas déjà présente
                if (json.name && !self.isCityExist(json.name)) {
                  self.cityList.push({ name: json.name });
                }
                self.message = "";
              } else {
                self.cityWeather = null;
                self.message = 'Météo introuvable (' + json.message + ')';
              }
            })
            .catch(err => {
              self.cityWeatherLoading = false;
              self.cityWeather = null;
              self.message = "Erreur réseau ou API : " + err.message;
              console.error(err);
            });

        }, function (err) {
          self.cityWeatherLoading = false;
          self.message = "Impossible d'obtenir la position : " + err.message;
        }, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        });
      }
    },

    computed: {
      cityWheaterDate: function () {
        if (this.cityWeather !== null) {
          var date = new Date(this.cityWeather.dt * 1000);
          var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return date.getHours() + ":" + minutes;
        } else {
          return "";
        }
      },
      cityWheaterSunrise: function () {
        if (this.cityWeather !== null) {
          var date = new Date(this.cityWeather.sys.sunrise * 1000);
          var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return date.getHours() + ":" + minutes;
        } else {
          return "";
        }
      },
      cityWheaterSunset: function () {
        if (this.cityWeather !== null) {
          var date = new Date(this.cityWeather.sys.sunset * 1000);
          var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          return date.getHours() + ":" + minutes;
        } else {
          return "";
        }
      },
      // calcule bbox pour OpenStreetMap embed
      openStreetMapArea: function () {
        if (this.cityWeather !== null) {
          const zoom = 8;
          // delta adapté (petite valeur, évite afficher un bbox trop grand)
          const delta = 0.05 / Math.pow(2, zoom - 10);
          const bboxEdges = {
            south: this.cityWeather.coord.lat - delta,
            north: this.cityWeather.coord.lat + delta,
            west: this.cityWeather.coord.lon - delta,
            east: this.cityWeather.coord.lon + delta
          };
          // OSM bbox format: west,south,east,north ; URL-encoded comma is %2C
          return `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
        } else {
          return "";
        }
      }
    }
  });
};
