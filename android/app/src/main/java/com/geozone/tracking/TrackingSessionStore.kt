package com.geozone.tracking

import android.content.Context
import android.location.Location
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.max

object TrackingSessionStore {
    private const val PREFS_NAME = "geozone_tracking_prefs"

    private const val KEY_IS_ACTIVE = "is_active"
    private const val KEY_IS_PAUSED = "is_paused"
    private const val KEY_IS_FINISHED = "is_finished"
    private const val KEY_ACTIVITY_TYPE = "activity_type"
    private const val KEY_START_TIME_MS = "start_time_ms"
    private const val KEY_ACCUMULATED_PAUSE_MS = "accumulated_pause_ms"
    private const val KEY_PAUSE_STARTED_AT_MS = "pause_started_at_ms"
    private const val KEY_DISTANCE_METERS = "distance_meters"
    private const val KEY_SPEED_MPS = "speed_mps"
    private const val KEY_HAS_LOCATION = "has_location"
    private const val KEY_ERROR_CODE = "error_code"
    private const val KEY_LATITUDE = "latitude"
    private const val KEY_LONGITUDE = "longitude"
    private const val KEY_TIMESTAMP = "timestamp"
    private const val KEY_ROUTE_JSON = "route_json"

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun isActive(context: Context): Boolean =
        prefs(context).getBoolean(KEY_IS_ACTIVE, false)

    fun isPaused(context: Context): Boolean =
        prefs(context).getBoolean(KEY_IS_PAUSED, false)

    fun getActivityType(context: Context): String =
        prefs(context).getString(KEY_ACTIVITY_TYPE, "run") ?: "run"

    fun getMinDistanceMeters(context: Context): Float {
        return if (getActivityType(context) == "ride") 1.5f else 0.5f
    }

    fun initializeSessionIfNeeded(context: Context, activityType: String) {
        if (isActive(context)) {
            return
        }

        val now = System.currentTimeMillis()

        prefs(context).edit()
            .putBoolean(KEY_IS_ACTIVE, true)
            .putBoolean(KEY_IS_PAUSED, false)
            .putBoolean(KEY_IS_FINISHED, false)
            .putString(KEY_ACTIVITY_TYPE, activityType)
            .putLong(KEY_START_TIME_MS, now)
            .putLong(KEY_ACCUMULATED_PAUSE_MS, 0L)
            .putLong(KEY_PAUSE_STARTED_AT_MS, 0L)
            .putFloat(KEY_DISTANCE_METERS, 0f)
            .putFloat(KEY_SPEED_MPS, 0f)
            .putBoolean(KEY_HAS_LOCATION, false)
            .putString(KEY_ERROR_CODE, null)
            .remove(KEY_LATITUDE)
            .remove(KEY_LONGITUDE)
            .remove(KEY_TIMESTAMP)
            .putString(KEY_ROUTE_JSON, "[]")
            .apply()
    }

    fun pause(context: Context) {
        if (!isActive(context) || isPaused(context)) {
            return
        }

        prefs(context).edit()
            .putBoolean(KEY_IS_PAUSED, true)
            .putLong(KEY_PAUSE_STARTED_AT_MS, System.currentTimeMillis())
            .putFloat(KEY_SPEED_MPS, 0f)
            .apply()
    }

    fun resume(context: Context) {
        if (!isActive(context)) {
            return
        }

        val prefs = prefs(context)
        val pauseStartedAtMs = prefs.getLong(KEY_PAUSE_STARTED_AT_MS, 0L)
        val accumulatedPauseMs = prefs.getLong(KEY_ACCUMULATED_PAUSE_MS, 0L)
        val now = System.currentTimeMillis()

        val extraPause = if (pauseStartedAtMs > 0L) {
            max(0L, now - pauseStartedAtMs)
        } else {
            0L
        }

        prefs.edit()
            .putBoolean(KEY_IS_PAUSED, false)
            .putLong(KEY_ACCUMULATED_PAUSE_MS, accumulatedPauseMs + extraPause)
            .putLong(KEY_PAUSE_STARTED_AT_MS, 0L)
            .putFloat(KEY_SPEED_MPS, 0f)
            .apply()
    }

    fun stop(context: Context) {
        prefs(context).edit()
            .putBoolean(KEY_IS_ACTIVE, false)
            .putBoolean(KEY_IS_PAUSED, false)
            .putBoolean(KEY_IS_FINISHED, true)
            .putLong(KEY_PAUSE_STARTED_AT_MS, 0L)
            .putFloat(KEY_SPEED_MPS, 0f)
            .apply()
    }

    fun getElapsedMs(context: Context): Long {
        val prefs = prefs(context)
        val startTimeMs = prefs.getLong(KEY_START_TIME_MS, 0L)
        val accumulatedPauseMs = prefs.getLong(KEY_ACCUMULATED_PAUSE_MS, 0L)
        val pauseStartedAtMs = prefs.getLong(KEY_PAUSE_STARTED_AT_MS, 0L)

        if (startTimeMs <= 0L) {
            return 0L
        }

        val now = if (isPaused(context) && pauseStartedAtMs > 0L) {
            pauseStartedAtMs
        } else {
            System.currentTimeMillis()
        }

        return max(0L, now - startTimeMs - accumulatedPauseMs)
    }

    fun setErrorCode(context: Context, errorCode: String?) {
        prefs(context).edit()
            .putString(KEY_ERROR_CODE, errorCode)
            .apply()
    }

    fun markLocationUnavailable(context: Context, errorCode: String) {
        prefs(context).edit()
            .putBoolean(KEY_HAS_LOCATION, false)
            .putFloat(KEY_SPEED_MPS, 0f)
            .putString(KEY_ERROR_CODE, errorCode)
            .apply()
    }

    fun updateLocation(context: Context, location: Location) {
        val prefs = prefs(context)

        val currentTimestamp = if (location.time > 0L) {
            location.time
        } else {
            System.currentTimeMillis()
        }

        val previousLatitude = prefs.getString(KEY_LATITUDE, null)?.toDoubleOrNull()
        val previousLongitude = prefs.getString(KEY_LONGITUDE, null)?.toDoubleOrNull()
        val previousTimestamp = prefs.getLong(KEY_TIMESTAMP, 0L)

        var totalDistanceMeters = prefs.getFloat(KEY_DISTANCE_METERS, 0f)
        var currentSpeedMps =
            if (location.hasSpeed() && location.speed > 0f) location.speed else 0f

        var shouldAppendPoint = false

        if (previousLatitude != null && previousLongitude != null && previousTimestamp > 0L) {
            val results = FloatArray(1)
            Location.distanceBetween(
                previousLatitude,
                previousLongitude,
                location.latitude,
                location.longitude,
                results,
            )

            val segmentDistance = results[0]
            val minDistance = getMinDistanceMeters(context)

            if (currentSpeedMps <= 0f) {
                val deltaSeconds = (currentTimestamp - previousTimestamp) / 1000f
                if (deltaSeconds > 0f) {
                    currentSpeedMps = segmentDistance / deltaSeconds
                }
            }

            if (segmentDistance >= minDistance) {
                totalDistanceMeters += segmentDistance
                shouldAppendPoint = true
            }
        } else {
            shouldAppendPoint = true
        }

        val editor = prefs.edit()
            .putBoolean(KEY_HAS_LOCATION, true)
            .putString(KEY_ERROR_CODE, null)
            .putFloat(KEY_DISTANCE_METERS, totalDistanceMeters)
            .putFloat(KEY_SPEED_MPS, max(0f, currentSpeedMps))
            .putString(KEY_LATITUDE, location.latitude.toString())
            .putString(KEY_LONGITUDE, location.longitude.toString())
            .putLong(KEY_TIMESTAMP, currentTimestamp)

        if (shouldAppendPoint) {
            editor.putString(
                KEY_ROUTE_JSON,
                appendRoutePoint(
                    prefs.getString(KEY_ROUTE_JSON, "[]") ?: "[]",
                    location.latitude,
                    location.longitude,
                    currentTimestamp,
                    currentSpeedMps,
                ),
            )
        }

        editor.apply()
    }

    private fun appendRoutePoint(
        currentRouteJson: String,
        latitude: Double,
        longitude: Double,
        timestamp: Long,
        speedMps: Float,
    ): String {
        val routeArray = try {
            JSONArray(currentRouteJson)
        } catch (_: Exception) {
            JSONArray()
        }

        val point = JSONObject()
            .put("latitude", latitude)
            .put("longitude", longitude)
            .put("timestamp", timestamp)
            .put("speed", speedMps.toDouble())

        routeArray.put(point)
        return routeArray.toString()
    }

    fun toWritableMap(context: Context): WritableMap {
        val prefs = prefs(context)
        val map = Arguments.createMap()

        val hasLocation = prefs.getBoolean(KEY_HAS_LOCATION, false)
        val latitude = prefs.getString(KEY_LATITUDE, null)?.toDoubleOrNull()
        val longitude = prefs.getString(KEY_LONGITUDE, null)?.toDoubleOrNull()
        val timestamp = prefs.getLong(KEY_TIMESTAMP, 0L)

        map.putBoolean("isActive", prefs.getBoolean(KEY_IS_ACTIVE, false))
        map.putBoolean("isPaused", prefs.getBoolean(KEY_IS_PAUSED, false))
        map.putBoolean("isFinished", prefs.getBoolean(KEY_IS_FINISHED, false))
        map.putString("activityType", prefs.getString(KEY_ACTIVITY_TYPE, "run"))
        map.putDouble("elapsedMs", getElapsedMs(context).toDouble())
        map.putDouble("distanceMeters", prefs.getFloat(KEY_DISTANCE_METERS, 0f).toDouble())
        map.putDouble("speedMps", prefs.getFloat(KEY_SPEED_MPS, 0f).toDouble())
        map.putBoolean("hasLocation", hasLocation)
        map.putString("errorCode", prefs.getString(KEY_ERROR_CODE, null))

        if (hasLocation && latitude != null && longitude != null && timestamp > 0L) {
            val locationMap = Arguments.createMap()
            locationMap.putDouble("latitude", latitude)
            locationMap.putDouble("longitude", longitude)
            locationMap.putDouble("timestamp", timestamp.toDouble())
            locationMap.putDouble("speed", prefs.getFloat(KEY_SPEED_MPS, 0f).toDouble())
            map.putMap("location", locationMap)
        } else {
            map.putNull("location")
        }

        map.putArray(
            "route",
            routeToWritableArray(prefs.getString(KEY_ROUTE_JSON, "[]") ?: "[]"),
        )

        return map
    }

    private fun routeToWritableArray(routeJson: String): WritableArray {
        val routeArray = Arguments.createArray()
        val jsonArray = try {
            JSONArray(routeJson)
        } catch (_: Exception) {
            JSONArray()
        }

        for (index in 0 until jsonArray.length()) {
            val point = jsonArray.optJSONObject(index) ?: continue
            val pointMap = Arguments.createMap()
            pointMap.putDouble("latitude", point.optDouble("latitude"))
            pointMap.putDouble("longitude", point.optDouble("longitude"))
            pointMap.putDouble("timestamp", point.optLong("timestamp").toDouble())
            pointMap.putDouble("speed", point.optDouble("speed", 0.0))
            routeArray.pushMap(pointMap)
        }

        return routeArray
    }

    fun getDistanceMeters(context: Context): Float =
        prefs(context).getFloat(KEY_DISTANCE_METERS, 0f)
}