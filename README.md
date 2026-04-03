# GeoZone

Aplicación móvil desarrollada en **React Native** enfocada en entrenamiento, running y ciclismo con mecánicas de territorio, comunidad y misiones.

## Descripción

**GeoZone** es una aplicación que transforma recorridos de running o ciclismo en zonas conquistadas dentro del mapa. La propuesta combina actividad física, geolocalización, misiones y componentes sociales para generar una experiencia más competitiva, inmersiva y orientada a la comunidad.

### Propuesta de valor

> **No solo entrena, conquista.**  
> GeoZone transforma tu ruta de running o ciclismo en territorio dominado. Captura metros cuadrados reales, crea tu comunidad y defiende tu zona.

---

## Características principales

- Pantalla de inicio (Splash)
- Onboarding de bienvenida
- Autenticación de usuario
- Navegación principal con tabs
- Home con acciones rápidas
- Pantalla de correr
- Pantalla de ciclismo
- Pantalla de misiones
- Pantalla de perfil
- Integración con mapa
- Integración GPS / geolocalización
- Sistema visual de progreso y estadísticas
- Compilación Android en modo debug y release

---

## Stack tecnológico

- **React Native** `0.84.1`
- **React** `19.2.3`
- **TypeScript**
- **React Navigation**
- **Native Stack Navigation**
- **Bottom Tabs**
- **React Native Safe Area Context**
- **React Native Screens**
- **React Native Gesture Handler**
- **React Native Vector Icons**
- **MapLibre React Native**
- **Geolocalización / GPS**
- **Gradle / Android Studio**
- **Node.js / npm**

---

## Requisitos previos

Antes de levantar el proyecto, debes tener instalado:

### General
- [Node.js](https://nodejs.org/)
- npm
- Git

### Android
- Android Studio
- Android SDK
- Android SDK Build-Tools
- Android Emulator o dispositivo físico
- Java JDK 17
- Variables de entorno de Android correctamente configuradas (`ANDROID_HOME` / SDK)

### iOS
> La compilación para iOS requiere **macOS** y **Xcode**.

### Validaciones recomendadas
```bash
node -v
npm -v
adb devices
```

> Este proyecto requiere **Node.js 22.11.0 o superior**.

---

## Instalación del proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/geozone.git
cd geozone
```

### 2. Instalar dependencias
```bash
npm install
```

> Este comando instala automáticamente todas las dependencias y dependencias de desarrollo definidas en el proyecto.

---

## Dependencias principales utilizadas

Estas son las dependencias principales del proyecto:

### Navegación
```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens
npm install react-native-safe-area-context
npm install react-native-gesture-handler
```

### Íconos
```bash
npm install react-native-vector-icons
```

### Mapa
```bash
npm install @maplibre/maplibre-react-native
```

### Geolocalización / GPS
```bash
npm install @react-native-community/geolocation
```

### Núcleo de React Native
```bash
npm install react react-native
```

### Dependencia adicional incluida en el proyecto
```bash
npm install @react-native/new-app-screen
```

> Si vas a clonar el proyecto desde el repositorio, normalmente no necesitas ejecutar estos comandos uno por uno.  
> Con `npm install` es suficiente, ya que todas estas dependencias están declaradas en `package.json`.

---

## Dependencias de desarrollo

```bash
npm install -D @babel/core @babel/preset-env @babel/runtime
npm install -D @react-native-community/cli @react-native-community/cli-platform-android @react-native-community/cli-platform-ios
npm install -D @react-native/babel-preset @react-native/eslint-config @react-native/metro-config @react-native/typescript-config
npm install -D @types/jest @types/react @types/react-test-renderer
npm install -D eslint jest prettier react-test-renderer typescript
```

---

## Scripts disponibles

El proyecto incluye los siguientes scripts:

```bash
npm run android
npm run ios
npm run start
npm run lint
npm run test
```

### Descripción de scripts

- `npm run android`: ejecuta la aplicación en Android
- `npm run ios`: ejecuta la aplicación en iOS
- `npm run start`: inicia Metro Bundler
- `npm run lint`: ejecuta ESLint
- `npm run test`: ejecuta pruebas con Jest

---

## Ejecución local del proyecto

### 1. Iniciar Metro
```bash
npm run start
```

### 2. Ejecutar la aplicación en Android
En una segunda terminal:

```bash
npm run android
```

### 3. Ejecutar la aplicación en iOS
> Disponible solo en macOS con Xcode instalado.

```bash
npm run ios
```

---

## Ejecución local con limpieza de caché

Si aparece un problema de caché o conflicto con Metro, puedes iniciar el proyecto con caché limpia:

```bash
npx react-native start --reset-cache
```

Y luego, en otra terminal:

```bash
npm run android
```

---

## Ejecución en puerto alternativo

Si el puerto `8081` está ocupado, puedes levantar Metro en otro puerto, por ejemplo `8082`.

### Iniciar Metro en puerto 8082
```bash
npx react-native start --reset-cache --port 8082
```

### Ejecutar Android usando el mismo puerto
```bash
npx react-native run-android --port 8082
```

---

## Compilación APK para pruebas

Para generar una APK release de prueba en Android:

```bash
cd android
.\gradlew assembleRelease
```

La APK generada quedará normalmente en una ruta similar a esta:

```text
android/app/build/outputs/apk/release/app-release.apk
```

---

## Limpieza del proyecto

Cuando sea necesario corregir errores de compilación, caché o dependencias, puedes usar los siguientes comandos.

### Limpiar Gradle
```bash
cd android
.\gradlew clean
cd ..
```

### Eliminar `node_modules` en PowerShell
```powershell
Remove-Item -Recurse -Force node_modules
```

### Eliminar carpeta de compilación nativa `.cxx`
```powershell
Remove-Item -Recurse -Force android\app\.cxx
```

### Reinstalar dependencias
```bash
npm install
```

---

## Comandos útiles de diagnóstico

### Verificar dispositivos Android conectados
```bash
adb devices
```

### Reiniciar Metro con caché limpia
```bash
npx react-native start --reset-cache
```

### Validar la configuración del entorno React Native
```bash
npx react-native doctor
```

---

## Flujo recomendado para levantar el proyecto

### 1. Clonar repositorio
```bash
git clone https://github.com/DeusExMachinaProjects/geozone_app.git
cd geozone
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar Metro
```bash
npm run start
```

### 4. Ejecutar Android
En otra terminal:

```bash
npm run android
```

---

## Flujo recomendado para generar APK

```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
```

---

## Problemas comunes y soluciones

### 1. Error por caché de Metro
```bash
npx react-native start --reset-cache
```

### 2. Error por compilaciones anteriores de Android
```bash
cd android
.\gradlew clean
cd ..
```

### 3. `node_modules` corrupto o inconsistente
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### 4. Error con la carpeta `.cxx`
```powershell
Remove-Item -Recurse -Force android\app\.cxx
```

### 5. `gradlew` no se reconoce en PowerShell
En Windows PowerShell debes ejecutarlo con `.\`

```powershell
.\gradlew clean
.\gradlew assembleRelease
```

### 6. Metro ocupado en el puerto `8081`
Puedes iniciar Metro en otro puerto:

```bash
npx react-native start --reset-cache --port 8082
npx react-native run-android --port 8082
```

### 7. Error al instalar APK release
Verifica que:
- la APK corresponda a la arquitectura compatible con tu dispositivo
- no exista una versión anterior con firma distinta instalada
- el dispositivo permita instalar aplicaciones manualmente

---

## Estado del proyecto

Proyecto en desarrollo activo.

Actualmente incluye:

- Estructura base de navegación
- Pantallas principales
- Estilo visual corporativo
- Integración inicial de mapa y GPS
- Compilación Android funcional

---

## Buenas prácticas del repositorio

Se recomienda trabajar con ramas por funcionalidad:

```bash
git checkout -b feature/nombre-funcionalidad
```

Ejemplos de commits descriptivos:

```bash
git add .
git commit -m "feat: integra navegación principal y tabs"
git commit -m "feat: agrega integración inicial de mapa y geolocalización"
git commit -m "fix: corrige compilación release en Android"
git commit -m "style: mejora layout de HomeScreen"
```

---

## Roadmap

- autenticación persistente
- captura de rutas reales por GPS
- cálculo de territorio dominado
- sistema de misiones dinámicas
- ranking de usuarios
- integración social
- backend y sincronización de recorridos
- notificaciones y eventos

---

## Licencia

Este proyecto es privado y no puede licenciarse
