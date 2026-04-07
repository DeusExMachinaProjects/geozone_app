import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import type {TrackingPoint} from '../../tracking/types';
import {styles} from './PetTrackingMap.styles';
import {
  buildPetTrackingMapHtml,
  type PetTrackingMapPayload,
} from './PetTrackingMapHtml';

type Props = {
  route: TrackingPoint[];
  currentLocation: TrackingPoint | null;
};

type SerializablePoint = {
  latitude: number;
  longitude: number;
};

function isValidPoint(
  point: TrackingPoint | null | undefined,
): point is TrackingPoint {
  return Boolean(
    point &&
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude),
  );
}

function toSerializablePoint(point: TrackingPoint): SerializablePoint {
  return {
    latitude: point.latitude,
    longitude: point.longitude,
  };
}

export function PetTrackingMap({route, currentLocation}: Props) {
  const webViewRef = useRef<WebView | null>(null);
  const didLoadRef = useRef(false);

  const payload = useMemo<PetTrackingMapPayload>(() => {
    return {
      route: route.filter(isValidPoint).map(toSerializablePoint),
      currentLocation: isValidPoint(currentLocation)
        ? toSerializablePoint(currentLocation)
        : null,
    };
  }, [route, currentLocation]);

  const initialHtml = useMemo(() => {
    return buildPetTrackingMapHtml({
      route: [],
      currentLocation: null,
    });
  }, []);

  const pushPayloadToMap = useCallback(() => {
    if (!didLoadRef.current || !webViewRef.current) {
      return;
    }

    const script = `
      window.__updatePetTracking && window.__updatePetTracking(${JSON.stringify(payload)});
      true;
    `;

    webViewRef.current.injectJavaScript(script);
  }, [payload]);

  useEffect(() => {
    pushPayloadToMap();
  }, [pushPayloadToMap]);

  const handleLoadEnd = useCallback(() => {
    didLoadRef.current = true;
    pushPayloadToMap();
  }, [pushPayloadToMap]);

  const hasLocation = Boolean(payload.currentLocation);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{html: initialHtml, baseUrl: 'https://openfreemap.org/'}}
        style={styles.map}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        setSupportMultipleWindows={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

      {!hasLocation ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Esperando GPS...</Text>
          <Text style={styles.emptyText}>
            Cuando llegue la ubicación, el mapa inclinado seguirá la posición de la mascota.
          </Text>
        </View>
      ) : null}
    </View>
  );
}