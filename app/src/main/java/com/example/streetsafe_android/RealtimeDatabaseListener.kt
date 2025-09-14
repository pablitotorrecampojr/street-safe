package com.example.streetsafe_android

import android.content.Context
import com.google.firebase.database.*
import android.util.Log

class RealtimeDatabaseListener(private val context: Context) {

    private val database = FirebaseDatabase.getInstance().getReference("notifications")
    private val notificationHelper = NotificationHelper(context)

    fun startListening() {
        database.addChildEventListener(object : ChildEventListener {
            override fun onChildAdded(snapshot: DataSnapshot, previousChildName: String?) {
                val title = snapshot.child("title").getValue(String::class.java)
                val message = snapshot.child("message").getValue(String::class.java)
                val userId = snapshot.child("userId").getValue(String::class.java)

                Log.d("FirebaseListener", "title: $title, message: $message, userId: $userId")

                if (!message.isNullOrEmpty() && !title.isNullOrEmpty()) {
                    notificationHelper.showNotification(title, message)
                }
            }

            override fun onChildChanged(snapshot: DataSnapshot, previousChildName: String?) {}
            override fun onChildRemoved(snapshot: DataSnapshot) {}
            override fun onChildMoved(snapshot: DataSnapshot, previousChildName: String?) {}
            override fun onCancelled(error: DatabaseError) {
                // Handle error
            }
        })
    }
}
