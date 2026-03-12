import {
  Component,
  AfterViewInit,
  OnDestroy,
  input,
  output,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Spot } from '../../models';

// Centro de Gran Canaria
const GRAN_CANARIA_CENTER: L.LatLngExpression = [27.95, -15.55];
const DEFAULT_ZOOM = 10;

@Component({
  selector: 'app-map-spots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-spots.component.html',
  styleUrls: ['./map-spots.component.scss'],
})
export class MapSpotsComponent implements AfterViewInit, OnDestroy {
  // Input: los spots a mostrar en el mapa
  spots = input.required<Spot[]>();

  // Output: cuando el usuario pulsa un marker
  spotClick = output<string>();

  mapContainer = viewChild.required<ElementRef>('mapContainer');

  private map!: L.Map;
  private userMarker?: L.Marker;
  private spotMarkers: L.Marker[] = [];
  private mapReady = false;

  constructor() {
    effect(() => {
      const spots = this.spots();
      if (this.mapReady) {
        this.refreshMarkers(spots);
      }
    });
  }

  // Icono personalizado de pez (emoji)
  private fishIcon = L.divIcon({
    html: '<div class="fish-marker">🐟</div>',
    className: 'custom-fish-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });

  // Icono para la ubicación del usuario
  private userIcon = L.divIcon({
    html: '<div class="user-marker">📍</div>',
    className: 'custom-user-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.mapReady = true;
    this.refreshMarkers(this.spots());
    this.locateUser();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer().nativeElement, {
      center: GRAN_CANARIA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    // Tiles de OpenStreetMap (gratis)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);
  }

  private refreshMarkers(spots: Spot[]): void {
    // Remove existing spot markers
    for (const marker of this.spotMarkers) {
      marker.remove();
    }
    this.spotMarkers = [];

    for (const spot of spots) {
      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        icon: this.fishIcon,
      }).addTo(this.map);

      // Popup con info del spot
      marker.bindPopup(`
        <div class="spot-popup">
          <strong>${spot.name}</strong>
          <br/>
          <span>${spot.location}</span>
          <br/>
          <span>⭐ ${spot.rating} · ${spot.difficulty}</span>
        </div>
      `);

      marker.on('click', () => {
        this.spotClick.emit(spot.id);
      });

      this.spotMarkers.push(marker);
    }
  }

  private locateUser(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocalización no disponible');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.userMarker = L.marker([latitude, longitude], {
          icon: this.userIcon,
        })
          .addTo(this.map)
          .bindPopup('Tu ubicación')
          .openPopup();
      },
      (error) => {
        console.warn('Error obteniendo ubicación:', error.message);
      }
    );
  }
}