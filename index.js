import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';

import App from './App';
import {name as appName} from './app.json';

/**
 * Handler obligatorio para eventos de Notifee en segundo plano.
 *
 * Aunque por ahora no usemos acciones directas desde la notificación,
 * Android puede emitir eventos al tocar o cerrar notificaciones.
 * Si no existe este handler, aparece:
 *
 * No task registered for key app.notifee.notification-event
 */
notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.PRESS:
      return;

    case EventType.ACTION_PRESS:
      return;

    case EventType.DISMISSED:
      return;

    default:
      return;
  }
});

AppRegistry.registerComponent(appName, () => App);