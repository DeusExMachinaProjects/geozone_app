export type TrackingMapPoint = {
  latitude: number;
  longitude: number;
};

export type TrackingMapPayload = {
  activityType: 'run' | 'ride' | 'pet';
  route: TrackingMapPoint[];
  currentLocation: TrackingMapPoint | null;
};

export function buildTrackingMapHtml(payload: TrackingMapPayload) {
  const payloadJson = JSON.stringify(payload);

  return `
<!DOCTYPE html>
<html>
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
    <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>

    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #edf0e4;
        overflow: hidden;
      }

      #map {
        position: absolute;
        inset: 0;
      }

      #mode-pill {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 3;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(8, 8, 8, 0.84);
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.3px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 26px rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        user-select: none;
      }

      #hud {
        position: absolute;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        z-index: 4;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.58);
        color: #ffffff;
        font-size: 12px;
        line-height: 16px;
        display: none;
        white-space: nowrap;
      }

      .maplibregl-ctrl-top-right,
      .maplibregl-ctrl-top-left {
        display: none !important;
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
        color: #f3f4f6 !important;
        font-size: 7px !important;
        line-height: 9px !important;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
      }

      .maplibregl-ctrl-attrib a {
        color: #f3f4f6 !important;
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
    <div id="mode-pill">Run view</div>
    <div id="hud"></div>

    <script>
      const INITIAL_PAYLOAD = ${payloadJson};
      const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

      const MAP_THEME = {
        background: '#edf0e4',
        land: '#edf0e4',
        park: '#d6e8c8',
        water: '#bcdff4',
        roadMinor: '#d7d4cb',
        roadMajor: '#efd07d',
        roadOutline: '#d8b25d',
        building: '#ddd8cd',
      };

      function safeSetLayoutProperty(layerId, property, value) {
        try {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, property, value);
          }
        } catch (error) {}
      }

      function safeSetPaintProperty(layerId, property, value) {
        try {
          if (map.getLayer(layerId)) {
            map.setPaintProperty(layerId, property, value);
          }
        } catch (error) {}
      }

      const ACTIVITY_CONFIG = {
        run: {
          modeLabel: 'Correr',
          normalizeMinDistance: 3.2,
          smoothPasses: 1,
          finalMinDistance: 2.2,
          cameraMinDistance: 3.6,
          runColor: '#ff6b52',
        },
        ride: {
          modeLabel: 'Bicicleta',
          normalizeMinDistance: 7.5,
          smoothPasses: 1,
          finalMinDistance: 5.2,
          cameraMinDistance: 7.5,
          tireColor: '#111111',
          tireOutline: '#000000',
        },
        pet: {
          modeLabel: 'Mascota',
          normalizeMinDistance: 5.5,
          smoothPasses: 1,
          finalMinDistance: 4.2,
          cameraMinDistance: 5.5,
          pawStepMeters: 14,
          pawMinDistanceMeters: 7.5,
          pawColor: '#3b82f6',
        },
      };

      let map;

      function normalizeActivityType(value) {
        if (value === 'ride') return 'ride';
        if (value === 'pet') return 'pet';
        return 'run';
      }

      function getActivityConfig(activityType) {
        return ACTIVITY_CONFIG[normalizeActivityType(activityType)] || ACTIVITY_CONFIG.run;
      }

      function sanitizePoint(point) {
        if (!point) return null;

        const lat = Number(point.latitude);
        const lng = Number(point.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return {latitude: lat, longitude: lng};
      }

      function sanitizePayload(payload) {
        const route = Array.isArray(payload?.route)
          ? payload.route.map(sanitizePoint).filter(Boolean)
          : [];

        const currentLocation = sanitizePoint(payload?.currentLocation);

        return {
          activityType: normalizeActivityType(payload?.activityType),
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

      function setModePill(activityType) {
        const pill = document.getElementById('mode-pill');
        pill.textContent = getActivityConfig(activityType).modeLabel;
      }

      function transparentImage() {
        return {
          width: 1,
          height: 1,
          data: new Uint8Array([0, 0, 0, 0]),
        };
      }

      function installStyleImageFallback() {
        map.on('styleimagemissing', event => {
          const imageId = event.id;
          if (!map.hasImage(imageId)) {
            map.addImage(imageId, transparentImage());
          }
        });
      }

      function simplifyStyle() {
        const style = map.getStyle();
        if (!style || !style.layers) return;

        style.layers.forEach(layer => {
          const id = (layer.id || '').toLowerCase();
          const type = layer.type || '';

          if (type === 'symbol') {
            safeSetLayoutProperty(layer.id, 'visibility', 'none');
            return;
          }

          if (
            id.includes('poi') ||
            id.includes('place') ||
            id.includes('transit') ||
            id.includes('housenumber') ||
            id.includes('address') ||
            id.includes('aeroway') ||
            id.includes('rail') ||
            id.includes('boundary')
          ) {
            safeSetLayoutProperty(layer.id, 'visibility', 'none');
            return;
          }

          if (type === 'fill-extrusion') {
            safeSetLayoutProperty(layer.id, 'visibility', 'none');
            return;
          }

          if (type === 'background') {
            safeSetPaintProperty(layer.id, 'background-color', MAP_THEME.background);
            return;
          }

          if (type === 'fill') {
            if (id.includes('water')) {
              safeSetPaintProperty(layer.id, 'fill-color', MAP_THEME.water);
              safeSetPaintProperty(layer.id, 'fill-opacity', 0.95);
              return;
            }

            if (
              id.includes('park') ||
              id.includes('grass') ||
              id.includes('green') ||
              id.includes('wood') ||
              id.includes('forest') ||
              id.includes('cemetery') ||
              id.includes('golf')
            ) {
              safeSetPaintProperty(layer.id, 'fill-color', MAP_THEME.park);
              safeSetPaintProperty(layer.id, 'fill-opacity', 0.92);
              return;
            }

            if (id.includes('building')) {
              safeSetPaintProperty(layer.id, 'fill-color', MAP_THEME.building);
              safeSetPaintProperty(layer.id, 'fill-opacity', 0.45);
              return;
            }

            safeSetPaintProperty(layer.id, 'fill-color', MAP_THEME.land);
            safeSetPaintProperty(layer.id, 'fill-opacity', 1);
            return;
          }

          if (type === 'line') {
            if (id.includes('water')) {
              safeSetPaintProperty(layer.id, 'line-color', MAP_THEME.water);
              safeSetPaintProperty(layer.id, 'line-opacity', 0.9);
              return;
            }

            if (
              id.includes('motorway') ||
              id.includes('trunk') ||
              id.includes('primary') ||
              id.includes('secondary') ||
              id.includes('major')
            ) {
              safeSetPaintProperty(layer.id, 'line-color', MAP_THEME.roadMajor);
              safeSetPaintProperty(layer.id, 'line-opacity', 0.9);

              if (id.includes('casing') || id.includes('outline')) {
                safeSetPaintProperty(layer.id, 'line-color', MAP_THEME.roadOutline);
                safeSetPaintProperty(layer.id, 'line-opacity', 0.75);
              }
              return;
            }

            if (
              id.includes('street') ||
              id.includes('road') ||
              id.includes('tertiary') ||
              id.includes('minor') ||
              id.includes('service') ||
              id.includes('path') ||
              id.includes('track') ||
              id.includes('link')
            ) {
              safeSetPaintProperty(layer.id, 'line-color', MAP_THEME.roadMinor);
              safeSetPaintProperty(layer.id, 'line-opacity', 0.72);
              return;
            }
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

      function normalizeRoute(route, minPointDistanceMeters) {
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
          getDistanceMeters(lastNormalized, lastInput) >= Math.max(1.5, minPointDistanceMeters * 0.35)
        ) {
          normalized.push(lastInput);
        }

        return normalized;
      }

      function smoothRoute(route) {
        if (!Array.isArray(route) || route.length < 3) {
          return Array.isArray(route) ? route.slice() : [];
        }

        const smoothed = [route[0]];

        for (let i = 1; i < route.length - 1; i += 1) {
          const prev = route[i - 1];
          const curr = route[i];
          const next = route[i + 1];

          smoothed.push({
            latitude: prev.latitude * 0.25 + curr.latitude * 0.5 + next.latitude * 0.25,
            longitude: prev.longitude * 0.25 + curr.longitude * 0.5 + next.longitude * 0.25,
          });
        }

        smoothed.push(route[route.length - 1]);
        return smoothed;
      }

      function buildDisplayRoute(route, activityType) {
        const config = getActivityConfig(activityType);
        const normalized = normalizeRoute(route, config.normalizeMinDistance);

        let displayRoute = normalized;
        for (let i = 0; i < config.smoothPasses; i += 1) {
          displayRoute = smoothRoute(displayRoute);
        }

        return normalizeRoute(displayRoute, config.finalMinDistance);
      }

      function buildCameraRoute(route, activityType) {
        const config = getActivityConfig(activityType);
        return normalizeRoute(route, config.cameraMinDistance);
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
          return 0;
        }

        const end = route[route.length - 1];

        for (let i = route.length - 2; i >= 0; i -= 1) {
          const candidate = route[i];
          if (getDistanceMeters(candidate, end) >= 6) {
            return getBearingDegrees(candidate, end);
          }
        }

        return 0;
      }

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function normalizeBearing(value) {
        let result = value;
        while (result > 180) result -= 360;
        while (result < -180) result += 360;
        return result;
      }

      function getTiltedBearing(route) {
        const rawBearing = getRecentBearing(route);
        if (!Array.isArray(route) || route.length < 2) {
          return -24;
        }

        return normalizeBearing(rawBearing - 24);
      }

      function getFollowCenter(currentLocation, route) {
        const bearing = getTiltedBearing(route);
        return offsetCoordinate(currentLocation, bearing + 180, 58);
      }

      function getLastRoutePoint(route) {
        if (!Array.isArray(route) || route.length === 0) return null;
        return route[route.length - 1] || null;
      }

      function getFocusLocation(currentLocation, route) {
        return currentLocation || getLastRoutePoint(route) || null;
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
          if (point.latitude < minLat) minLat = point.latitude;
          if (point.latitude > maxLat) maxLat = point.latitude;
          if (point.longitude < minLng) minLng = point.longitude;
          if (point.longitude > maxLng) maxLng = point.longitude;
        }

        return {minLat, maxLat, minLng, maxLng};
      }

      function buildLineStringFeature(route) {
        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.map(point => [point.longitude, point.latitude]),
          },
          properties: {},
        };
      }

      function emptyLineStringFeature() {
        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
          properties: {},
        };
      }

      function offsetCoordinate(point, bearingDegrees, offsetMeters) {
        const angle = toRad(bearingDegrees);

        const dLat = (offsetMeters * Math.cos(angle)) / 111111;
        const dLng =
          (offsetMeters * Math.sin(angle)) /
          (111111 * Math.max(0.0001, Math.cos(toRad(point.latitude))));

        return {
          latitude: point.latitude + dLat,
          longitude: point.longitude + dLng,
        };
      }

      function buildPawFeatureCollection(route, activityType) {
        const config = getActivityConfig(activityType);
        const stepDistanceMeters = config.pawStepMeters || 14;
        const minPawDistanceMeters = config.pawMinDistanceMeters || 7.5;

        if (!Array.isArray(route) || route.length < 2) {
          return {type: 'FeatureCollection', features: []};
        }

        const features = [];
        let distanceSinceLastPaw = 0;
        let side = 'left';
        let lastPlacedPoint = null;

        for (let i = 1; i < route.length; i += 1) {
          let segmentStart = route[i - 1];
          const segmentEnd = route[i];
          let segmentDistance = getDistanceMeters(segmentStart, segmentEnd);

          if (segmentDistance < 2) {
            continue;
          }

          const rotation = getBearingDegrees(segmentStart, segmentEnd);

          while (distanceSinceLastPaw + segmentDistance >= stepDistanceMeters) {
            const needed = stepDistanceMeters - distanceSinceLastPaw;
            const t = needed / segmentDistance;
            const basePoint = interpolatePoint(segmentStart, segmentEnd, t);

            if (
              !lastPlacedPoint ||
              getDistanceMeters(lastPlacedPoint, basePoint) >= minPawDistanceMeters
            ) {
              const sideBearing = side === 'left' ? rotation - 90 : rotation + 90;
              const shiftedPoint = offsetCoordinate(basePoint, sideBearing, 0.85);

              features.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [shiftedPoint.longitude, shiftedPoint.latitude],
                },
                properties: {
                  rotation,
                },
              });

              lastPlacedPoint = basePoint;
              side = side === 'left' ? 'right' : 'left';
            }

            segmentStart = basePoint;
            segmentDistance = getDistanceMeters(segmentStart, segmentEnd);
            distanceSinceLastPaw = 0;
          }

          distanceSinceLastPaw += segmentDistance;
        }

        return {type: 'FeatureCollection', features};
      }

      function ensureSource(id, data) {
        if (!map.getSource(id)) {
          map.addSource(id, {
            type: 'geojson',
            data,
          });
        }
      }

      function ensureLayer(id, definition) {
        if (!map.getLayer(id)) {
          map.addLayer(definition);
        }
      }

      function ensureTrackingLayers() {
        ensureSource('tracking-run-source', emptyLineStringFeature());
        ensureSource('tracking-ride-source', emptyLineStringFeature());
        ensureSource('tracking-paw-source', {type: 'FeatureCollection', features: []});
        ensureSource('tracking-position-source', {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [0, 0]},
          properties: {},
        });

        ensureLayer('tracking-run-line-outline', {
          id: 'tracking-run-line-outline',
          type: 'line',
          source: 'tracking-run-source',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': 'rgba(0,0,0,0.18)',
            'line-width': 10,
            'line-opacity': 0.28,
          },
        });

        ensureLayer('tracking-run-line', {
          id: 'tracking-run-line',
          type: 'line',
          source: 'tracking-run-source',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': ACTIVITY_CONFIG.run.runColor,
            'line-width': 5.5,
            'line-opacity': 0.98,
          },
        });

        const bikeOutlineWidth = 5.2;
        const bikeInnerWidth = 3.2;
        const bikeOffset = 3.6;

        ensureLayer('tracking-ride-left-outline', {
          id: 'tracking-ride-left-outline',
          type: 'line',
          source: 'tracking-ride-source',
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
          },
          paint: {
            'line-color': ACTIVITY_CONFIG.ride.tireOutline,
            'line-width': bikeOutlineWidth,
            'line-offset': -bikeOffset,
            'line-opacity': 0.96,
            'line-dasharray': [0.8, 0.55],
          },
        });

        ensureLayer('tracking-ride-right-outline', {
          id: 'tracking-ride-right-outline',
          type: 'line',
          source: 'tracking-ride-source',
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
          },
          paint: {
            'line-color': ACTIVITY_CONFIG.ride.tireOutline,
            'line-width': bikeOutlineWidth,
            'line-offset': bikeOffset,
            'line-opacity': 0.96,
            'line-dasharray': [0.8, 0.55],
          },
        });

        ensureLayer('tracking-ride-left-inner', {
          id: 'tracking-ride-left-inner',
          type: 'line',
          source: 'tracking-ride-source',
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
          },
          paint: {
            'line-color': ACTIVITY_CONFIG.ride.tireColor,
            'line-width': bikeInnerWidth,
            'line-offset': -bikeOffset,
            'line-opacity': 1,
            'line-dasharray': [0.32, 1.1],
          },
        });

        ensureLayer('tracking-ride-right-inner', {
          id: 'tracking-ride-right-inner',
          type: 'line',
          source: 'tracking-ride-source',
          layout: {
            'line-cap': 'butt',
            'line-join': 'round',
          },
          paint: {
            'line-color': ACTIVITY_CONFIG.ride.tireColor,
            'line-width': bikeInnerWidth,
            'line-offset': bikeOffset,
            'line-opacity': 1,
            'line-dasharray': [0.32, 1.1],
          },
        });

        ensureLayer('tracking-paw-symbols', {
          id: 'tracking-paw-symbols',
          type: 'symbol',
          source: 'tracking-paw-source',
          layout: {
            'text-field': '🐾',
            'text-size': 15,
            'text-rotation-alignment': 'map',
            'text-rotate': ['get', 'rotation'],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'text-keep-upright': false,
          },
          paint: {
            'text-color': ACTIVITY_CONFIG.pet.pawColor,
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.1,
            'text-opacity': 0.98,
          },
        });

        ensureLayer('tracking-position-halo', {
          id: 'tracking-position-halo',
          type: 'circle',
          source: 'tracking-position-source',
          paint: {
            'circle-radius': 18,
            'circle-color': '#ff6b52',
            'circle-opacity': 0.2,
          },
        });

        ensureLayer('tracking-position-core', {
          id: 'tracking-position-core',
          type: 'circle',
          source: 'tracking-position-source',
          paint: {
            'circle-radius': 8,
            'circle-color': '#ff6b52',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
          },
        });
      }

      function setTrailVisibility(activityType) {
        const runVisibility = activityType === 'run' ? 'visible' : 'none';
        const rideVisibility = activityType === 'ride' ? 'visible' : 'none';
        const pawVisibility = activityType === 'pet' ? 'visible' : 'none';

        ['tracking-run-line-outline', 'tracking-run-line'].forEach(id => {
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', runVisibility);
          }
        });

        [
          'tracking-ride-left-outline',
          'tracking-ride-right-outline',
          'tracking-ride-left-inner',
          'tracking-ride-right-inner',
        ].forEach(id => {
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', rideVisibility);
          }
        });

        if (map.getLayer('tracking-paw-symbols')) {
          map.setLayoutProperty('tracking-paw-symbols', 'visibility', pawVisibility);
        }
      }

      function clearRunTrail() {
        const source = map.getSource('tracking-run-source');
        if (source) {
          source.setData(emptyLineStringFeature());
        }
      }

      function clearRideTrail() {
        const source = map.getSource('tracking-ride-source');
        if (source) {
          source.setData(emptyLineStringFeature());
        }
      }

      function clearPawTrail() {
        const source = map.getSource('tracking-paw-source');
        if (source) {
          source.setData({type: 'FeatureCollection', features: []});
        }
      }

      function updateTrail(route, activityType) {
        const displayRoute = buildDisplayRoute(route, activityType);
        setTrailVisibility(activityType);

        if (activityType === 'ride') {
          clearRunTrail();
          clearPawTrail();

          const rideSource = map.getSource('tracking-ride-source');
          if (rideSource) {
            rideSource.setData(
              displayRoute.length >= 2
                ? buildLineStringFeature(displayRoute)
                : emptyLineStringFeature()
            );
          }
          return;
        }

        if (activityType === 'pet') {
          clearRunTrail();
          clearRideTrail();

          const pawSource = map.getSource('tracking-paw-source');
          if (pawSource) {
            pawSource.setData(buildPawFeatureCollection(displayRoute, activityType));
          }
          return;
        }

        clearRideTrail();
        clearPawTrail();

        const runSource = map.getSource('tracking-run-source');
        if (runSource) {
          runSource.setData(
            displayRoute.length >= 2
              ? buildLineStringFeature(displayRoute)
              : emptyLineStringFeature()
          );
        }
      }

      function updatePosition(currentLocation) {
        const source = map.getSource('tracking-position-source');
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
        if (totalDistanceMeters < 120) return 60;
        if (totalDistanceMeters < 250) return 56;
        if (totalDistanceMeters < 500) return 52;
        if (totalDistanceMeters < 900) return 48;
        return 44;
      }

      function getOverviewMaxZoom(totalDistanceMeters) {
        if (totalDistanceMeters < 120) return 17.2;
        if (totalDistanceMeters < 250) return 16.8;
        if (totalDistanceMeters < 500) return 16.1;
        if (totalDistanceMeters < 900) return 15.5;
        return 14.9;
      }

      function updateCamera(currentLocation, route, activityType) {
        if (!currentLocation) return;

        const displayRoute = buildCameraRoute(route, activityType);
        const pointsForCamera = displayRoute.length
          ? displayRoute.concat([currentLocation])
          : [currentLocation];

        const totalDistance = getRouteLengthMeters(pointsForCamera);
        const cameraBearing = getTiltedBearing(pointsForCamera);

        map.stop();

        if (pointsForCamera.length < 2 || totalDistance < 55) {
          const followCenter = getFollowCenter(currentLocation, pointsForCamera);

          map.easeTo({
            center: [followCenter.longitude, followCenter.latitude],
            zoom: 17.9,
            pitch: 62,
            bearing: cameraBearing,
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
            top: 68,
            right: 36,
            bottom: 250,
            left: 118,
          },
          maxZoom: getOverviewMaxZoom(totalDistance),
        });

        if (camera) {
          map.easeTo({
            center: camera.center,
            zoom: clamp(camera.zoom, 14.7, getOverviewMaxZoom(totalDistance)),
            pitch: getOverviewPitch(totalDistance),
            bearing: cameraBearing,
            duration: 950,
          });
          return;
        }

        map.fitBounds([sw, ne], {
          padding: {
            top: 68,
            right: 36,
            bottom: 250,
            left: 118,
          },
          maxZoom: getOverviewMaxZoom(totalDistance),
          duration: 900,
        });
      }

      function renderPayload(rawPayload) {
        const payload = sanitizePayload(rawPayload);
        const currentLocation = payload.currentLocation;
        const route = payload.route;
        const activityType = payload.activityType;
        const focusLocation = getFocusLocation(currentLocation, route);

        setModePill(activityType);
        setTrailVisibility(activityType);
        updateTrail(route, activityType);

        if (currentLocation) {
          hideHud();
          updatePosition(currentLocation);
          updateCamera(currentLocation, route, activityType);
          return;
        }

        showHud('Esperando GPS...');

        if (focusLocation) {
          updateCamera(focusLocation, route, activityType);
        }
      }

      function initMap() {
        const payload = sanitizePayload(INITIAL_PAYLOAD);
        const currentLocation = payload.currentLocation;
        const focusLocation = getFocusLocation(currentLocation, payload.route);

        map = new maplibregl.Map({
          container: 'map',
          style: STYLE_URL,
          center: focusLocation
            ? [focusLocation.longitude, focusLocation.latitude]
            : [-70.64827, -33.45694],
          zoom: focusLocation ? 17.4 : 15.6,
          pitch: focusLocation ? 60 : 54,
          bearing: focusLocation ? -24 : -24,
          attributionControl: true,
        });

        map.on('load', () => {
          installStyleImageFallback();
          simplifyStyle();
          ensureTrackingLayers();

          map.dragRotate.disable();
          map.touchZoomRotate.disableRotation();

          renderPayload(payload);
        });
      }

      window.__updateTracking = function(payload) {
        if (!map || !map.isStyleLoaded()) {
          return;
        }

        renderPayload(payload);
      };

      initMap();
    </script>
  </body>
</html>`;
}