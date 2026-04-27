export type TrackingMapPoint = {
  latitude: number;
  longitude: number;
};

export type TrackingMapPayload = {
  activityType: 'run' | 'ride' | 'pet';
  route: TrackingMapPoint[];
  currentLocation: TrackingMapPoint | null;
};

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildTrackingMapHtml(payload: TrackingMapPayload) {
  const payloadJson = safeJson(payload);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  />
  <link
    href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
    rel="stylesheet"
  />
  <style>
    html,
    body,
    #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #e9e6df;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .gps-pill {
      position: absolute;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      z-index: 10;
      padding: 8px 14px;
      border-radius: 999px;
      color: rgba(255,255,255,0.92);
      background: rgba(0,0,0,0.68);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.28);
      pointer-events: none;
      white-space: nowrap;
    }

    .user-marker {
      width: 42px;
      height: 42px;
      position: relative;
      transform: rotate(-18deg);
    }

    .user-marker-pulse {
      position: absolute;
      inset: 7px;
      border-radius: 999px;
      background: rgba(255, 107, 82, 0.18);
      animation: pulse 1.7s ease-out infinite;
    }

    .user-marker-arrow {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0;
      height: 0;
      transform: translate(-50%, -50%);
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 28px solid #ff4f40;
      filter: drop-shadow(0 5px 7px rgba(0,0,0,0.35));
    }

    .user-marker-ride .user-marker-arrow {
      border-bottom-color: #ff9f0a;
    }

    .user-marker-pet .user-marker-arrow {
      border-bottom-color: #7ee787;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.72);
        opacity: 0.9;
      }

      100% {
        transform: scale(2.1);
        opacity: 0;
      }
    }

    .maplibregl-ctrl-bottom-right {
      opacity: 0.55;
      transform: scale(0.78);
      transform-origin: bottom right;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="gps-pill" class="gps-pill">Esperando GPS...</div>

  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <script>
    const INITIAL_PAYLOAD = ${payloadJson};
    const DEFAULT_CENTER = [-70.6693, -33.4489];

    let latestPayload = INITIAL_PAYLOAD;
    let mapLoaded = false;
    let userMarker = null;
    let hasCentered = false;
    let lastCenter = null;
    let lastCenterAt = 0;

    function isFiniteNumber(value) {
      return typeof value === 'number' && Number.isFinite(value);
    }

    function normalizePoint(point) {
      if (!point) {
        return null;
      }

      const latitude = Number(point.latitude);
      const longitude = Number(point.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return {
        latitude,
        longitude
      };
    }

    function getInitialCenter() {
      const currentLocation = normalizePoint(INITIAL_PAYLOAD.currentLocation);

      if (currentLocation) {
        return [currentLocation.longitude, currentLocation.latitude];
      }

      const route = Array.isArray(INITIAL_PAYLOAD.route)
        ? INITIAL_PAYLOAD.route
        : [];

      const lastRoutePoint = normalizePoint(route[route.length - 1]);

      if (lastRoutePoint) {
        return [lastRoutePoint.longitude, lastRoutePoint.latitude];
      }

      return DEFAULT_CENTER;
    }

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: getInitialCenter(),
      zoom: 16.2,
      pitch: 58,
      bearing: -18,
      attributionControl: false,
      interactive: false
    });

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true
      }),
      'bottom-right'
    );

    function buildEmptyRoute() {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        },
        properties: {}
      };
    }

    function buildRouteFeature(route) {
      const coordinates = Array.isArray(route)
        ? route
            .map(normalizePoint)
            .filter(Boolean)
            .map(point => [point.longitude, point.latitude])
        : [];

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates
        },
        properties: {}
      };
    }

    function createMarkerElement(activityType) {
      const element = document.createElement('div');
      element.className = 'user-marker user-marker-' + activityType;

      const pulse = document.createElement('div');
      pulse.className = 'user-marker-pulse';

      const arrow = document.createElement('div');
      arrow.className = 'user-marker-arrow';

      element.appendChild(pulse);
      element.appendChild(arrow);

      return element;
    }

    function distanceMeters(from, to) {
      if (!from || !to) {
        return Infinity;
      }

      const earthRadius = 6371000;
      const lat1 = from[1] * Math.PI / 180;
      const lat2 = to[1] * Math.PI / 180;
      const deltaLat = (to[1] - from[1]) * Math.PI / 180;
      const deltaLon = (to[0] - from[0]) * Math.PI / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return earthRadius * c;
    }

    function updateUserMarker(point, activityType) {
      if (!point) {
        return;
      }

      const lngLat = [point.longitude, point.latitude];

      if (!userMarker) {
        userMarker = new maplibregl.Marker({
          element: createMarkerElement(activityType),
          anchor: 'center',
          rotationAlignment: 'map',
          pitchAlignment: 'map'
        })
          .setLngLat(lngLat)
          .addTo(map);

        return;
      }

      userMarker.setLngLat(lngLat);
    }

    function updateMapCenter(point) {
      if (!point) {
        return;
      }

      const nextCenter = [point.longitude, point.latitude];

      if (!hasCentered) {
        map.jumpTo({
          center: nextCenter,
          zoom: 16.8,
          pitch: 58,
          bearing: -18
        });

        hasCentered = true;
        lastCenter = nextCenter;
        lastCenterAt = Date.now();
        return;
      }

      const now = Date.now();
      const movedMeters = distanceMeters(lastCenter, nextCenter);

      if (movedMeters < 18 || now - lastCenterAt < 900) {
        return;
      }

      map.easeTo({
        center: nextCenter,
        duration: 550,
        essential: true
      });

      lastCenter = nextCenter;
      lastCenterAt = now;
    }

    function updateGpsPill(hasLocation) {
      const pill = document.getElementById('gps-pill');

      if (!pill) {
        return;
      }

      pill.style.display = hasLocation ? 'none' : 'block';
    }

    function updateTracking(payload) {
      latestPayload = payload || latestPayload || INITIAL_PAYLOAD;

      if (!mapLoaded) {
        return;
      }

      const activityType = latestPayload.activityType || 'run';
      const currentLocation = normalizePoint(latestPayload.currentLocation);
      const routeFeature = buildRouteFeature(latestPayload.route);

      const routeSource = map.getSource('route');

      if (routeSource) {
        routeSource.setData(routeFeature);
      }

      updateUserMarker(currentLocation, activityType);
      updateMapCenter(currentLocation);
      updateGpsPill(Boolean(currentLocation));
    }

    map.on('load', function () {
      mapLoaded = true;

      map.addSource('route', {
        type: 'geojson',
        data: buildEmptyRoute()
      });

      map.addLayer({
        id: 'route-shadow',
        type: 'line',
        source: 'route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#000000',
          'line-opacity': 0.18,
          'line-width': 8,
          'line-blur': 4
        }
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#ff5a45',
          'line-opacity': 0.95,
          'line-width': 5
        }
      });

      updateTracking(latestPayload);
    });

    window.__updateTracking = function (payload) {
      updateTracking(payload);
    };
  </script>
</body>
</html>
`;
}