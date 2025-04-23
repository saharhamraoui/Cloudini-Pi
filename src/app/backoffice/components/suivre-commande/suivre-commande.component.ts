import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { CommandeService } from 'src/app/services/commande.service';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-suivre-commande',
  templateUrl: './suivre-commande.component.html',
  styleUrls: ['./suivre-commande.component.css']
})
export class SuivreCommandeComponent implements OnInit {
  idcommande!: number;
  fournisseur: any;
  commandeStatus: string = '';
  map!: L.Map;
  progress = 0;
  remainingTime: string = '';  // To hold the remaining time

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.idcommande = +this.route.snapshot.paramMap.get('idcommande')!;
    this.loadCommande();
    this.checkStatusLoop();
  }

  // Vérifie périodiquement l'état de la commande
  checkStatusLoop() {
    const interval = setInterval(() => {
      this.commandeService.getCommandeById(this.idcommande).subscribe((commande) => {
        this.commandeStatus = commande.status;
        if (commande.status === 'Livrée') {
          clearInterval(interval);
          this.playSound('arrivee');
        }
      });
    }, 3000); // Vérifie toutes les 3 secondes
  }

  // Charge les données de la commande et initialise la carte
  loadCommande() {
    this.commandeService.getCommandeById(this.idcommande).subscribe(
      (commande: any) => {
        this.fournisseur = commande.fournisseur;
        this.commandeStatus = commande.status;
        this.initMap(this.fournisseur.adresse);
      },
      error => {
        console.error("Erreur lors du chargement de la commande", error);
        alert('Erreur lors du chargement de la commande');
      }
    );
  }

  // Joue le son correspondant à l'état de la commande
  playSound(type: 'depart' | 'enroute' | 'arrivee') {
    const audio = new Audio(`assets/sounds/${type}.m4a`);
    audio.play();
  }

  // Initialise la carte Leaflet avec l'adresse du fournisseur
  async initMap(adresse: string) {
    try {
      const fournisseurCoords = await this.getCoordinatesFromAddress(adresse);

      // Initialisation de la carte
      this.map = L.map('map').setView(fournisseurCoords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      // Marqueur fournisseur
      L.marker(fournisseurCoords, { icon: customIcon }).addTo(this.map)
        .bindPopup('Fournisseur')
        .openPopup();

      // Localiser l'utilisateur
      this.map.locate({ setView: false, maxZoom: 16 });

      this.map.on('locationfound', (e: L.LocationEvent) => {
        const userCoords: [number, number] = [e.latlng.lat, e.latlng.lng];
      
        L.marker(userCoords, { icon: customIcon }).addTo(this.map)
          .bindPopup('Votre position')
          .openPopup();

        const control = L.Routing.control({
          waypoints: [
            L.latLng(userCoords[0], userCoords[1]),
            L.latLng(fournisseurCoords[0], fournisseurCoords[1])
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          show: false,
          createMarker: () => null
        } as any).addTo(this.map);

        control.on('routesfound', (e: any) => {
          const route = e.routes[0];
          const tempsEnSecondes = route.summary.totalTime;

          console.log(`⏱ Temps estimé du trajet : ${tempsEnSecondes} secondes`);
          this.playSound('depart');
          this.simulateDelivery(tempsEnSecondes, fournisseurCoords, userCoords);
        });
      });

      this.map.on('locationerror', () => {
        console.error('Impossible de localiser l’utilisateur');
        alert('Impossible de localiser votre position.');
      });

      // Fix pour taille carte après chargement
      setTimeout(() => {
        this.map.invalidateSize();
      }, 300);
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées:', error);
      alert('Erreur de localisation de l’adresse fournisseur.');
    }
  }

  // Récupère les coordonnées d'une adresse via OpenStreetMap
  async getCoordinatesFromAddress(adresse: string): Promise<[number, number]> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`);
    const data = await response.json();
    if (data.length === 0) throw new Error('Adresse non trouvée');
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }

  // Simule la livraison en déplaçant un marqueur sur la carte
  simulateDelivery(tempsEnSecondes: number, fournisseurCoords: [number, number], hospitalCoords: [number, number]) {
    const marker = L.marker(fournisseurCoords, {
      icon: L.icon({
        iconUrl: 'assets/point.png', // Custom marker icon
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })
    }).addTo(this.map).bindPopup('Livraison en cours...');

    const dureeMs = tempsEnSecondes * 1000;
    const steps = 50;
    const interval = dureeMs / steps;

    let step = 0;
    let remainingTime = tempsEnSecondes;
    this.progress = 0;

    // Fonction pour calculer et afficher le temps restant
    const updateRemainingTime = () => {
      remainingTime--;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      this.remainingTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Intervalle pour simuler la livraison
    const intervalId = setInterval(() => {
      step++;

      const lat = fournisseurCoords[0] + (hospitalCoords[0] - fournisseurCoords[0]) * (step / steps);
      const lon = fournisseurCoords[1] + (hospitalCoords[1] - fournisseurCoords[1]) * (step / steps);

      marker.setLatLng([lat, lon]);

      this.progress = (step / steps) * 100;
      updateRemainingTime(); // Met à jour le temps restant à chaque étape

      // Vérification si 50% de la progression est atteint
      if (this.progress == 50) {
        this.playSound('enroute');
      }

      if (step >= steps) {
        clearInterval(intervalId);
        marker.bindPopup('Commande livrée ✅').openPopup();
        this.playSound('arrivee');

        this.commandeService.updateStatusCommande(this.idcommande, 'Livrée').subscribe(() => {
          console.log('✅ Commande mise à jour : Livrée');
        });
      }
    }, interval);
  }
}
