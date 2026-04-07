type SerializablePoint = {
  latitude: number;
  longitude: number;
};

export type PetTrackingMapPayload = {
  route: SerializablePoint[];
  currentLocation: SerializablePoint | null;
};

function serializeForHtml(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function buildPetTrackingMapHtml(initialPayload: PetTrackingMapPayload) {
  const payloadJson = serializeForHtml(initialPayload);

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <title>GeoZone Pet Tracking Map</title>

    <link
      href="https://unpkg.com/maplibre-gl@5.22.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/maplibre-gl@5.22.0/dist/maplibre-gl.js"></script>

    <style>
      html, body, #map {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #a8d5c2;
        overflow: hidden;
        font-family: Arial, sans-serif;
      }

      #hud {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 20;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.58);
        color: #fff;
        font-size: 12px;
        line-height: 16px;
        display: none;
      }

            .maplibregl-ctrl-bottom-right {
              right: 6px !important;
              bottom: 6px !important;
              transform: none !important;
            }

            .maplibregl-ctrl-bottom-left {
              left: 6px !important;
              bottom: 6px !important;
              transform: none !important;
            }

            .maplibregl-ctrl-attrib {
              max-width: 112px !important;
              min-height: 16px !important;
              padding: 1px 4px !important;
              border-radius: 6px !important;
              background: rgba(18, 18, 18, 0.36) !important;
              box-shadow: none !important;
              color: #F3F4F6 !important;
              font-size: 7px !important;
              line-height: 9px !important;
              backdrop-filter: blur(2px);
              -webkit-backdrop-filter: blur(2px);
            }

            .maplibregl-ctrl-attrib a {
              color: #F3F4F6 !important;
              text-decoration: none !important;
              font-size: inherit !important;
              line-height: inherit !important;
            }

            .maplibregl-ctrl-attrib-button {
              width: 16px !important;
              height: 16px !important;
              min-width: 16px !important;
              min-height: 16px !important;
              margin: 0 !important;
              border-radius: 999px !important;
              background-color: rgba(18, 18, 18, 0.36) !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="hud"></div>

    <script>
      const INITIAL_PAYLOAD = ${payloadJson};
      const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

      let map;

      function sanitizePoint(point) {
        if (!point) return null;

        const lat = Number(point.latitude);
        const lng = Number(point.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return { latitude: lat, longitude: lng };
      }

      function sanitizePayload(payload) {
        const route = Array.isArray(payload?.route)
          ? payload.route.map(sanitizePoint).filter(Boolean)
          : [];

        const currentLocation = sanitizePoint(payload?.currentLocation);

        return {
          route,
          currentLocation,
        };
      }

      function showHud(message) {
        const hud = document.getElementById('hud');
        hud.textContent = message;
        hud.style.display = 'block';
      }

      function hideHud() {
        const hud = document.getElementById('hud');
        hud.textContent = '';
        hud.style.display = 'none';
      }

      function transparentImage() {
        return {
          width: 1,
          height: 1,
          data: new Uint8Array([0, 0, 0, 0]),
        };
      }

      function installStyleImageFallback() {
        map.on('styleimagemissing', (event) => {
          const imageId = event.id;
          if (!map.hasImage(imageId)) {
            map.addImage(imageId, transparentImage());
          }
        });
      }

      function simplifyStyle() {
        const style = map.getStyle();
        if (!style || !style.layers) return;

        style.layers.forEach((layer) => {
          const id = layer.id || '';
          const type = layer.type || '';

          if (type === 'symbol') {
            map.setLayoutProperty(id, 'visibility', 'none');
            return;
          }

          if (
            id.includes('poi') ||
            id.includes('place') ||
            id.includes('transit') ||
            id.includes('housenumber') ||
            id.includes('address')
          ) {
            map.setLayoutProperty(id, 'visibility', 'none');
            return;
          }

          if (type === 'fill-extrusion') {
            map.setLayoutProperty(id, 'visibility', 'none');
          }
        });
      }

      function toRad(value) {
        return (value * Math.PI) / 180;
      }

      function toDeg(value) {
        return (value * 180) / Math.PI;
      }

      function getDistanceMeters(a, b) {
        const R = 6371000;
        const dLat = toRad(b.latitude - a.latitude);
        const dLng = toRad(b.longitude - a.longitude);

        const lat1 = toRad(a.latitude);
        const lat2 = toRad(b.latitude);

        const h =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
        return R * c;
      }

      function getBearingDegrees(a, b) {
        const lat1 = toRad(a.latitude);
        const lat2 = toRad(b.latitude);
        const dLng = toRad(b.longitude - a.longitude);

        const y = Math.sin(dLng) * Math.cos(lat2);
        const x =
          Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

        const bearing = toDeg(Math.atan2(y, x));
        return (bearing + 360) % 360;
      }

      function interpolatePoint(a, b, t) {
        return {
          latitude: a.latitude + (b.latitude - a.latitude) * t,
          longitude: a.longitude + (b.longitude - a.longitude) * t,
        };
      }

      function normalizeRoute(route, minPointDistanceMeters = 4) {
        if (!Array.isArray(route) || route.length === 0) {
          return [];
        }

        const normalized = [route[0]];

        for (let i = 1; i < route.length; i += 1) {
          const point = route[i];
          const lastKept = normalized[normalized.length - 1];

          if (getDistanceMeters(lastKept, point) >= minPointDistanceMeters) {
            normalized.push(point);
          }
        }

        const lastInput = route[route.length - 1];
        const lastNormalized = normalized[normalized.length - 1];

        if (
          lastInput &&
          lastNormalized &&
          getDistanceMeters(lastNormalized, lastInput) >= 1.5
        ) {
          normalized.push(lastInput);
        }

        return normalized;
      }

      function smoothRoute(route) {
        if (!Array.isArray(route) || route.length < 3) {
          return route.slice();
        }

        const smoothed = [route[0]];

        for (let i = 1; i < route.length - 1; i += 1) {
          const prev = route[i - 1];
          const curr = route[i];
          const next = route[i + 1];

          smoothed.push({
            latitude: (prev.latitude + curr.latitude + next.latitude) / 3,
            longitude: (prev.longitude + curr.longitude + next.longitude) / 3,
          });
        }

        smoothed.push(route[route.length - 1]);
        return smoothed;
      }

      function buildDisplayRoute(route) {
        const normalized = normalizeRoute(route, 4);
        const smoothed = smoothRoute(normalized);
        return normalizeRoute(smoothed, 3);
      }

      function getRouteLengthMeters(route) {
        if (!Array.isArray(route) || route.length < 2) {
          return 0;
        }

        let total = 0;

        for (let i = 1; i < route.length; i += 1) {
          total += getDistanceMeters(route[i - 1], route[i]);
        }

        return total;
      }

      function getRecentBearing(route) {
        if (!Array.isArray(route) || route.length < 2) {
          return -28;
        }

        for (let i = route.length - 1; i > 0; i -= 1) {
          const prev = route[i - 1];
          const curr = route[i];

          if (getDistanceMeters(prev, curr) >= 3) {
            return getBearingDegrees(prev, curr);
          }
        }

        return -28;
      }

      function getBounds(points) {
        if (!Array.isArray(points) || points.length === 0) {
          return null;
        }

        let minLat = points[0].latitude;
        let maxLat = points[0].latitude;
        let minLng = points[0].longitude;
        let maxLng = points[0].longitude;

        for (let i = 1; i < points.length; i += 1) {
          const point = points[i];
          minLat = Math.min(minLat, point.latitude);
          maxLat = Math.max(maxLat, point.latitude);
          minLng = Math.min(minLng, point.longitude);
          maxLng = Math.max(maxLng, point.longitude);
        }

        return {
          minLat,
          maxLat,
          minLng,
          maxLng,
        };
      }

      function buildPawFeatureCollection(route, stepDistanceMeters = 7) {
        if (!Array.isArray(route) || route.length < 2) {
          return {
            type: 'FeatureCollection',
            features: [],
          };
        }

        const features = [];
        let distanceSinceLastPaw = 0;
        let pawIndex = 0;

        for (let i = 1; i < route.length; i += 1) {
          let segmentStart = route[i - 1];
          const segmentEnd = route[i];

          let segmentDistance = getDistanceMeters(segmentStart, segmentEnd);

          if (segmentDistance < 2) {
            continue;
          }

          const rotation = getBearingDegrees(segmentStart, segmentEnd);

          while (distanceSinceLastPaw + segmentDistance >= stepDistanceMeters) {
            const neededDistance = stepDistanceMeters - distanceSinceLastPaw;
            const t =
              segmentDistance === 0 ? 0 : neededDistance / segmentDistance;

            const basePoint = interpolatePoint(segmentStart, segmentEnd, t);

            features.push({
              type: 'Feature',
              properties: {
                id: 'paw-' + pawIndex,
                rotation,
              },
              geometry: {
                type: 'Point',
                coordinates: [basePoint.longitude, basePoint.latitude],
              },
            });

            pawIndex += 1;
            segmentStart = basePoint;
            segmentDistance = getDistanceMeters(segmentStart, segmentEnd);
            distanceSinceLastPaw = 0;
          }

          distanceSinceLastPaw += segmentDistance;
        }

        return {
          type: 'FeatureCollection',
          features,
        };
      }

      function ensureTrackingSources() {
        if (!map.getSource('pet-paws-source')) {
          map.addSource('pet-paws-source', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });
        }

        if (!map.getSource('pet-position-source')) {
          map.addSource('pet-position-source', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [0, 0],
              },
              properties: {},
            },
          });
        }

        if (!map.getLayer('pet-paw-symbols')) {
          map.addLayer({
            id: 'pet-paw-symbols',
            type: 'symbol',
            source: 'pet-paws-source',
            layout: {
              'text-field': '🐾',
              'text-size': 16,
              'text-rotation-alignment': 'map',
              'text-rotate': ['get', 'rotation'],
              'text-allow-overlap': true,
              'text-ignore-placement': true,
              'text-keep-upright': false,
            },
            paint: {
              'text-color': '#ff6b52',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.1,
              'text-opacity': 0.96,
            },
          });
        }

        if (!map.getLayer('pet-position-halo')) {
          map.addLayer({
            id: 'pet-position-halo',
            type: 'circle',
            source: 'pet-position-source',
            paint: {
              'circle-radius': 18,
              'circle-color': '#ff6b52',
              'circle-opacity': 0.20,
            },
          });
        }

        if (!map.getLayer('pet-position-core')) {
          map.addLayer({
            id: 'pet-position-core',
            type: 'circle',
            source: 'pet-position-source',
            paint: {
              'circle-radius': 8,
              'circle-color': '#ff6b52',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
            },
          });
        }
      }

      function updatePawTrail(route) {
        const source = map.getSource('pet-paws-source');
        if (!source) return;

        const displayRoute = buildDisplayRoute(route);
        source.setData(buildPawFeatureCollection(displayRoute, 7));
      }

      function updatePosition(currentLocation) {
        const source = map.getSource('pet-position-source');
        if (!source || !currentLocation) return;

        source.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [currentLocation.longitude, currentLocation.latitude],
          },
          properties: {},
        });
      }

      function getOverviewPitch(totalDistanceMeters) {
        if (totalDistanceMeters < 120) return 46;
        if (totalDistanceMeters < 250) return 36;
        if (totalDistanceMeters < 500) return 28;
        return 20;
      }

      function getOverviewMaxZoom(totalDistanceMeters) {
        if (totalDistanceMeters < 120) return 17.2;
        if (totalDistanceMeters < 250) return 16.5;
        if (totalDistanceMeters < 500) return 15.5;
        return 14.8;
      }

      function updateCamera(currentLocation, route) {
        if (!currentLocation) return;

        const displayRoute = buildDisplayRoute(route);
        const pointsForCamera = displayRoute.length
          ? displayRoute.concat([currentLocation])
          : [currentLocation];

        const totalDistance = getRouteLengthMeters(pointsForCamera);

        map.stop();

        if (pointsForCamera.length < 2 || totalDistance < 45) {
          map.easeTo({
            center: [currentLocation.longitude, currentLocation.latitude],
            zoom: 17.8,
            pitch: 58,
            bearing: getRecentBearing(pointsForCamera),
            duration: 700,
          });
          return;
        }

        const bounds = getBounds(pointsForCamera);
        if (!bounds) return;

        const sw = [bounds.minLng, bounds.minLat];
        const ne = [bounds.maxLng, bounds.maxLat];

        const camera = map.cameraForBounds([sw, ne], {
          padding: {
            top: 54,
            right: 34,
            bottom: 54,
            left: 34,
          },
          maxZoom: getOverviewMaxZoom(totalDistance),
        });

        if (camera) {
          map.easeTo({
            center: camera.center,
            zoom: camera.zoom,
            pitch: getOverviewPitch(totalDistance),
            bearing: 0,
            duration: 850,
          });
          return;
        }

        map.fitBounds([sw, ne], {
          padding: {
            top: 54,
            right: 34,
            bottom: 54,
            left: 34,
          },
          maxZoom: getOverviewMaxZoom(totalDistance),
          duration: 850,
        });
      }

      function renderPayload(rawPayload) {
        const payload = sanitizePayload(rawPayload);
        const currentLocation = payload.currentLocation;
        const route = payload.route;

        if (!currentLocation) {
          showHud('Esperando GPS...');
          return;
        }

        hideHud();
        updatePosition(currentLocation);
        updatePawTrail(route);
        updateCamera(currentLocation, route);
      }

      function initMap() {
        const payload = sanitizePayload(INITIAL_PAYLOAD);
        const currentLocation = payload.currentLocation;

         map = new maplibregl.Map({
                  container: 'map',
                  style: STYLE_URL,
                  center: currentLocation
                    ? [currentLocation.longitude, currentLocation.latitude]
                    : [-70.64827, -33.45694],
                  zoom: currentLocation ? 17.5 : 13,
                  pitch: 58,
                  bearing: -28,
                  attributionControl: false,
                  antialias: true,
                });

                map.addControl(
                  new maplibregl.AttributionControl({
                    compact: true,
                  }),
                  'bottom-right'
                );

        installStyleImageFallback();

        map.on('load', () => {
          simplifyStyle();
          ensureTrackingSources();
          renderPayload(payload);
        });
      }

      window.__updatePetTracking = function updatePetTracking(payload) {
        if (!map || !map.isStyleLoaded()) return;
        renderPayload(payload);
      };

      window.addEventListener('load', initMap);
    </script>
  </body>
</html>`;
}