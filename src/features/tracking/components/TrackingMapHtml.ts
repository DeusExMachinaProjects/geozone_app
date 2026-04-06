type SerializablePoint = {
  latitude: number;
  longitude: number;
};

export type TrackingMapPayload = {
  route: SerializablePoint[];
  currentLocation: SerializablePoint | null;
};

const DEFAULT_CENTER = {
  latitude: -33.45694,
  longitude: -70.64827,
  zoom: 13,
};

function serializeForHtml(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function buildTrackingMapHtml(initialPayload: TrackingMapPayload) {
  const payloadJson = serializeForHtml(initialPayload);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <title>GeoZone Tracking Map</title>

    <!-- Leaflet -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

    <!-- MapLibre GL JS -->
    <link
      href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>

    <!-- MapLibre GL Leaflet -->
    <script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js"></script>

    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #050505;
        overflow: hidden;
      }

      #map {
        width: 100%;
        height: 100%;
        background: #050505;
      }

      .leaflet-control-attribution {
        font-size: 10px;
        background: rgba(0, 0, 0, 0.5);
        color: #ddd;
      }

      .leaflet-control-attribution a {
        color: #fff;
      }

      #status {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 9999;
        display: none;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.72);
        color: #fff;
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 16px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="status"></div>

    <script>
      const OPENFREEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
      const INITIAL_PAYLOAD = ${payloadJson};

      let map;
      let routeLayer;
      let markerLayer;

      function showStatus(message) {
        const status = document.getElementById('status');
        if (!status) return;
        status.style.display = 'block';
        status.textContent = message;
      }

      function hideStatus() {
        const status = document.getElementById('status');
        if (!status) return;
        status.style.display = 'none';
        status.textContent = '';
      }

      function getInitialView(payload) {
        if (payload && payload.currentLocation) {
          return [
            payload.currentLocation.latitude,
            payload.currentLocation.longitude,
            16,
          ];
        }

        if (payload && payload.route && payload.route.length > 0) {
          const last = payload.route[payload.route.length - 1];
          return [last.latitude, last.longitude, 15];
        }

        return [
          ${DEFAULT_CENTER.latitude},
          ${DEFAULT_CENTER.longitude},
          ${DEFAULT_CENTER.zoom},
        ];
      }

      function clearLayers() {
        if (routeLayer) {
          routeLayer.clearLayers();
        }
        if (markerLayer) {
          markerLayer.clearLayers();
        }
      }

      function renderTracking(payload) {
        if (!map) {
          return;
        }

        clearLayers();

        const route = Array.isArray(payload?.route) ? payload.route : [];
        const currentLocation = payload?.currentLocation ?? null;

        if (route.length > 1) {
          const latlngs = route.map(point => [point.latitude, point.longitude]);

          const polyline = L.polyline(latlngs, {
            color: '#FF6B52',
            weight: 5,
            opacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round',
          });

          polyline.addTo(routeLayer);

          const bounds = polyline.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: [24, 24],
              maxZoom: 17,
            });
          }
        }

        if (currentLocation) {
          const marker = L.circleMarker(
            [currentLocation.latitude, currentLocation.longitude],
            {
              radius: 8,
              color: '#FFFFFF',
              weight: 2,
              fillColor: '#FF6B52',
              fillOpacity: 1,
            }
          );

          marker.addTo(markerLayer);

          if (route.length <= 1) {
            map.setView(
              [currentLocation.latitude, currentLocation.longitude],
              16,
              {animate: true}
            );
          }

          hideStatus();
        } else {
          showStatus('Esperando GPS...');
        }
      }

      function initMap() {
        const [lat, lng, zoom] = getInitialView(INITIAL_PAYLOAD);

        map = L.map('map', {
          zoomControl: false,
          attributionControl: true,
        }).setView([lat, lng], zoom);

        routeLayer = L.layerGroup().addTo(map);
        markerLayer = L.layerGroup().addTo(map);

        if (typeof L.maplibreGL !== 'function') {
          showStatus('No se pudo cargar la capa base de OpenFreeMap.');
          return;
        }

        L.maplibreGL({
          style: OPENFREEMAP_STYLE_URL,
        }).addTo(map);

        renderTracking(INITIAL_PAYLOAD);
      }

      window.__updateTracking = function updateTracking(payload) {
        try {
          renderTracking(payload || {});
        } catch (error) {
          showStatus('Error actualizando el mapa.');
          console.error(error);
        }
      };

      window.addEventListener('load', initMap);
    </script>
  </body>
</html>`;
}