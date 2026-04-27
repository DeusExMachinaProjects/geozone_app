export type TrackingMapPoint = {
  latitude: number;
  longitude: number;
  timestamp?: number | null;
  heading?: number | null;
  speed?: number | null;
};

export type TrackingMapPayload = {
  activityType: 'run' | 'ride' | 'pet';
  route: TrackingMapPoint[];
  currentLocation: TrackingMapPoint | null;
};

const DEFAULT_LOCATION: TrackingMapPoint = {
  latitude: -33.4489,
  longitude: -70.6693,
};

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidPoint(value: unknown): value is TrackingMapPoint {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const point = value as TrackingMapPoint;

  return (
    isValidNumber(point.latitude) &&
    isValidNumber(point.longitude) &&
    point.latitude >= -90 &&
    point.latitude <= 90 &&
    point.longitude >= -180 &&
    point.longitude <= 180
  );
}

function normalizePoint(point: TrackingMapPoint): TrackingMapPoint {
  return {
    latitude: point.latitude,
    longitude: point.longitude,
    timestamp: isValidNumber(point.timestamp) ? point.timestamp : null,
    heading: isValidNumber(point.heading) ? point.heading : null,
    speed: isValidNumber(point.speed) ? point.speed : null,
  };
}

function normalizePayload(payload: TrackingMapPayload): TrackingMapPayload {
  const activityType =
    payload.activityType === 'ride' || payload.activityType === 'pet'
      ? payload.activityType
      : 'run';

  const route = Array.isArray(payload.route)
    ? payload.route.filter(isValidPoint).map(normalizePoint)
    : [];

  const currentLocation = isValidPoint(payload.currentLocation)
    ? normalizePoint(payload.currentLocation)
    : route.length > 0
      ? route[route.length - 1]
      : null;

  return {
    activityType,
    route,
    currentLocation,
  };
}

function serializePayload(payload: TrackingMapPayload): string {
  return JSON.stringify(normalizePayload(payload))
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function buildTrackingMapHtml(payload: TrackingMapPayload) {
  const initialPayloadJson = serializePayload(payload);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  />
  <link
    href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css"
    rel="stylesheet"
  />
  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>

  <style>
    html,
    body,
    #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #ebe9e1;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    #map {
      filter: saturate(0.72) contrast(0.96) brightness(1.07);
    }

    .maplibregl-canvas {
      outline: none;
    }

    .maplibregl-ctrl-top-left,
    .maplibregl-ctrl-top-right {
      display: none !important;
    }

    .maplibregl-ctrl-logo {
      opacity: 0.28;
      transform: scale(0.75);
      transform-origin: left bottom;
    }

    .maplibregl-ctrl-attrib {
      opacity: 0.38;
      font-size: 8px;
      background: rgba(255, 255, 255, 0.36) !important;
      color: rgba(0, 0, 0, 0.55) !important;
      border-radius: 8px 0 0 0;
      padding: 1px 4px;
    }

    .maplibregl-ctrl-attrib a {
      color: rgba(0, 0, 0, 0.55) !important;
    }

    .gz-user-marker {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      will-change: transform;
    }

    .gz-user-marker svg {
      width: 38px;
      height: 38px;
      display: block;
      filter:
        drop-shadow(0 8px 10px rgba(0, 0, 0, 0.35))
        drop-shadow(0 1px 2px rgba(255, 255, 255, 0.45));
    }

    .gz-loading {
      position: absolute;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(5, 5, 5, 0.72);
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.2px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      z-index: 5;
    }

    .gz-hidden {
      display: none;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <div id="loading" class="gz-loading">Cargando mapa...</div>

  <script>
    (function () {
      var INITIAL_PAYLOAD = ${initialPayloadJson};

      var DEFAULT_CENTER = [${DEFAULT_LOCATION.longitude}, ${DEFAULT_LOCATION.latitude}];

      var map = null;
      var marker = null;
      var mapReady = false;
      var lastPayload = sanitizePayload(INITIAL_PAYLOAD);

      function isFiniteNumber(value) {
        return typeof value === 'number' && Number.isFinite(value);
      }

      function isValidPoint(point) {
        return (
          point &&
          isFiniteNumber(point.latitude) &&
          isFiniteNumber(point.longitude) &&
          point.latitude >= -90 &&
          point.latitude <= 90 &&
          point.longitude >= -180 &&
          point.longitude <= 180
        );
      }

      function sanitizePoint(point) {
        return {
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
          timestamp: isFiniteNumber(point.timestamp) ? point.timestamp : null,
          heading: isFiniteNumber(point.heading) ? point.heading : null,
          speed: isFiniteNumber(point.speed) ? point.speed : null
        };
      }

      function sanitizePayload(payload) {
        var activityType = payload && payload.activityType === 'ride'
          ? 'ride'
          : payload && payload.activityType === 'pet'
            ? 'pet'
            : 'run';

        var route = payload && Array.isArray(payload.route)
          ? payload.route.filter(isValidPoint).map(sanitizePoint)
          : [];

        var currentLocation = payload && isValidPoint(payload.currentLocation)
          ? sanitizePoint(payload.currentLocation)
          : route.length > 0
            ? route[route.length - 1]
            : null;

        return {
          activityType: activityType,
          route: route,
          currentLocation: currentLocation
        };
      }

      function toLngLat(point) {
        return [Number(point.longitude), Number(point.latitude)];
      }

      function getCenter(payload) {
        if (isValidPoint(payload.currentLocation)) {
          return toLngLat(payload.currentLocation);
        }

        if (payload.route.length > 0) {
          return toLngLat(payload.route[payload.route.length - 1]);
        }

        return DEFAULT_CENTER;
      }

      function getTheme(activityType) {
        if (activityType === 'ride') {
          return {
            route: '#38BDF8',
            routeGlow: '#E0F2FE',
            marker: '#38BDF8',
            markerStroke: '#0F172A'
          };
        }

        if (activityType === 'pet') {
          return {
            route: '#A78BFA',
            routeGlow: '#EDE9FE',
            marker: '#A78BFA',
            markerStroke: '#2E1065'
          };
        }

        return {
          route: '#FF4B3E',
          routeGlow: '#FFE1DA',
          marker: '#FF4B3E',
          markerStroke: '#7F1D1D'
        };
      }

      function buildRouteFeature(payload) {
        var coordinates = payload.route.map(toLngLat);

        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            }
          ]
        };
      }

      function toRadians(value) {
        return value * Math.PI / 180;
      }

      function toDegrees(value) {
        return value * 180 / Math.PI;
      }

      function calculateBearing(fromPoint, toPoint) {
        if (!isValidPoint(fromPoint) || !isValidPoint(toPoint)) {
          return -18;
        }

        var lat1 = toRadians(fromPoint.latitude);
        var lat2 = toRadians(toPoint.latitude);
        var dLon = toRadians(toPoint.longitude - fromPoint.longitude);

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x =
          Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        return (toDegrees(Math.atan2(y, x)) + 360) % 360;
      }

      function getCurrentBearing(payload) {
        if (
          isValidPoint(payload.currentLocation) &&
          isFiniteNumber(payload.currentLocation.heading) &&
          payload.currentLocation.heading >= 0
        ) {
          return payload.currentLocation.heading;
        }

        if (payload.route.length >= 2) {
          return calculateBearing(
            payload.route[payload.route.length - 2],
            payload.route[payload.route.length - 1]
          );
        }

        return -18;
      }

      function hideLoading() {
        var loading = document.getElementById('loading');

        if (loading) {
          loading.classList.add('gz-hidden');
        }
      }

      function setLayoutSafe(layerId, property, value) {
        try {
          if (map && map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, property, value);
          }
        } catch (error) {}
      }

      function setPaintSafe(layerId, property, value) {
        try {
          if (map && map.getLayer(layerId)) {
            map.setPaintProperty(layerId, property, value);
          }
        } catch (error) {}
      }

      function hideLayer(layerId) {
        setLayoutSafe(layerId, 'visibility', 'none');
      }

      function tuneBaseMapStyle() {
        if (!map || !map.getStyle() || !Array.isArray(map.getStyle().layers)) {
          return;
        }

        var layers = map.getStyle().layers;

        layers.forEach(function (layer) {
          var id = String(layer.id || '').toLowerCase();
          var type = layer.type;

          if (type === 'symbol') {
            hideLayer(layer.id);
            return;
          }

          if (
            id.indexOf('label') >= 0 ||
            id.indexOf('text') >= 0 ||
            id.indexOf('place') >= 0 ||
            id.indexOf('poi') >= 0 ||
            id.indexOf('transit') >= 0 ||
            id.indexOf('station') >= 0 ||
            id.indexOf('airport') >= 0
          ) {
            hideLayer(layer.id);
            return;
          }

          if (
            id.indexOf('building') >= 0 ||
            id.indexOf('building-3d') >= 0 ||
            type === 'fill-extrusion'
          ) {
            hideLayer(layer.id);
            return;
          }

          if (
            id.indexOf('rail') >= 0 ||
            id.indexOf('tunnel') >= 0 ||
            id.indexOf('bridge-pedestrian') >= 0
          ) {
            setPaintSafe(layer.id, 'line-opacity', 0.08);
          }

          if (type === 'background') {
            setPaintSafe(layer.id, 'background-color', '#ebe9e1');
          }

          if (id.indexOf('water') >= 0) {
            setPaintSafe(layer.id, 'fill-color', '#A9D7F3');
            setPaintSafe(layer.id, 'fill-opacity', 0.42);
          }

          if (
            id.indexOf('landcover') >= 0 ||
            id.indexOf('landuse') >= 0 ||
            id.indexOf('park') >= 0 ||
            id.indexOf('grass') >= 0 ||
            id.indexOf('wood') >= 0 ||
            id.indexOf('green') >= 0
          ) {
            setPaintSafe(layer.id, 'fill-color', '#DDEDD2');
            setPaintSafe(layer.id, 'fill-opacity', 0.34);
          }

          if (type === 'line') {
            if (
              id.indexOf('motorway') >= 0 ||
              id.indexOf('highway') >= 0 ||
              id.indexOf('trunk') >= 0 ||
              id.indexOf('primary') >= 0
            ) {
              setPaintSafe(layer.id, 'line-color', '#F0C866');
              setPaintSafe(layer.id, 'line-opacity', 0.88);
              return;
            }

            if (
              id.indexOf('secondary') >= 0 ||
              id.indexOf('tertiary') >= 0 ||
              id.indexOf('major') >= 0
            ) {
              setPaintSafe(layer.id, 'line-color', '#E7D38A');
              setPaintSafe(layer.id, 'line-opacity', 0.72);
              return;
            }

            if (
              id.indexOf('road') >= 0 ||
              id.indexOf('street') >= 0 ||
              id.indexOf('minor') >= 0 ||
              id.indexOf('service') >= 0 ||
              id.indexOf('path') >= 0
            ) {
              setPaintSafe(layer.id, 'line-color', '#CFCBC2');
              setPaintSafe(layer.id, 'line-opacity', 0.55);
            }
          }

          if (type === 'fill') {
            if (id.indexOf('land') >= 0 || id.indexOf('background') >= 0) {
              setPaintSafe(layer.id, 'fill-color', '#ebe9e1');
            }
          }
        });
      }

      function ensureRouteLayers() {
        if (!map) {
          return;
        }

        if (!map.getSource('gz-route')) {
          map.addSource('gz-route', {
            type: 'geojson',
            data: buildRouteFeature(lastPayload)
          });
        }

        if (!map.getLayer('gz-route-glow')) {
          map.addLayer({
            id: 'gz-route-glow',
            type: 'line',
            source: 'gz-route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#FFE1DA',
              'line-width': 13,
              'line-opacity': 0.42,
              'line-blur': 4
            }
          });
        }

        if (!map.getLayer('gz-route-line')) {
          map.addLayer({
            id: 'gz-route-line',
            type: 'line',
            source: 'gz-route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#FF4B3E',
              'line-width': 5,
              'line-opacity': 0.96
            }
          });
        }
      }

      function updateRouteStyle(activityType) {
        var theme = getTheme(activityType);

        setPaintSafe('gz-route-glow', 'line-color', theme.routeGlow);
        setPaintSafe('gz-route-line', 'line-color', theme.route);
      }

      function buildMarkerElement(activityType) {
        var theme = getTheme(activityType);
        var element = document.createElement('div');

        element.className = 'gz-user-marker';
        element.innerHTML =
          '<svg viewBox="0 0 64 64" aria-hidden="true">' +
            '<path d="M32 5 L50 55 L32 46 L14 55 Z" fill="' + theme.marker + '" stroke="' + theme.markerStroke + '" stroke-width="4" stroke-linejoin="round"/>' +
            '<path d="M32 14 L42 47 L32 42 L22 47 Z" fill="rgba(255,255,255,0.24)"/>' +
          '</svg>';

        return element;
      }

      function updateMarker(payload) {
        if (!map || !isValidPoint(payload.currentLocation)) {
          return;
        }

        var center = toLngLat(payload.currentLocation);
        var bearing = getCurrentBearing(payload);

        if (!marker) {
          marker = new maplibregl.Marker({
            element: buildMarkerElement(payload.activityType),
            anchor: 'center',
            rotationAlignment: 'map',
            pitchAlignment: 'map'
          })
            .setLngLat(center)
            .setRotation(bearing)
            .addTo(map);

          return;
        }

        marker.setLngLat(center);
        marker.setRotation(bearing);
      }

      function moveCamera(payload, immediate) {
        if (!map) {
          return;
        }

        var center = getCenter(payload);
        var routeLength = payload.route.length;
        var cameraBearing = routeLength >= 2 ? getCurrentBearing(payload) - 18 : -25;

        var camera = {
          center: center,
          zoom: routeLength > 0 ? 17.2 : 15.2,
          pitch: 58,
          bearing: cameraBearing,
          offset: [0, 90],
          duration: immediate ? 0 : 850,
          essential: true
        };

        try {
          map.easeTo(camera);
        } catch (error) {
          map.jumpTo({
            center: center,
            zoom: camera.zoom,
            pitch: camera.pitch,
            bearing: camera.bearing
          });
        }
      }

      function updateTracking(payload, immediate) {
        lastPayload = sanitizePayload(payload || lastPayload);

        if (!mapReady || !map) {
          return true;
        }

        ensureRouteLayers();
        updateRouteStyle(lastPayload.activityType);

        var source = map.getSource('gz-route');

        if (source && typeof source.setData === 'function') {
          source.setData(buildRouteFeature(lastPayload));
        }

        updateMarker(lastPayload);
        moveCamera(lastPayload, immediate === true);

        return true;
      }

      window.__updateTracking = function (payload) {
        return updateTracking(payload, false);
      };

      function bootMap() {
        if (!window.maplibregl) {
          var loading = document.getElementById('loading');

          if (loading) {
            loading.textContent = 'No se pudo cargar el mapa';
          }

          return;
        }

        map = new maplibregl.Map({
          container: 'map',
          style: 'https://tiles.openfreemap.org/styles/liberty',
          center: getCenter(lastPayload),
          zoom: lastPayload.currentLocation ? 17.2 : 15.2,
          pitch: 58,
          bearing: -25,
          attributionControl: true,
          logoPosition: 'bottom-left',
          interactive: false,
          maxPitch: 68
        });

        map.on('load', function () {
          tuneBaseMapStyle();
          ensureRouteLayers();

          mapReady = true;
          hideLoading();

          updateTracking(lastPayload, true);
        });

        map.on('styledata', function () {
          if (!mapReady) {
            return;
          }

          tuneBaseMapStyle();
        });

        map.on('error', function () {
          hideLoading();
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootMap);
      } else {
        bootMap();
      }
    })();
  </script>
</body>
</html>`;
}