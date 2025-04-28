
package com.example.streetsafe_android

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
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
import android.widget.ImageView
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
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import android.util.Base64
import android.graphics.BitmapFactory
import android.widget.ProgressBar

class ReportFragment : Fragment() {
    private val cameraPermission = Manifest.permission.CAMERA
    private val locationPermission = Manifest.permission.ACCESS_FINE_LOCATION
    private lateinit var previewView: PreviewView
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    data class RoadDefect(val id: Int, val label: String)
    private var imageCapture: ImageCapture? = null
    private var latitude: Double? = null
    private var longitude: Double? = null
    val client = OkHttpClient()
    private val requestCameraPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                openCamera()
            } else {
                Toast.makeText(requireContext(), "Camera permission required!", Toast.LENGTH_SHORT).show()
            }
        }

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
        return inflater.inflate(R.layout.fragment_report, container, false)
    }

    lateinit var progressBar: ProgressBar
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        previewView = view.findViewById(R.id.previewView)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext())
        checkAndOpenCamera()
        checkAndRequestLocationPermission()
        val defects = loadDefectsFromJson()
        val capturedImageView = view.findViewById<ImageView>(R.id.capturedImageView)

        val submitButton = view.findViewById<Button>(R.id.submitReport)
        val cityTextView = view.findViewById<TextView>(R.id.tvCity)
        progressBar = view.findViewById(R.id.progressBar)

        val submitFinalButton = view.findViewById<Button>(R.id.submitFinalButton)
        val cancelButton = view.findViewById<Button>(R.id.cancelButton)

        submitButton.setOnClickListener {
            val imageCapture = imageCapture ?: return@setOnClickListener

            progressBar.visibility = View.VISIBLE
            submitButton.isEnabled = false

            imageCapture.takePicture(
                ContextCompat.getMainExecutor(requireContext()),
                object : ImageCapture.OnImageCapturedCallback() {
                    override fun onCaptureSuccess(imageProxy: ImageProxy) {
                        val bitmap = imageProxyToBitmap(imageProxy)
                        imageProxy.close()

                        if (bitmap == null || bitmap.width <= 10 || bitmap.height <= 10) {
                            Log.e("ImageCheck", "Invalid bitmap captured!")
                            Toast.makeText(requireContext(), "Image capture failed. Please try again.", Toast.LENGTH_SHORT).show()

                            progressBar.visibility = View.GONE
                            submitButton.isEnabled = true
                            return
                        }

                        val base64Image = bitmapToBase64(bitmap)
                        val fullAddress = cityTextView.text.removePrefix("City: ").toString()
                        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                        val currentDateTime = dateFormat.format(Date())
                        val userId = FirebaseAuth.getInstance().currentUser?.uid ?: "anonymous"

                        sendPostRequest(base64Image) { result ->
                            requireActivity().runOnUiThread {
                                progressBar.visibility = View.GONE
                                submitButton.isEnabled = true
                            }

                            if (result != null) {
                                try {
                                    val jsonObject = JSONObject(result)
                                    val success = jsonObject.optBoolean("success", false)
                                    val imageWithBoxesBase64 = jsonObject.optString("image_with_boxes", null)

                                    if (imageWithBoxesBase64 != null) {

                                        val detectionsArray = jsonObject.optJSONArray("detections")
                                        val detectedLabels = mutableSetOf<String>() // ensures uniqueness

                                        for (i in 0 until detectionsArray.length()) {
                                            val detection = detectionsArray.getJSONObject(i)
                                            val label = detection.optString("label", "unknown")
                                            detectedLabels.add(label)
                                        }

                                        val detectionText = if (detectedLabels.isNotEmpty()) {
                                            "Detected Hazards:\n" + detectedLabels.joinToString(", ")
                                        } else {
                                            "No hazards detected."
                                        }

                                        requireActivity().runOnUiThread {
                                            // Set detection text
                                            val detectionTextView = view?.findViewById<TextView>(R.id.detectionTextView)
                                            detectionTextView?.text = detectionText
                                            detectionTextView?.visibility = View.VISIBLE

                                            // Set image with bounding boxes
                                            val imageBytes = Base64.decode(imageWithBoxesBase64, Base64.DEFAULT)
                                            val decodedBitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                                            capturedImageView.setImageBitmap(decodedBitmap)
                                            capturedImageView.visibility = View.VISIBLE
                                            previewView.visibility = View.GONE

                                            // Hide old UI
                                            cityTextView.visibility = View.GONE
                                            submitButton.visibility = View.GONE

                                            // Show new buttons
                                            submitFinalButton.visibility = View.VISIBLE
                                            cancelButton.visibility = View.VISIBLE

                                            // Cancel button click - restart fragment
                                            cancelButton.setOnClickListener {
                                                val fragmentTransaction = parentFragmentManager.beginTransaction()
                                                fragmentTransaction.replace(id, ReportFragment())
                                                fragmentTransaction.commit()
                                            }

                                            // Submit final button click - send report to Firebase
                                            submitFinalButton.setOnClickListener {
                                                val intent = Intent(requireContext(), LoadingScreen::class.java)
                                                intent.putExtra("loadingText", "Processing Data ...")
                                                startActivity(intent)

                                                val formattedLabels = detectedLabels.map { label ->
                                                    label.split("_").joinToString(" ") { word ->
                                                        word.replaceFirstChar { it.uppercase() }
                                                    }
                                                }

                                                val report = hashMapOf(
                                                    "id" to generateRandomId(),
                                                    "imageUrl" to imageWithBoxesBase64,
                                                    "dateSubmitted" to currentDateTime,
                                                    "fullAddress" to fullAddress,
                                                    "roadHazard" to formattedLabels,
                                                    "status" to 0,
                                                    "latitude" to latitude,
                                                    "longitude" to longitude,
                                                    "userid" to userId
                                                )

                                                val reportJson = JSONObject(report as Map<*, *>)
                                                Log.d("ReportData", reportJson.toString(4))

                                                val db = Firebase.database.reference
                                                db.child("roadhazards").push().setValue(report)
                                                    .addOnSuccessListener {
                                                        Toast.makeText(requireContext(), "Report submitted!", Toast.LENGTH_SHORT).show()
                                                        val intent = Intent(requireContext(), MainActivity::class.java)
                                                        startActivity(intent)
                                                    }
                                                    .addOnFailureListener { e ->
                                                        Toast.makeText(requireContext(), "Upload failed: ${e.message}", Toast.LENGTH_SHORT).show()
                                                        val intent = Intent(requireContext(), MainActivity::class.java)
                                                        startActivity(intent)
                                                    }
                                            }
                                        }
                                    }

                                } catch (e: Exception) {
                                    Log.e("POST_RESULT", "Failed to parse JSON: ${e.message}")
                                }
                            } else {
                                Log.d("POST_RESPONSE", "Request failed")
                            }
                        }
                    }

                    override fun onError(exception: ImageCaptureException) {
                        Toast.makeText(requireContext(), "Capture failed: ${exception.message}", Toast.LENGTH_SHORT).show()
                        progressBar.visibility = View.GONE
                        submitButton.isEnabled = true
                    }
                }
            )
        }

    }

    fun generateRandomId(): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        val id = StringBuilder()
        repeat(28) {
            id.append(chars.random())
        }
        return id.toString()
    }

    private fun sendPostRequest(image: String, onResult: (String?) -> Unit) {
        //val url = "http://192.168.107.46:5000/detect"
        val url = "http://192.168.254.101:5000/detect"
        val json = """
        {
            "image": "$image"
        }
    """.trimIndent()

        val mediaType = "application/json; charset=utf-8".toMediaType()
        val requestBody = json.toRequestBody(mediaType)

        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .addHeader("Content-Type", "application/json")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                Log.e("POST_ERROR", "Request failed due to IOException: ${e.message}")
                onResult(null)
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val responseData = response.body?.string()
                    onResult(responseData)
                } else {
                    val errorBody = response.body?.string()
                    Log.e("POST_ERROR", "Server responded with error: Code=${response.code}, Body=$errorBody")
                    onResult(null)
                }
            }
        })
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
            fusedLocationClient.lastLocation.addOnSuccessListener(requireActivity()) { location ->
                location?.let {
                    latitude = it.latitude
                    longitude = it.longitude
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
                Log.d("Address", address.toString())
                val fullAddress = address.getAddressLine(0)
                view?.findViewById<TextView>(R.id.tvCity)?.text = "Address: $fullAddress"
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

    private fun imageProxyToBitmap(imageProxy: ImageProxy): Bitmap {
        return when (imageProxy.format) {
            ImageFormat.JPEG -> {
                val buffer = imageProxy.planes[0].buffer
                val bytes = ByteArray(buffer.remaining())
                buffer.get(bytes)
                BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
            }
            ImageFormat.YUV_420_888 -> {
                val yBuffer = imageProxy.planes[0].buffer
                val uBuffer = imageProxy.planes[1].buffer
                val vBuffer = imageProxy.planes[2].buffer

                val ySize = yBuffer.remaining()
                val uSize = uBuffer.remaining()
                val vSize = vBuffer.remaining()

                val nv21 = ByteArray(ySize + uSize + vSize)
                yBuffer.get(nv21, 0, ySize)
                vBuffer.get(nv21, ySize, vSize)
                uBuffer.get(nv21, ySize + vSize, uSize)

                val yuvImage = YuvImage(nv21, ImageFormat.NV21, imageProxy.width, imageProxy.height, null)
                val out = ByteArrayOutputStream()
                yuvImage.compressToJpeg(Rect(0, 0, imageProxy.width, imageProxy.height), 90, out)
                val imageBytes = out.toByteArray()
                BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            }
            else -> throw IllegalArgumentException("Unsupported image format: ${imageProxy.format}")
        }
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, outputStream)
        val byteArray = outputStream.toByteArray()
        return android.util.Base64.encodeToString(byteArray, android.util.Base64.NO_WRAP)
    }
}
