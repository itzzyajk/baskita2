'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useBusStore } from '@/store/busState';
import { BusStop, School } from '@/types';
import { OrigamiBusIcon, OrigamiSchoolIcon } from '@/components/common/OrigamiIcons';
import { Compass, ZoomIn, ZoomOut, Layers, Eye, Navigation } from 'lucide-react';

interface OrigamiMapProps {
  onSelectStop?: (stop: BusStop) => void;
  onSelectSchool?: (school: School) => void;
  interactivePicker?: boolean;
  onPinLocation?: (coords: { lat: number; lng: number; address: string }) => void;
  pickedCoords?: { lat: number; lng: number } | null;
  mode?: 'parent' | 'driver' | 'admin';
}

export const OrigamiMap: React.FC<OrigamiMapProps> = ({
  onSelectStop,
  onSelectSchool,
  interactivePicker = false,
  onPinLocation,
  pickedCoords = null,
  mode = 'parent',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const busMarkerRef = useRef<maplibregl.Marker | null>(null);
  const pickerMarkerRef = useRef<maplibregl.Marker | null>(null);
  const stopMarkersRef = useRef<maplibregl.Marker[]>([]);
  const schoolMarkersRef = useRef<maplibregl.Marker[]>([]);

  const {
    buses,
    routes,
    schools,
    role,
    activeBusId,
  } = useBusStore();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [followBus, setFollowBus] = useState(true);
  const [viewMode, setViewMode] = useState<'route' | 'fleet'>('route');

  const activeBus = buses.find((b) => b.id === activeBusId) || buses[0];
  const activeRoute = routes.find((r) => r.id === 'route-tj-01') || routes[0];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Origami Vector Style with Warm Craft Paper background & OpenStreetMap vector/raster styling
    const origamiStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'paper-background',
          type: 'background',
          paint: {
            'background-color': '#FAF8F5',
          },
        },
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          paint: {
            'raster-opacity': 0.72,
            'raster-saturation': -0.7,
            'raster-contrast': 0.25,
          },
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: origamiStyle,
      center: [101.5583, 3.0945], // TTDI Jaya
      zoom: mode === 'admin' ? 12 : 13.8,
      pitch: 0, // Flat 2D origami projection
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);

      // Add 20km Operational Radius Circle (around TTDI Jaya)
      const points = 64;
      const radiusKm = 20;
      const centerLng = 101.5583;
      const centerLat = 3.0945;
      const circleCoords: [number, number][] = [];
      const kmToDegLat = radiusKm / 110.574;
      const kmToDegLng = radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));

      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        circleCoords.push([
          centerLng + kmToDegLng * Math.cos(theta),
          centerLat + kmToDegLat * Math.sin(theta),
        ]);
      }

      map.addSource('radius-20km', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [circleCoords],
          },
          properties: {},
        },
      });

      map.addLayer({
        id: 'radius-fill',
        type: 'fill',
        source: 'radius-20km',
        paint: {
          'fill-color': '#2A9D8F',
          'fill-opacity': 0.04,
        },
      });

      map.addLayer({
        id: 'radius-stroke',
        type: 'line',
        source: 'radius-20km',
        paint: {
          'line-color': '#2A9D8F',
          'line-width': 1.5,
          'line-dasharray': [4, 4],
          'line-opacity': 0.6,
        },
      });

      // Add Active GeoJSON Route Lines
      map.addSource('active-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: activeRoute.waypoints,
          },
          properties: {},
        },
      });

      // Outer fold crease border
      map.addLayer({
        id: 'route-shadow',
        type: 'line',
        source: 'active-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#264653',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-offset': 1,
        },
      });

      // Terracotta Origami Crease Line
      map.addLayer({
        id: 'route-crease',
        type: 'line',
        source: 'active-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#E76F51',
          'line-width': 5,
        },
      });

      // Inner Canary Crease Stitch
      map.addLayer({
        id: 'route-stitch',
        type: 'line',
        source: 'active-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#F4D06F',
          'line-width': 2,
          'line-dasharray': [3, 2],
        },
      });
    });

    // Map Click Handler for Interactive Pin Selector in Step 3
    map.on('click', (e) => {
      if (interactivePicker && onPinLocation) {
        const { lng, lat } = e.lngLat;
        // Check if inside TTDI Jaya / Shah Alam radius
        const dist = Math.sqrt(Math.pow(lng - 101.5583, 2) + Math.pow(lat - 3.0945, 2)) * 111;
        let addr = `Koordinat [${lat.toFixed(4)}, ${lng.toFixed(4)}], TTDI Jaya`;
        if (dist > 25) {
          addr = `Di luar zon TTDI Jaya (${dist.toFixed(1)}km)`;
        } else if (lat > 3.10) {
          addr = `Kawasan Bukit Jelutong / Shah Alam Utara`;
        } else if (lat < 3.09) {
          addr = `Kawasan Seksyen 13 / Glenmarie Industrial`;
        }
        onPinLocation({ lat, lng, address: addr });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [interactivePicker, onPinLocation, mode, activeRoute.waypoints]);

  // Update Route Source if activeRoute changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const source = mapRef.current.getSource('active-route') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: activeRoute.waypoints,
        },
        properties: {},
      });
    }
  }, [activeRoute, mapLoaded]);

  // Render / Update Origami Bus Marker
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !activeBus) return;

    if (!busMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'origami-bus-marker-wrapper cursor-pointer';
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="origami-bus-badge bg-origami-slate text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-paper uppercase tracking-wider mb-1 flex items-center gap-1 border border-paper-creaseDark">
            <span class="w-1.5 h-1.5 rounded-full bg-origami-yellow animate-ping"></span>
            ${activeBus.name.split(' ')[0]} ${activeBus.name.split(' ')[1]}
          </div>
          <div class="bus-svg-container transform transition-transform duration-300">
            <!-- SVG will be rendered here -->
          </div>
          <div class="w-2.5 h-1 bg-origami-slate opacity-30 rounded-full mt-0.5 filter blur-[0.5px]"></div>
        </div>
      `;

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([activeBus.currentLng, activeBus.currentLat])
        .addTo(mapRef.current);

      busMarkerRef.current = marker;
    } else {
      busMarkerRef.current.setLngLat([activeBus.currentLng, activeBus.currentLat]);
    }

    // Update rotation and HTML contents
    const el = busMarkerRef.current.getElement();
    const svgContainer = el.querySelector('.bus-svg-container');
    if (svgContainer) {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 64 64" width="46" height="46" style="transform: rotate(${activeBus.heading}deg);">
          <polygon points="18,10 46,10 42,18 22,18" fill="#FFF275" stroke="#264653" stroke-width="1.5" stroke-linejoin="round" />
          <polygon points="22,18 42,18 46,28 18,28" fill="#A8DADC" stroke="#264653" stroke-width="1.5" stroke-linejoin="round" />
          <line x1="32" y1="18" x2="32" y2="28" stroke="#264653" stroke-width="1.5" />
          <polygon points="12,28 32,28 32,46 14,46" fill="#F4D06F" stroke="#264653" stroke-width="1.5" stroke-linejoin="round" />
          <polygon points="32,28 52,28 50,46 32,46" fill="#E5B942" stroke="#264653" stroke-width="1.5" stroke-linejoin="round" />
          <polygon points="14,30 20,30 19,37 13,37" fill="#E2F3F5" stroke="#264653" stroke-width="1" />
          <polygon points="23,30 29,30 29,37 23,37" fill="#E2F3F5" stroke="#264653" stroke-width="1" />
          <polygon points="35,30 41,30 41,37 35,37" fill="#C5E3E6" stroke="#264653" stroke-width="1" />
          <polygon points="44,30 50,30 49,37 43,37" fill="#C5E3E6" stroke="#264653" stroke-width="1" />
          <polygon points="14,46 50,46 48,52 16,52" fill="#264653" stroke="#264653" stroke-width="1" />
          <polygon points="18,48 46,48 45,50 19,50" fill="#E76F51" />
          <polygon points="15,44 19,44 18,48 14,48" fill="#FFF" stroke="#264653" stroke-width="0.8" />
          <polygon points="45,44 49,44 50,48 46,48" fill="#FFF" stroke="#264653" stroke-width="0.8" />
        </svg>
      `;
    }

    if (followBus && mapRef.current) {
      mapRef.current.easeTo({
        center: [activeBus.currentLng, activeBus.currentLat],
        duration: 300,
      });
    }
  }, [activeBus, mapLoaded, followBus]);

  // Render School Milestones
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear previous
    schoolMarkersRef.current.forEach((m) => m.remove());
    schoolMarkersRef.current = [];

    schools.forEach((school) => {
      const el = document.createElement('div');
      el.className = 'school-marker cursor-pointer group';
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="bg-white border-2 border-origami-terracotta text-origami-slate font-bold text-[10px] px-2 py-0.5 rounded shadow-paper mb-1 whitespace-nowrap group-hover:scale-105 transition-transform flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-origami-terracotta"></span>
            ${school.name}
          </div>
          <div class="bg-white p-1 rounded-full border-2 border-origami-slate shadow-paper">
            <svg viewBox="0 0 64 64" width="26" height="26">
              <polygon points="32,6 26,16 38,16" fill="#E76F51" stroke="#264653" stroke-width="1.5" />
              <polygon points="8,28 32,18 56,28 52,32 12,32" fill="#E76F51" stroke="#264653" stroke-width="1.5" />
              <polygon points="12,32 52,32 52,56 12,56" fill="#FAF8F5" stroke="#264653" stroke-width="1.5" />
              <polygon points="28,42 36,42 36,56 28,56" fill="#2A9D8F" />
            </svg>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        if (onSelectSchool) onSelectSchool(school);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([school.lng, school.lat])
        .addTo(mapRef.current!);

      schoolMarkersRef.current.push(marker);
    });
  }, [schools, mapLoaded, onSelectSchool]);

  // Render Stop Markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear previous
    stopMarkersRef.current.forEach((m) => m.remove());
    stopMarkersRef.current = [];

    activeRoute.stops.forEach((stop) => {
      const isCompleted = stop.isCompleted;
      const el = document.createElement('div');
      el.className = 'stop-marker cursor-pointer group';
      
      const pinColor = isCompleted ? '#2A9D8F' : '#E76F51';
      const bgColor = isCompleted ? '#EDF7F6' : '#FDEDEA';

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-origami-slate text-white text-[11px] px-2 py-0.5 rounded shadow-paper whitespace-nowrap z-30 pointer-events-none">
            #${stop.sequence} ${stop.name} (${stop.scheduledTime})
          </div>
          <div class="w-6 h-6 rounded-full border-2 border-origami-slate flex items-center justify-center font-bold text-[10px] shadow-paper transition-transform group-hover:scale-125" style="background-color: ${bgColor}; color: ${pinColor}">
            ${isCompleted ? '✓' : stop.sequence}
          </div>
          <div class="w-1.5 h-1.5 bg-origami-slate rounded-full mt-0.5"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        if (onSelectStop) onSelectStop(stop);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([stop.lng, stop.lat])
        .addTo(mapRef.current!);

      stopMarkersRef.current.push(marker);
    });
  }, [activeRoute.stops, mapLoaded, onSelectStop]);

  // Interactive Pin Marker (Step 3 Registration)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (pickedCoords) {
      if (!pickerMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'picker-pin animate-bounce';
        el.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="bg-origami-terracotta text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-paper border border-white whitespace-nowrap mb-1">
              📍 Lokasi Dipilih
            </div>
            <div class="w-7 h-7 bg-origami-yellow border-2 border-origami-slate rounded-full flex items-center justify-center shadow-paper">
              <span class="w-3 h-3 bg-origami-terracotta rounded-full"></span>
            </div>
          </div>
        `;

        pickerMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([pickedCoords.lng, pickedCoords.lat])
          .addTo(mapRef.current);
      } else {
        pickerMarkerRef.current.setLngLat([pickedCoords.lng, pickedCoords.lat]);
      }
    } else if (pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
      pickerMarkerRef.current = null;
    }
  }, [pickedCoords, mapLoaded]);

  // Map Controls Helpers
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();

  const toggleViewMode = () => {
    if (!mapRef.current) return;
    if (viewMode === 'route') {
      setViewMode('fleet');
      setFollowBus(false);
      mapRef.current.flyTo({
        center: [101.5583, 3.0945],
        zoom: 11.5,
        duration: 800,
      });
    } else {
      setViewMode('route');
      setFollowBus(true);
      mapRef.current.flyTo({
        center: [activeBus.currentLng, activeBus.currentLat],
        zoom: 13.8,
        duration: 800,
      });
    }
  };

  const centerOnBus = () => {
    setFollowBus(true);
    mapRef.current?.flyTo({
      center: [activeBus.currentLng, activeBus.currentLat],
      zoom: 14.2,
      duration: 600,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-paper-bg overflow-hidden select-none border-b-2 border-paper-creaseDark">
      {/* MapLibre DOM Target */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Origami Paper Fold Corner Overlay */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-10">
        <div className="w-full h-full bg-gradient-to-bl from-paper-creaseDark to-transparent opacity-40"></div>
      </div>

      {/* Floating Tactical Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={centerOnBus}
          title="Ikut Bas (Follow Bus)"
          className={`origami-btn p-2 rounded-md bg-white border border-origami-slate text-origami-slate shadow-paper flex items-center justify-center transition-all ${
            followBus ? 'bg-origami-yellow ring-2 ring-origami-slate ring-offset-1' : ''
          }`}
        >
          <Navigation className={`w-4 h-4 ${followBus ? 'text-origami-slate' : 'text-gray-600'}`} />
        </button>

        <button
          onClick={toggleViewMode}
          title={viewMode === 'route' ? 'Gambaran 20km Fleet (Overview)' : 'Fokus Laluan Aktif (Route Focus)'}
          className="origami-btn p-2 rounded-md bg-white border border-origami-slate text-origami-slate shadow-paper flex items-center justify-center"
        >
          <Layers className="w-4 h-4 text-gray-700" />
        </button>

        <div className="bg-white border border-origami-slate rounded-md shadow-paper flex flex-col overflow-hidden">
          <button
            onClick={zoomIn}
            className="p-2 text-gray-700 hover:bg-paper-sheet transition-colors border-b border-paper-crease"
            title="Zoom Masuk"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 text-gray-700 hover:bg-paper-sheet transition-colors"
            title="Zoom Keluar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Radius & Geofence Indicator Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-paper-creaseDark shadow-paper flex items-center gap-1.5 text-xs font-medium text-origami-slate">
          <span className="w-2 h-2 rounded-full bg-origami-teal"></span>
          <span>Zon TTDI Jaya (Radius 20 km)</span>
        </div>

        {viewMode === 'fleet' && (
          <div className="bg-origami-yellow text-origami-slate px-2 py-0.5 rounded-sm border border-origami-slate font-bold text-[10px] shadow-paper uppercase">
            3 Bas Aktif
          </div>
        )}
      </div>

      {/* Speed & Heading Telematics Badge (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded border border-paper-creaseDark shadow-paper flex items-center gap-3 text-xs text-origami-slate">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-[10px] uppercase font-bold">Laju:</span>
            <span className="font-mono font-bold text-origami-terracotta">{activeBus.speedKmH} km/j</span>
          </div>
          <div className="w-px h-3 bg-paper-creaseDark"></div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-[10px] uppercase font-bold">Arah:</span>
            <span className="font-mono font-bold text-origami-slate">{Math.round(activeBus.heading)}°</span>
          </div>
          <div className="w-px h-3 bg-paper-creaseDark"></div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-[10px] uppercase font-bold">Status:</span>
            <span className="font-bold text-origami-teal capitalize">{activeBus.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
