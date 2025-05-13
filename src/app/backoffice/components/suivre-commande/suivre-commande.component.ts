import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { CommandeService } from 'src/app/services/commande.service';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-suivre-commande',
  templateUrl: './suivre-commande.component.html',
  styleUrls: ['./suivre-commande.component.css']
})
export class SuivreCommandeComponent implements OnInit, OnDestroy {
  idcommande!: number;
  fournisseur: any;
  commandeStatus: string = '';
  map!: L.Map;
  progress = 0;
  remainingTime: string = '';
  routeTime!: number;
  fournisseurCoords!: [number, number];
  hospitalCoords!: [number, number];
  statusCheckInterval: any;
  deliveryInterval: any;
  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    
  ) {}

  ngOnInit(): void {
    this.idcommande = +this.route.snapshot.paramMap.get('idcommande')!;
    this.loadCommande();
    this.startStatusCheckLoop();
  }

  ngOnDestroy(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
    if (this.deliveryInterval) {
      clearInterval(this.deliveryInterval);
    }
  }

  startStatusCheckLoop(): void {
    this.statusCheckInterval = setInterval(() => {
      this.checkCommandeStatus();
    }, 3000);
  }

  checkCommandeStatus(): void {
    this.commandeService.getCommandeById(this.idcommande).subscribe((commande) => {
      const newStatus = commande.status;

      if (this.commandeStatus !== newStatus) {
        this.handleStatusChange(newStatus);
      }

      this.commandeStatus = newStatus;
    });
  }

  handleStatusChange(newStatus: string): void {
    switch(newStatus) {
      case 'Validée':
        this.startDeliverySimulation();
        break;
      case 'Livrée':
        this.handleDeliveryCompletion();
        break;
    }
  }

  startDeliverySimulation(): void {
    if (this.routeTime && this.fournisseurCoords && this.hospitalCoords) {
      this.playSound('depart');
      this.simulateDelivery(this.routeTime, this.fournisseurCoords, this.hospitalCoords);
    }
  }

  handleDeliveryCompletion(): void {
    clearInterval(this.statusCheckInterval);
    this.playSound('arrivee');
  }

  loadCommande(): void {
    this.commandeService.getCommandeById(this.idcommande).subscribe(
      (commande: any) => {
        this.fournisseur = commande.fournisseur;
        this.commandeStatus = commande.status;
        console.log("Commande status:", this.commandeStatus);  // Vérifiez ici aussi
        this.initMap(this.fournisseur.adresse);
      },
      error => {
        console.error("Error loading commande", error);
        alert('Error loading commande details');
      }
    );
  }
  

  playSound(type: 'depart' | 'enroute' | 'arrivee'): void {
    const audio = new Audio(`assets/sounds/${type}.m4a`);
    audio.play().catch(e => console.error("Audio playback failed:", e));
  }

  async initMap(adresse: string): Promise<void> {
    try {
      this.fournisseurCoords = await this.getCoordinatesFromAddress(adresse);
      this.initializeMap(this.fournisseurCoords);
    } catch (error) {
      console.error('Error initializing map:', error);
      alert('Error initializing map');
    }
  }

  initializeMap(fournisseurCoords: [number, number]): void {
    this.map = L.map('map').setView(fournisseurCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.addFournisseurMarker(fournisseurCoords);
    this.locateUserPosition(fournisseurCoords);

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  addFournisseurMarker(coords: [number, number]): void {
    const customIcon = this.createCustomIcon();
    L.marker(coords, { icon: customIcon })
      .addTo(this.map)
      .bindPopup('Fournisseur')
      .openPopup();
  }

  locateUserPosition(fournisseurCoords: [number, number]): void {
    this.map.locate({ setView: false, maxZoom: 16 });

    this.map.on('locationfound', (e: L.LocationEvent) => {
      this.handleLocationFound(e, fournisseurCoords);
    });

    this.map.on('locationerror', this.handleLocationError);
  }

  handleLocationFound(e: L.LocationEvent, fournisseurCoords: [number, number]): void {
    this.hospitalCoords = [e.latlng.lat, e.latlng.lng];
    const customIcon = this.createCustomIcon();

    L.marker(this.hospitalCoords, { icon: customIcon })
      .addTo(this.map)
      .bindPopup('HOSPITAL')
      .openPopup();

    this.calculateRoute(fournisseurCoords, this.hospitalCoords);
  }

  handleLocationError(e: L.ErrorEvent): void {
    console.error('Location error:', e);
    alert('Impossible de localiser votre position.');
  }

  calculateRoute(startCoords: [number, number], endCoords: [number, number]): void {
    const control = L.Routing.control({
      waypoints: [
        L.latLng(startCoords[0], startCoords[1]),
        L.latLng(endCoords[0], endCoords[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null
    } as any).addTo(this.map);

    control.on('routesfound', (e: any) => {
      const route = e.routes[0];
      this.routeTime = route.summary.totalTime;
      console.log(`Estimated travel time: ${this.routeTime} seconds`);
      
      if (this.commandeStatus === 'Validée') {
        this.startDeliverySimulation();
      }
    });
  }

  createCustomIcon(): L.Icon {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });
  }

  async getCoordinatesFromAddress(adresse: string): Promise<[number, number]> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`);
    const data = await response.json();
    if (data.length === 0) throw new Error('Address not found');
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }

  simulateDelivery(tempsEnSecondes: number, startCoords: [number, number], endCoords: [number, number]): void {
    if (this.deliveryInterval) {
      clearInterval(this.deliveryInterval);
    }

    const marker = this.createDeliveryMarker(startCoords);
    const steps = 50;
    const interval = (tempsEnSecondes * 1000) / steps;
    let step = 0;

    this.deliveryInterval = setInterval(() => {
      step++;
      this.updateDeliveryProgress(step, steps, marker, startCoords, endCoords);

      if (step === Math.floor(steps / 2)) {
        this.playSound('enroute');
      }

      if (step >= steps) {
        this.completeDelivery(marker);
      }
    }, interval);
  }

  createDeliveryMarker(coords: [number, number]): L.Marker {
    const icon = L.icon({
      iconUrl: 'assets/point.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  
    const marker = L.marker(coords, {
      icon: icon
    }).addTo(this.map).bindPopup('Livraison en cours...');
  
    // Add class to marker element after creation
    marker.getElement()?.classList.add('delivery-marker');
    return marker;
  }

  updateDeliveryProgress(step: number, steps: number, marker: L.Marker, 
    startCoords: [number, number], endCoords: [number, number]): void {
const progressRatio = step / steps;
const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progressRatio;
const lon = startCoords[1] + (endCoords[1] - startCoords[1]) * progressRatio;

marker.setLatLng([lat, lon]);
this.progress = progressRatio * 100;
this.updateRemainingTime(this.routeTime * (1 - progressRatio)); // Changed tempsEnSecondes to this.routeTime
}

  updateRemainingTime(seconds: number): void {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    this.remainingTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  completeDelivery(marker: L.Marker): void {
    clearInterval(this.deliveryInterval);
    marker.bindPopup('Commande livrée ✅').openPopup();
    this.playSound('arrivee');

    if (this.commandeStatus !== 'Livrée') {
      this.commandeService.updateStatusCommande(this.idcommande, 'Livrée').subscribe({
        next: () => console.log('✅ Commande mise à jour : Livrée'),
        error: (err) => console.error('Error updating status:', err)
      });
    }
  }
}