import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

import {buildTrackingMapHtml, type TrackingMapPayload} from './TrackingMapHtml';

type TrackingMapPoint = {
  latitude: number;
  longitude: number;
};

type TrackingMapProps = {
  route: TrackingMapPoint[];
  currentLocation: TrackingMapPoint | null;
  activityType?: 'run' | 'ride' | 'pet';
};

export function TrackingMap({
  route,
  currentLocation,
  activityType = 'run',
}: TrackingMapProps) {
  const webViewRef = useRef<WebView>(null);

  const initialPayload = useMemo<TrackingMapPayload>(
    () => ({
      route: [],
      currentLocation: null,
      activityType,
    }),
    [activityType],
  );

  const livePayload = useMemo<TrackingMapPayload>(
    () => ({
      route,
      currentLocation,
      activityType,
    }),
    [activityType, currentLocation, route],
  );

  const html = useMemo(
    () => buildTrackingMapHtml(initialPayload),
    [initialPayload],
  );

  const serializedPayload = useMemo(
    () => JSON.stringify(livePayload).replace(/</g, '\\u003c'),
    [livePayload],
  );

  const injectPayload = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      if (window.__updateTracking) {
        window.__updateTracking(${serializedPayload});
      }
      true;
    `);
  }, [serializedPayload]);

  useEffect(() => {
    injectPayload();
  }, [injectPayload]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          html,
          baseUrl: 'https://tiles.openfreemap.org/',
        }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        onLoadEnd={injectPayload}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#050505',
  },
  webview: {
    flex: 1,
    backgroundColor: '#050505',
  },
});