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

class LocationForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "geozone_tracking_channel"
        const val NOTIFICATION_ID = 1001

        const val ACTION_START = "com.geozone.tracking.START"
        const val ACTION_PAUSE = "com.geozone.tracking.PAUSE"
        const val ACTION_RESUME = "com.geozone.tracking.RESUME"
        const val ACTION_STOP = "com.geozone.tracking.STOP"

        const val EXTRA_ACTIVITY_TYPE = "activity_type"
    }

    private lateinit var notificationManager: NotificationManager
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationCallback: LocationCallback? = null

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

                requestLocationUpdatesIfPossible()
            }

            ACTION_PAUSE -> {
                TrackingSessionStore.pause(this)
                removeLocationUpdates()
                updateNotification()
            }

            ACTION_RESUME -> {
                TrackingSessionStore.resume(this)
                updateNotification()
                requestLocationUpdatesIfPossible()
            }

            ACTION_STOP -> {
                removeLocationUpdates()
                TrackingSessionStore.stop(this)
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }

            else -> {
                if (!promoteToForegroundSafely()) {
                    stopSelf()
                    return START_NOT_STICKY
                }

                requestLocationUpdatesIfPossible()
            }
        }

        return START_STICKY
    }

    override fun onDestroy() {
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

    private fun updateNotification() {
        notificationManager.notify(NOTIFICATION_ID, buildNotification())
    }

    private fun buildNotification() =
        NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(buildNotificationTitle())
            .setContentText(buildNotificationText())
            .setSmallIcon(R.mipmap.ic_launcher)
            .setColor(Color.parseColor("#FF6B52"))
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setContentIntent(buildContentIntent())
            .setShowWhen(!TrackingSessionStore.isPaused(this))
            .setUsesChronometer(!TrackingSessionStore.isPaused(this))
            .setWhen(System.currentTimeMillis() - TrackingSessionStore.getElapsedMs(this))
            .build()

    private fun buildNotificationTitle(): String {
        val activityType = TrackingSessionStore.getActivityType(this)
        val isPaused = TrackingSessionStore.isPaused(this)

        return when {
            isPaused && activityType == "ride" -> "GeoZone · Pedaleo pausado"
            isPaused -> "GeoZone · Carrera pausada"
            activityType == "ride" -> "GeoZone · Pedaleo en curso"
            else -> "GeoZone · Carrera en curso"
        }
    }

    private fun buildNotificationText(): String {
        val snapshot = TrackingSessionStore.toWritableMap(this)
        val errorCode = snapshot.getString("errorCode")

        return when (errorCode) {
            "gps_disabled" -> "Sin GPS. Activa la ubicación para continuar."
            "permission_denied" -> "Permiso de ubicación requerido."
            "location_unavailable" -> "Buscando ubicación..."
            else -> {
                val distanceKm = TrackingSessionStore.getDistanceMeters(this) / 1000f
                "Distancia ${"%.2f".format(distanceKm)} km"
            }
        }
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

        return PendingIntent.getActivity(this, 0, openAppIntent, pendingFlags)
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