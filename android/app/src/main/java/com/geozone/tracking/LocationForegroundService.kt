package com.geozone.tracking

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.location.LocationManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import com.geozone.MainActivity
import com.geozone.R
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationAvailability
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import java.util.Locale
import kotlin.math.max

class LocationForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "geozone_tracking_channel"
        const val NOTIFICATION_ID = 1001

        const val ACTION_START = "com.geozone.tracking.START"
        const val ACTION_PAUSE = "com.geozone.tracking.PAUSE"
        const val ACTION_RESUME = "com.geozone.tracking.RESUME"
        const val ACTION_STOP = "com.geozone.tracking.STOP"

        const val EXTRA_ACTIVITY_TYPE = "activity_type"

        private const val REQUEST_CODE_OPEN_APP = 2000
        private const val REQUEST_CODE_PAUSE_RESUME = 2001
        private const val REQUEST_CODE_STOP = 2002
    }

    private lateinit var notificationManager: NotificationManager
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationCallback: LocationCallback? = null

    private val notificationRefreshHandler by lazy {
        Handler(Looper.getMainLooper())
    }

    private val notificationRefreshRunnable = object : Runnable {
        override fun run() {
            if (!TrackingSessionStore.isActive(this@LocationForegroundService)) {
                return
            }

            updateNotification()

            if (!TrackingSessionStore.isPaused(this@LocationForegroundService)) {
                notificationRefreshHandler.postDelayed(this, 1000L)
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        notificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                val activityType = intent.getStringExtra(EXTRA_ACTIVITY_TYPE) ?: "run"
                TrackingSessionStore.initializeSessionIfNeeded(this, activityType)

                if (!promoteToForegroundSafely()) {
                    stopSelf()
                    return START_NOT_STICKY
                }

                updateNotification()
                startNotificationRefreshTicker()
                requestLocationUpdatesIfPossible()
            }

            ACTION_PAUSE -> {
                TrackingSessionStore.pause(this)
                removeLocationUpdates()
                stopNotificationRefreshTicker()
                updateNotification()
            }

            ACTION_RESUME -> {
                TrackingSessionStore.resume(this)
                updateNotification()
                startNotificationRefreshTicker()
                requestLocationUpdatesIfPossible()
            }

            ACTION_STOP -> {
                stopNotificationRefreshTicker()
                removeLocationUpdates()
                TrackingSessionStore.stop(this)
                notificationManager.cancel(NOTIFICATION_ID)
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }

            else -> {
                if (!promoteToForegroundSafely()) {
                    stopSelf()
                    return START_NOT_STICKY
                }

                updateNotification()
                startNotificationRefreshTicker()
                requestLocationUpdatesIfPossible()
            }
        }

        return START_STICKY
    }

    override fun onDestroy() {
        stopNotificationRefreshTicker()
        removeLocationUpdates()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun promoteToForegroundSafely(): Boolean {
        if (!hasLocationPermission()) {
            TrackingSessionStore.markLocationUnavailable(this, "permission_denied")
            return false
        }

        return try {
            val notification = buildNotification()
            val foregroundType =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
                } else {
                    0
                }

            ServiceCompat.startForeground(
                this,
                NOTIFICATION_ID,
                notification,
                foregroundType,
            )
            true
        } catch (_: SecurityException) {
            TrackingSessionStore.markLocationUnavailable(this, "permission_denied")
            false
        }
    }

    private fun requestLocationUpdatesIfPossible() {
        if (!hasLocationPermission()) {
            TrackingSessionStore.markLocationUnavailable(this, "permission_denied")
            updateNotification()
            return
        }

        if (!isLocationEnabled()) {
            TrackingSessionStore.markLocationUnavailable(this, "gps_disabled")
            updateNotification()
            return
        }

        val request = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            1000L,
        )
            .setMinUpdateIntervalMillis(1000L)
            .setWaitForAccurateLocation(false)
            .setMinUpdateDistanceMeters(TrackingSessionStore.getMinDistanceMeters(this))
            .build()

        removeLocationUpdates()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                val location = result.lastLocation ?: return
                TrackingSessionStore.updateLocation(this@LocationForegroundService, location)
                updateNotification()
            }

            override fun onLocationAvailability(availability: LocationAvailability) {
                if (!availability.isLocationAvailable) {
                    TrackingSessionStore.markLocationUnavailable(
                        this@LocationForegroundService,
                        "location_unavailable",
                    )
                    updateNotification()
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                request,
                locationCallback as LocationCallback,
                Looper.getMainLooper(),
            )
        } catch (_: SecurityException) {
            TrackingSessionStore.markLocationUnavailable(this, "permission_denied")
            updateNotification()
        }
    }

    private fun removeLocationUpdates() {
        locationCallback?.let { callback ->
            fusedLocationClient.removeLocationUpdates(callback)
        }
        locationCallback = null
    }

    private fun hasLocationPermission(): Boolean {
        val fineGranted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION,
        ) == PackageManager.PERMISSION_GRANTED

        val coarseGranted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_COARSE_LOCATION,
        ) == PackageManager.PERMISSION_GRANTED

        return fineGranted || coarseGranted
    }

    private fun isLocationEnabled(): Boolean {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return try {
            locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                    locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
        } catch (_: Exception) {
            false
        }
    }

    private fun startNotificationRefreshTicker() {
        stopNotificationRefreshTicker()

        if (!TrackingSessionStore.isActive(this) || TrackingSessionStore.isPaused(this)) {
            return
        }

        notificationRefreshHandler.post(notificationRefreshRunnable)
    }

    private fun stopNotificationRefreshTicker() {
        notificationRefreshHandler.removeCallbacks(notificationRefreshRunnable)
    }

    private fun updateNotification() {
        notificationManager.notify(NOTIFICATION_ID, buildNotification())
    }

    private fun buildNotification() =
        NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(buildNotificationTitle())
            .setContentText(buildNotificationText())
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText(buildExpandedNotificationText()),
            )
            .setSmallIcon(R.mipmap.ic_launcher)
            .setColor(Color.parseColor("#FF6B52"))
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setContentIntent(buildContentIntent())
            .addAction(buildPauseResumeAction())
            .addAction(buildStopAction())
            .setShowWhen(!TrackingSessionStore.isPaused(this))
            .setUsesChronometer(!TrackingSessionStore.isPaused(this))
            .setWhen(System.currentTimeMillis() - TrackingSessionStore.getElapsedMs(this))
            .build()

    private fun buildNotificationTitle(): String {
        val activityType = TrackingSessionStore.getActivityType(this)
        val isPaused = TrackingSessionStore.isPaused(this)

        return when {
            isPaused && activityType == "pet" -> "GeoZone · Mascota pausada"
            isPaused && activityType == "ride" -> "GeoZone · Pedaleo pausado"
            isPaused -> "GeoZone · Carrera pausada"
            activityType == "pet" -> "GeoZone · Mascota en seguimiento"
            activityType == "ride" -> "GeoZone · Pedaleo en curso"
            else -> "GeoZone · Carrera en curso"
        }
    }

    private fun buildNotificationText(): String {
        val errorMessage = buildErrorMessage()
        val metricsText = buildMetricsInlineText()

        return if (errorMessage != null) {
            "$errorMessage · $metricsText"
        } else {
            metricsText
        }
    }

    private fun buildExpandedNotificationText(): String {
        val activityType = TrackingSessionStore.getActivityType(this)
        val isPaused = TrackingSessionStore.isPaused(this)

        val stateLabel = when {
            isPaused -> "Estado: pausado"
            activityType == "pet" -> "Estado: seguimiento activo"
            activityType == "ride" -> "Estado: pedaleo activo"
            else -> "Estado: carrera activa"
        }

        val elapsedText = formatElapsed(TrackingSessionStore.getElapsedMs(this))
        val distanceText = formatDistanceKm(TrackingSessionStore.getDistanceMeters(this) / 1000f)
        val speedText = formatSpeedKmh(getCurrentSpeedKmh())
        val errorMessage = buildErrorMessage()

        return buildString {
            appendLine(stateLabel)
            appendLine("Tiempo: $elapsedText")
            appendLine("Distancia: $distanceText km")
            append("Velocidad: $speedText km/h")

            if (!errorMessage.isNullOrBlank()) {
                appendLine()
                append(errorMessage)
            }
        }.trim()
    }

    private fun buildMetricsInlineText(): String {
        val elapsedText = formatElapsed(TrackingSessionStore.getElapsedMs(this))
        val distanceText = formatDistanceKm(TrackingSessionStore.getDistanceMeters(this) / 1000f)
        val speedText = formatSpeedKmh(getCurrentSpeedKmh())

        return "Tiempo $elapsedText · Distancia $distanceText km · Velocidad $speedText km/h"
    }

    private fun getCurrentSpeedKmh(): Double {
        val snapshot = TrackingSessionStore.toWritableMap(this)
        val speedMps = snapshot.getDouble("speedMps")
        return max(0.0, speedMps * 3.6)
    }

    private fun buildErrorMessage(): String? {
        val snapshot = TrackingSessionStore.toWritableMap(this)
        return when (snapshot.getString("errorCode")) {
            "gps_disabled" -> "Sin GPS. Activa la ubicación para continuar."
            "permission_denied" -> "Permiso de ubicación requerido."
            "location_unavailable" -> "Buscando ubicación..."
            else -> null
        }
    }

    private fun formatElapsed(elapsedMs: Long): String {
        val totalSeconds = max(0L, elapsedMs / 1000L)
        val hours = totalSeconds / 3600
        val minutes = (totalSeconds % 3600) / 60
        val seconds = totalSeconds % 60

        return String.format(
            Locale.getDefault(),
            "%02d:%02d:%02d",
            hours,
            minutes,
            seconds,
        )
    }

    private fun formatDistanceKm(distanceKm: Float): String =
        String.format(Locale.getDefault(), "%.2f", max(0f, distanceKm))

    private fun formatSpeedKmh(speedKmh: Double): String =
        String.format(Locale.getDefault(), "%.1f", max(0.0, speedKmh))

    private fun buildPauseResumeAction(): NotificationCompat.Action {
        val isPaused = TrackingSessionStore.isPaused(this)
        val action = if (isPaused) ACTION_RESUME else ACTION_PAUSE
        val title = if (isPaused) "Reanudar" else "Pausar"
        val iconRes = if (isPaused) {
            android.R.drawable.ic_media_play
        } else {
            android.R.drawable.ic_media_pause
        }

        return NotificationCompat.Action(
            iconRes,
            title,
            buildServicePendingIntent(action, REQUEST_CODE_PAUSE_RESUME),
        )
    }

    private fun buildStopAction(): NotificationCompat.Action {
        return NotificationCompat.Action(
            android.R.drawable.ic_menu_close_clear_cancel,
            "Finalizar",
            buildServicePendingIntent(ACTION_STOP, REQUEST_CODE_STOP),
        )
    }

    private fun buildServicePendingIntent(
        action: String,
        requestCode: Int,
    ): PendingIntent {
        val serviceIntent = Intent(this, LocationForegroundService::class.java).apply {
            this.action = action
        }

        val pendingFlags =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }

        return PendingIntent.getService(this, requestCode, serviceIntent, pendingFlags)
    }

    private fun buildContentIntent(): PendingIntent {
        val openAppIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingFlags =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }

        return PendingIntent.getActivity(
            this,
            REQUEST_CODE_OPEN_APP,
            openAppIntent,
            pendingFlags,
        )
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "GeoZone Tracking",
                NotificationManager.IMPORTANCE_LOW,
            )

            channel.description = "Canal de seguimiento de actividad en segundo plano"
            notificationManager.createNotificationChannel(channel)
        }
    }
}