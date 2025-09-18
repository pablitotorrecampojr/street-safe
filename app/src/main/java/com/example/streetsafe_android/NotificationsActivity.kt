package com.example.streetsafe_android

import android.os.Bundle
import android.util.Log
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.database.*
import java.text.DateFormat
import java.util.Date

class NotificationsActivity : AppCompatActivity() {
    private lateinit var database: DatabaseReference
    private lateinit var container: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?)  {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notifications)

        container = findViewById(R.id.notificationsContainer)
        database = FirebaseDatabase.getInstance().getReference("hazardUpdates")

        loadNotifications()
    }

    private fun loadNotifications() {
        database.orderByChild("timestamp").limitToLast(20) // newest 20
            .addListenerForSingleValueEvent(object : ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    container.removeAllViews() // clear old
                    val notifications = snapshot.children.reversed() // latest first

                    for (child in notifications) {
                        val title = child.child("title").getValue(String::class.java) ?: ""
                        val message = child.child("message").getValue(String::class.java) ?: ""
                        val time = child.child("timestamp").getValue(Long::class.java) ?: 0L

                        addNotificationView(title, message, time)
                    }
                }

                override fun onCancelled(error: DatabaseError) {
                    Log.e("Notifications", "Error: ${error.message}")
                }
            })
    }

    private fun addNotificationView(title: String, message: String, timestamp: Long) {
        val notifView = layoutInflater.inflate(R.layout.items_notifications, container, false)

        notifView.findViewById<TextView>(R.id.notificationTitle).text = title
        notifView.findViewById<TextView>(R.id.notificationMessage).text = message
        notifView.findViewById<TextView>(R.id.notificationTime).text =
            DateFormat.getDateTimeInstance().format(Date(timestamp))

        container.addView(notifView, 0) // add at top for newest first
    }
 }