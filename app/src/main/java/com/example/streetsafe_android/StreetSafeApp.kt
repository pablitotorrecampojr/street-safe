package com.example.streetsafe_android

import android.app.Application
import com.google.firebase.FirebaseApp

class StreetSafeApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}