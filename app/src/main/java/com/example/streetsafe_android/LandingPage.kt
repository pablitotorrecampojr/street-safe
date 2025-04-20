package com.example.streetsafe_android

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class LandingPage : AppCompatActivity() {

    private val CAMERA_PERMISSION_REQUEST = 100

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.landingpage_activity)

        checkAndRequestPermissions()
    }

    private fun checkAndRequestPermissions() {
        if (!isCameraPermissionGranted()) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.CAMERA),
                CAMERA_PERMISSION_REQUEST
            )
        } else {
            checkLocationStatus()
        }
    }

    // Check location with a prompt before redirecting
    private fun checkLocationStatus() {
        if (!isLocationEnabled()) {
            AlertDialog.Builder(this)
                .setTitle("Enable Location")
                .setMessage("Your location is turned off. Do you want to open settings to enable it?")
                .setPositiveButton("Yes") { dialog, _ ->
                    startActivity(Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))
                    dialog.dismiss()
                }
                .setNegativeButton("No") { dialog, _ ->
                    dialog.dismiss()
                }
                .show()
        } else {
            checkAndProceed()
        }
    }

    // Redirect if all conditions are met
    private fun checkAndProceed() {
        if (isInternetConnected() && isCameraPermissionGranted() && isLocationEnabled()) {
            Toast.makeText(this, "All set! Redirecting shortly...", Toast.LENGTH_SHORT).show()
            android.os.Handler(mainLooper).postDelayed({
                val intent = Intent(this, SignInActivity::class.java)
                startActivity(intent)
                finish()
            }, 10000)
        } else {
            if (!isInternetConnected()) {
                Toast.makeText(this, "Internet connection is required.", Toast.LENGTH_SHORT).show()
            }
            if (!isCameraPermissionGranted()) {
                Toast.makeText(this, "Camera permission is required.", Toast.LENGTH_SHORT).show()
            }
            if (!isLocationEnabled()) {
                Toast.makeText(this, "Location must be enabled.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    // Handle permission result for camera
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                checkLocationStatus()
            } else {
                Toast.makeText(this, "Camera permission denied.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    // Check helpers
    private fun isInternetConnected(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val capabilities = connectivityManager.getNetworkCapabilities(connectivityManager.activeNetwork)
        return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun isCameraPermissionGranted(): Boolean {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED
    }

    private fun isLocationEnabled(): Boolean {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    }
}
