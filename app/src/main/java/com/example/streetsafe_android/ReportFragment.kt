
package com.example.streetsafe_android

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.YuvImage
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
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
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
    private var imageCapture: ImageCapture? = null

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
        previewView = view.findViewById(R.id.previewView)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext())
        checkAndOpenCamera()
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
            val imageCapture = imageCapture ?: return@setOnClickListener

            imageCapture.takePicture(
                ContextCompat.getMainExecutor(requireContext()),
                object : ImageCapture.OnImageCapturedCallback() {
                    override fun onCaptureSuccess(imageProxy: ImageProxy) {
                        val bitmap = imageProxyToBitmap(imageProxy)
                        imageProxy.close()
                        val base64Image = bitmapToBase64(bitmap)
                        val city = cityTextView.text.removePrefix("City: ").toString()
                        val barangay = barangayTextView.text.removePrefix("Barangay: ").toString()
                        val street = streetTextView.text.removePrefix("Street: ").toString()
                        val selectedHazard = spinner.selectedItem?.toString() ?: "Unknown"
                        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                        val currentDateTime = dateFormat.format(Date())
                        val report = RoadHazardReport(
                            imageUrl = base64Image,
                            dateSubmitted = currentDateTime,
                            city = city,
                            barangay = barangay,
                            street = street,
                            roadHazard = selectedHazard
                        )
                        Log.d("Base64", base64Image)
                        val db = Firebase.database.reference
                        db.child("roadhazards").push().setValue(report)
                            .addOnSuccessListener {
                                Toast.makeText(requireContext(), "Report submitted!", Toast.LENGTH_SHORT).show()
                            }
                            .addOnFailureListener { e ->
                                Toast.makeText(requireContext(), "Upload failed: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                    }

                    override fun onError(exception: ImageCaptureException) {
                        Toast.makeText(requireContext(), "Capture failed: ${exception.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            )
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
        val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext())
        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()

            val preview = Preview.Builder().build()
            preview.setSurfaceProvider(previewView.surfaceProvider)

            imageCapture = ImageCapture.Builder().build()

            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            cameraProvider.unbindAll()
            cameraProvider.bindToLifecycle(viewLifecycleOwner, cameraSelector, preview, imageCapture)
        }, ContextCompat.getMainExecutor(requireContext()))
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
                Log.d("ReportFragment", "City: $city, Barangay: $barangay, Street: $street")
                view?.findViewById<TextView>(R.id.tvCity)?.text = "City: $city"
                view?.findViewById<TextView>(R.id.tvBarangay)?.text = "Barangay: $barangay"
                view?.findViewById<TextView>(R.id.tvStreet)?.text = "Street: $street"
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

    private fun imageProxyToBitmap(imageProxy: androidx.camera.core.ImageProxy): Bitmap {
        val planeProxy = imageProxy.planes[0]
        val buffer = planeProxy.buffer
        val bytes = ByteArray(buffer.remaining())
        buffer.get(bytes)
        return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, outputStream)
        val byteArray = outputStream.toByteArray()
        return android.util.Base64.encodeToString(byteArray, android.util.Base64.NO_WRAP)
    }
}
