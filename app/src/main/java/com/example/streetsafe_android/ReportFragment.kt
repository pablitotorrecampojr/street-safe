package com.example.streetsafe_android

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.lifecycle.LifecycleOwner
import androidx.camera.view.PreviewView
import java.util.concurrent.ExecutionException

class ReportFragment : Fragment() {

    private val cameraPermission = Manifest.permission.CAMERA
    private lateinit var previewView: PreviewView

    // Request permission launcher
    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                openCamera()
            } else {
                Toast.makeText(requireContext(), "Camera permission required!", Toast.LENGTH_SHORT).show()
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

        // Initialize PreviewView
        previewView = view.findViewById(R.id.previewView)

        // Check and request camera permission on fragment start
        checkAndOpenCamera()
    }

    private fun checkAndOpenCamera() {
        if (ContextCompat.checkSelfPermission(requireContext(), cameraPermission) == PackageManager.PERMISSION_GRANTED) {
            openCamera()
        } else {
            requestPermissionLauncher.launch(cameraPermission)
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
}
