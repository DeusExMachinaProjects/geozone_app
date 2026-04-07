package com.geozone.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build

object AppNotificationChannels {
    const val MISSIONS_CHANNEL_ID = "geozone_missions_channel"
    const val COMMUNITY_CHANNEL_ID = "geozone_community_channel"
    const val SYSTEM_CHANNEL_ID = "geozone_system_channel"
    const val PETS_CHANNEL_ID = "geozone_pets_channel"

    fun ensureChannels(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }

        val manager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val channels = listOf(
            NotificationChannel(
                MISSIONS_CHANNEL_ID,
                "Misiones y logros",
                NotificationManager.IMPORTANCE_DEFAULT,
            ).apply {
                description = "Misiones, hitos y recompensas de GeoZone."
            },
            NotificationChannel(
                COMMUNITY_CHANNEL_ID,
                "Comunidad",
                NotificationManager.IMPORTANCE_DEFAULT,
            ).apply {
                description = "Desafíos, amigos, avisos sociales y actividad comunitaria."
            },
            NotificationChannel(
                SYSTEM_CHANNEL_ID,
                "Sistema",
                NotificationManager.IMPORTANCE_DEFAULT,
            ).apply {
                description = "Avisos generales y mantenedores de la aplicación."
            },
            NotificationChannel(
                PETS_CHANNEL_ID,
                "Mascotas",
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = "Alertas y eventos relacionados con seguimiento de mascotas."
            },
        )

        manager.createNotificationChannels(channels)
    }

    fun resolveChannel(category: String?): String {
        return when (category?.lowercase()) {
            "missions" -> MISSIONS_CHANNEL_ID
            "community" -> COMMUNITY_CHANNEL_ID
            "pets" -> PETS_CHANNEL_ID
            else -> SYSTEM_CHANNEL_ID
        }
    }
}