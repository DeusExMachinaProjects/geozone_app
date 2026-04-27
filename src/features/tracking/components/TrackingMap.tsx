import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

import {
  buildTrackingMapHtml,
  type TrackingMapPayload,
  type TrackingMapPoint,
} from './TrackingMapHtml';

type TrackingMapProps = {
  route: TrackingMapPoint[];
  currentLocation: TrackingMapPoint | null;
  activityType?: 'run' | 'ride' | 'pet';
};

function buildInjectedUpdate(payload: TrackingMapPayload) {
  const serializedPayload = JSON.stringify(payload)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return `
    if (window.__updateTracking) {
      window.__updateTracking(${serializedPayload});
    }
    true;
  `;
}

export function TrackingMap({
  route,
  currentLocation,
  activityType = 'run',
}: TrackingMapProps) {
  const webViewRef = useRef<WebView>(null);
  const latestPayloadRef = useRef<TrackingMapPayload>({
    activityType,
    route,
    currentLocation,
  });

  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const initialHtmlRef = useRef<string | null>(null);

  const payload = useMemo<TrackingMapPayload>(
    () => ({
      activityType,
      route: Array.isArray(route) ? route : [],
      currentLocation,
    }),
    [activityType, currentLocation, route],
  );

  latestPayloadRef.current = payload;

  if (!initialHtmlRef.current) {
    initialHtmlRef.current = buildTrackingMapHtml(payload);
  }

  const injectPayload = useCallback((nextPayload: TrackingMapPayload) => {
    webViewRef.current?.injectJavaScript(buildInjectedUpdate(nextPayload));
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsWebViewReady(true);
    injectPayload(latestPayloadRef.current);
  }, [injectPayload]);

  useEffect(() => {
    if (!isWebViewReady) {
      return;
    }

    injectPayload(payload);
  }, [injectPayload, isWebViewReady, payload]);

  return (
    <View style={styles.container}>
      <WebView
        key={activityType}
        ref={webViewRef}
        source={{html: initialHtmlRef.current}}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        setSupportMultipleWindows={false}
        mixedContentMode="always"
        androidLayerType="hardware"
        overScrollMode="never"
        onLoadEnd={handleLoadEnd}
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
    backgroundColor: '#ebe9e1',
  },
});