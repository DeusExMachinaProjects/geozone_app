package com.geozone.tracking

import android.content.Intent
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = TrackingForegroundModule.NAME)
class TrackingForegroundModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "TrackingForeground"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun startTracking(activityType: String, promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, LocationForegroundService::class.java).apply {
                action = LocationForegroundService.ACTION_START
                putExtra(LocationForegroundService.EXTRA_ACTIVITY_TYPE, activityType)
            }

            ContextCompat.startForegroundService(reactApplicationContext, intent)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("START_TRACKING_ERROR", error)
        }
    }

    @ReactMethod
    fun pauseTracking(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, LocationForegroundService::class.java).apply {
                action = LocationForegroundService.ACTION_PAUSE
            }

            reactApplicationContext.startService(intent)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("PAUSE_TRACKING_ERROR", error)
        }
    }

    @ReactMethod
    fun resumeTracking(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, LocationForegroundService::class.java).apply {
                action = LocationForegroundService.ACTION_RESUME
            }

            reactApplicationContext.startService(intent)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("RESUME_TRACKING_ERROR", error)
        }
    }

    @ReactMethod
    fun stopTracking(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, LocationForegroundService::class.java).apply {
                action = LocationForegroundService.ACTION_STOP
            }

            reactApplicationContext.startService(intent)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("STOP_TRACKING_ERROR", error)
        }
    }

    @ReactMethod
    fun getTrackingSnapshot(promise: Promise) {
        try {
            promise.resolve(TrackingSessionStore.toWritableMap(reactApplicationContext))
        } catch (error: Exception) {
            promise.reject("TRACKING_SNAPSHOT_ERROR", error)
        }
    }

    @ReactMethod
    fun openLocationSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("OPEN_LOCATION_SETTINGS_ERROR", error)
        }
    }
}