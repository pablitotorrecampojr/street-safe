package com.example.streetsafe_android

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.ImageButton
import android.widget.Switch
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.app.NotificationManagerCompat

class SettingsActivity : AppCompatActivity() {

    private lateinit var cameraSwitch: Switch
    private lateinit var locationSwitch: Switch
    private lateinit var fileSwitch: Switch
    private lateinit var notifSwitch: Switch

    // prevent infinite loop when programmatically changing switch states
    private var suppressListener = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setting_activity)

        // Back button to profile page
        val backButton = findViewById<ImageButton>(R.id.buttonBack)
        backButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.putExtra("FRAGMENT_TO_LOAD", "ProfileFragment")
            startActivity(intent)
            finish()
        }

        // Find switches
        cameraSwitch = findViewById(R.id.allowCameraSwith)
        locationSwitch = findViewById(R.id.allowLocationSwitch)
        fileSwitch = findViewById(R.id.allowFileSwitch)
        notifSwitch = findViewById(R.id.switch1)

        initSwitchStates()
        setupSwitchListeners()
    }

    override fun onResume() {
        super.onResume()
        // refresh switch states after coming back from settings
        initSwitchStates()
    }

    /**
     * Initialize switch states based on current permissions
     */
    private fun initSwitchStates() {
        suppressListener = true

        cameraSwitch.isChecked = hasPermission(Manifest.permission.CAMERA)
        locationSwitch.isChecked = hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)
        fileSwitch.isChecked = hasPermission(Manifest.permission.READ_EXTERNAL_STORAGE)

        notifSwitch.isChecked = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            hasPermission(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            NotificationManagerCompat.from(this).areNotificationsEnabled()
        }

        suppressListener = false
    }

    /**
     * Setup listeners for user interaction
     */
    private fun setupSwitchListeners() {
        cameraSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (suppressListener) return@setOnCheckedChangeListener
            if (isChecked) requestPermission(Manifest.permission.CAMERA, 100)
            else openAppSettings()
        }

        locationSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (suppressListener) return@setOnCheckedChangeListener
            if (isChecked) requestPermission(Manifest.permission.ACCESS_FINE_LOCATION, 101)
            else openAppSettings()
        }

        fileSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (suppressListener) return@setOnCheckedChangeListener
            if (isChecked) requestPermission(Manifest.permission.READ_EXTERNAL_STORAGE, 102)
            else openAppSettings()
        }

        notifSwitch.setOnCheckedChangeListener { _, isChecked ->
            if (suppressListener) return@setOnCheckedChangeListener
            if (isChecked && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                requestPermission(Manifest.permission.POST_NOTIFICATIONS, 103)
            } else {
                openAppSettings()
            }
        }
    }

    /**
     * Helper: check if permission is granted
     */
    private fun hasPermission(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(this, permission) ==
                PackageManager.PERMISSION_GRANTED
    }

    /**
     * Helper: request permission
     */
    private fun requestPermission(permission: String, requestCode: Int) {
        if (!hasPermission(permission)) {
            ActivityCompat.requestPermissions(this, arrayOf(permission), requestCode)
        }
    }

    /**
     * Open app settings page
     */
    private fun openAppSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.fromParts("package", packageName, null)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        startActivity(intent)
    }
}
