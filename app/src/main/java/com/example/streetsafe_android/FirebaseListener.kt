package com.example.streetsafe_android

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.database.*

class FirebaseListenerService : Service() {

    private lateinit var database: DatabaseReference
    private lateinit var notificationHelper: NotificationHelper

    private val CHANNEL_ID = "foreground_service_channel"

    override fun onCreate() {
        super.onCreate()
        notificationHelper = NotificationHelper(this)

        // Create notification channel for the foreground service
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Foreground Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        // Start the service in the foreground with a persistent notification
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("StreetSafe Listener")
            .setContentText("Listening for hazard notifications...")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()

        startForeground(1, notification)

        // Attach Firebase listener
        startFirebaseListener()
    }

    private fun startFirebaseListener() {
        database = FirebaseDatabase.getInstance().getReference("notifications")

        database.addChildEventListener(object : ChildEventListener {
            override fun onChildAdded(snapshot: DataSnapshot, previousChildName: String?) {
                val title = snapshot.child("title").getValue(String::class.java)
                val message = snapshot.child("message").getValue(String::class.java)

                Log.d("FirebaseService", "title: $title, message: $message")

                if (!title.isNullOrEmpty() && !message.isNullOrEmpty()) {
                    notificationHelper.showNotification(title, message)
                }
            }

            override fun onChildChanged(snapshot: DataSnapshot, previousChildName: String?) {}
            override fun onChildRemoved(snapshot: DataSnapshot) {}
            override fun onChildMoved(snapshot: DataSnapshot, previousChildName: String?) {}
            override fun onCancelled(error: DatabaseError) {
                Log.e("FirebaseService", "Listener failed: ${error.message}")
            }
        })
    }

    override fun onBind(intent: Intent?): IBinder? {
        // No binding needed
        return null
    }
}
