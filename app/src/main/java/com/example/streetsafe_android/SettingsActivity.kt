package com.example.streetsafe_android

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.Manifest
import android.provider.Settings
import android.net.Uri


class SettingsActivity  : AppCompatActivity() {

    private lateinit var cameraSwitch: Switch
    private lateinit var locationSwitch: Switch
    private lateinit var fileSwitch: Switch
    private lateinit var notifSwitch: Switch

    private val CAMERA_REQUEST = 100
    private val LOCATION_REQUEST = 101
    private val FILE_REQUEST = 102
    private val NOTIF_REQUEST = 103

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setting_activity)

        //TODO: handle going back to profile page
        val backButton = findViewById<ImageButton>(R.id.buttonBack)
        backButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.putExtra("FRAGMENT_TO_LOAD", "ProfileFragment")
            startActivity(intent)
        }

        //TODO: init switches
        cameraSwitch = findViewById(R.id.allowCameraSwith)
        locationSwitch = findViewById(R.id.allowLocationSwitch)
        fileSwitch = findViewById(R.id.allowFileSwitch)
        notifSwitch = findViewById(R.id.switch1)

        initSwitchStates()
        setupSwitchListeners()
    }

    private fun initSwitchStates() {
        cameraSwitch.isChecked = ContextCompat.checkSelfPermission(
            this, Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED

        locationSwitch.isChecked = ContextCompat.checkSelfPermission(
            this, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        fileSwitch.isChecked = ContextCompat.checkSelfPermission(
            this, Manifest.permission.READ_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED

        notifSwitch.isChecked = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                this, Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true // notifications auto-allowed before Android 13
        }
    }

    private fun setupSwitchListeners() {
        cameraSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                requestPermission(Manifest.permission.CAMERA, CAMERA_REQUEST)
            } else {
                resetSwitch(cameraSwitch)
            }
        }

        locationSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                requestPermission(Manifest.permission.ACCESS_FINE_LOCATION, LOCATION_REQUEST)
            } else {
                resetSwitch(locationSwitch)
            }
        }

        fileSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                requestPermission(Manifest.permission.READ_EXTERNAL_STORAGE, FILE_REQUEST)
            } else {
                resetSwitch(fileSwitch)
            }
        }

        notifSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    requestPermission(Manifest.permission.POST_NOTIFICATIONS, NOTIF_REQUEST)
                }
            } else {
                resetSwitch(notifSwitch)
            }
        }
    }

    private fun requestPermission(permission: String, requestCode: Int) {
        if (ContextCompat.checkSelfPermission(this, permission)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(this, arrayOf(permission), requestCode)
        }
    }

    private fun resetSwitch(switch: Switch) {
        // cannot revoke programmatically -> guide user
        switch.isChecked = true
        Toast.makeText(
            this,
            "Please disable this permission in App Settings.",
            Toast.LENGTH_SHORT
        ).show()
        openAppSettings()
    }

    private fun openAppSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.fromParts("package", packageName, null)
        }
        startActivity(intent)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (grantResults.isEmpty()) return

        when (requestCode) {
            CAMERA_REQUEST -> cameraSwitch.isChecked =
                grantResults[0] == PackageManager.PERMISSION_GRANTED

            LOCATION_REQUEST -> locationSwitch.isChecked =
                grantResults[0] == PackageManager.PERMISSION_GRANTED

            FILE_REQUEST -> fileSwitch.isChecked =
                grantResults[0] == PackageManager.PERMISSION_GRANTED

            NOTIF_REQUEST -> notifSwitch.isChecked =
                grantResults[0] == PackageManager.PERMISSION_GRANTED
        }
    }
}