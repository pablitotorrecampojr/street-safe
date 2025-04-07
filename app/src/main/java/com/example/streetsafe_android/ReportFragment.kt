
package com.example.streetsafe_android

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.icu.text.SimpleDateFormat
import android.location.Address
import android.location.Geocoder
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.camera.view.PreviewView
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.tasks.OnSuccessListener
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.ktx.storage
import java.io.ByteArrayOutputStream
import java.util.*
import java.util.concurrent.ExecutionException

class ReportFragment : Fragment() {

    private val cameraPermission = Manifest.permission.CAMERA
    private val locationPermission = Manifest.permission.ACCESS_FINE_LOCATION
    private lateinit var previewView: PreviewView
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    data class RoadDefect(val id: Int, val label: String)

    data class RoadHazardReport(
        val imageUrl: String,
        val dateSubmitted: String,
        val city: String,
        val barangay: String,
        val street: String,
        val roadHazard: String
    )

    // Request permission launcher for camera
    private val requestCameraPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                openCamera()
            } else {
                Toast.makeText(requireContext(), "Camera permission required!", Toast.LENGTH_SHORT).show()
            }
        }

    // Request permission launcher for location
    private val requestLocationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                getLocation()
            } else {
                Toast.makeText(requireContext(), "Location permission required!", Toast.LENGTH_SHORT).show()
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_report, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize PreviewView and FusedLocationProviderClient
        previewView = view.findViewById(R.id.previewView)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext())

        // Check and request camera permission on fragment start
        checkAndOpenCamera()

        // Check and request location permission on fragment start
        checkAndRequestLocationPermission()

        val spinner: Spinner = view.findViewById(R.id.spinnerDefects)
        val defects = loadDefectsFromJson()
        val labels = defects.map { it.label }
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, labels)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter

        val submitButton = view.findViewById<Button>(R.id.submitReport)
        val cityTextView = view.findViewById<TextView>(R.id.tvCity)
        val barangayTextView = view.findViewById<TextView>(R.id.tvBarangay)
        val streetTextView = view.findViewById<TextView>(R.id.tvStreet)

        submitButton.setOnClickListener {
            // Example data
            val city = cityTextView.text.toString().removePrefix("City: ")
            val barangay = barangayTextView.text.toString().removePrefix("Barangay: ")
            val street = streetTextView.text.toString().removePrefix("Street: ")
            val roadHazard = spinner.selectedItem.toString()
            val dateSubmitted = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())

        }

    }

    private fun checkAndOpenCamera() {
        if (ContextCompat.checkSelfPermission(requireContext(), cameraPermission) == PackageManager.PERMISSION_GRANTED) {
            openCamera()
        } else {
            requestCameraPermissionLauncher.launch(cameraPermission)
        }
    }

    private fun openCamera() {
        try {
            // Get the CameraX provider
            val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext())
            cameraProviderFuture.addListener({
                // CameraX is now initialized, bind use cases
                val cameraProvider = cameraProviderFuture.get()

                // Create the Preview use case
                val preview = Preview.Builder().build()

                // Set the SurfaceProvider to show the camera feed on PreviewView
                preview.setSurfaceProvider(previewView.surfaceProvider)

                // Get a CameraSelector for the back camera
                val cameraSelector = CameraSelector.Builder().requireLensFacing(CameraSelector.LENS_FACING_BACK).build()

                // Bind the camera use case to the lifecycle of the fragment
                cameraProvider.bindToLifecycle(
                    viewLifecycleOwner, // LifecycleOwner
                    cameraSelector,     // CameraSelector
                    preview             // Use case (Preview)
                )
            }, ContextCompat.getMainExecutor(requireContext()))
        } catch (e: ExecutionException) {
            e.printStackTrace()
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }

        // Log confirmation
        Log.d("ReportFragment", "Camera is being opened and displayed on PreviewView.")
    }

    private fun checkAndRequestLocationPermission() {
        if (ContextCompat.checkSelfPermission(requireContext(), locationPermission) == PackageManager.PERMISSION_GRANTED) {
            getLocation()
        } else {
            requestLocationPermissionLauncher.launch(locationPermission)
        }
    }

    private fun getLocation() {
        if (ContextCompat.checkSelfPermission(requireContext(), locationPermission) == PackageManager.PERMISSION_GRANTED) {
            // Permission is granted, access the location
            fusedLocationClient.lastLocation.addOnSuccessListener(requireActivity()) { location ->
                location?.let {
                    getAddressFromLocation(it.latitude, it.longitude)
                }
            }
        } else {
            // Permission is not granted, request it
            requestLocationPermissionLauncher.launch(locationPermission)
        }
    }

    private fun getAddressFromLocation(latitude: Double, longitude: Double) {
        val geocoder = Geocoder(requireContext(), Locale.getDefault())
        try {
            val addresses: List<Address> = geocoder.getFromLocation(latitude, longitude, 1) ?: emptyList()
            if (addresses.isNotEmpty()) {
                val address: Address = addresses[0]
                val city = address.locality
                val barangay = address.subLocality // Could be barangay or district
                val street = address.thoroughfare // Street name

                // Log the address details
                Log.d("ReportFragment", "City: $city, Barangay: $barangay, Street: $street")

                // Update the TextViews with the location details
                view?.findViewById<TextView>(R.id.tvCity)?.text = "City: $city"
                view?.findViewById<TextView>(R.id.tvBarangay)?.text = "Barangay: $barangay"
                view?.findViewById<TextView>(R.id.tvStreet)?.text = "Street: $street"

                // Optionally, show a toast with the location info
                Toast.makeText(requireContext(), "City: $city, Barangay: $barangay, Street: $street", Toast.LENGTH_LONG).show()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(requireContext(), "Error getting address: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadDefectsFromJson(): List<RoadDefect> {
        val jsonString = requireContext().assets.open("road_defects.json")
            .bufferedReader().use { it.readText() }

        return try {
            val jsonArray = org.json.JSONArray(jsonString)
            val defectList = mutableListOf<RoadDefect>()
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val id = obj.getInt("id")
                val label = obj.getString("label")
                defectList.add(RoadDefect(id, label))
            }
            defectList
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    private fun submitReportToDatabase(report: RoadHazardReport) {
        val databaseRef = Firebase.database.getReference("roadhazards")
        val newEntryRef = databaseRef.push()  // Generates unique ID
        newEntryRef.setValue(report)
            .addOnSuccessListener {
                Toast.makeText(requireContext(), "Report submitted successfully", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener {
                Toast.makeText(requireContext(), "Failed to submit report", Toast.LENGTH_SHORT).show()
            }
    }

    private fun uploadImageToFirebase(bitmap: Bitmap, onComplete: (String?) -> Unit) {
        val storageRef = Firebase.storage.reference
        val imageRef = storageRef.child("images/${UUID.randomUUID()}.jpg")

        val baos = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos)
        val data = baos.toByteArray()

        val uploadTask = imageRef.putBytes(data)
        uploadTask.addOnSuccessListener {
            imageRef.downloadUrl.addOnSuccessListener { uri ->
                onComplete(uri.toString())  // Return download URL
            }
        }.addOnFailureListener {
            it.printStackTrace()
            onComplete(null)
        }
    }


}
