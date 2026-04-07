package com.geozone.notifications

import android.app.PendingIntent
import android.content.Intent
import android.graphics.Color
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.*
import com.geozone.MainActivity
import com.geozone.R
import kotlin.math.roundToInt

class BusinessNotificationModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BusinessNotifications"

    @ReactMethod
    fun send(
        title: String,
        body: String,
        category: String?,
        notificationId: Double,
        promise: Promise,
    ) {
        try {
            val context = reactApplicationContext
            AppNotificationChannels.ensureChannels(context)

            val channelId = AppNotificationChannels.resolveChannel(category)
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }

            val pendingFlags =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }

            val pendingIntent =
                PendingIntent.getActivity(context, 0, intent, pendingFlags)

            val builder = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(NotificationCompat.BigTextStyle().bigText(body))
                .setAutoCancel(true)
                .setColor(Color.parseColor("#FF6B52"))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)

            NotificationManagerCompat.from(context)
                .notify(notificationId.roundToInt(), builder.build())

            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("BUSINESS_NOTIFICATION_ERROR", error.message, error)
        }
    }
}