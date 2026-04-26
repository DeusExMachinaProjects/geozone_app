import React, {useMemo, useRef} from 'react';
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

  const payload = useMemo<TrackingMapPayload>(
    () => ({
      route,
      currentLocation,
      activityType,
    }),
    [activityType, currentLocation, route],
  );

  const html = useMemo(() => buildTrackingMapHtml(payload), [payload]);

  const injectedJavaScript = useMemo(() => {
    const serialized = JSON.stringify(payload);
    return `
      if (window.__updateTracking) {
        window.__updateTracking(${serialized});
      }
      true;
    `;
  }, [payload]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{html}}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled={false}
        injectedJavaScript={injectedJavaScript}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        nestedScrollEnabled={false}
        overScrollMode="never"
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
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