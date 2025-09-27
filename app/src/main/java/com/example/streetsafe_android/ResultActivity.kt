package com.example.streetsafe_android

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.graphics.Bitmap
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import android.util.Base64
import android.graphics.BitmapFactory
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ResultActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_result)

        val annotatedImageBase64 = intent.getStringExtra("annotated_image")
        val detectionsStr = intent.getStringExtra("detections")
        val userId = FirebaseAuth.getInstance().currentUser?.uid ?: "anonymous"

        annotatedImageBase64?.let {
            val bitmap = decodeBase64ToBitmap(it)
            findViewById<ImageView>(R.id.resultImageView).setImageBitmap(bitmap)
        }

        detectionsStr?.let {
            findViewById<TextView>(R.id.resultTextView).text = it
        }

        findViewById<Button>(R.id.resultSendButton).setOnClickListener {
            val image = intent.getStringExtra("annotated_image") ?: ""
            val fullAddress = intent.getStringExtra("fullAddress") ?: "Unknown"
            val dateTime = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())
            val userId = userId
            val latitude = intent.getDoubleExtra("latitude", 0.0)
            val longitude = intent.getDoubleExtra("longitude", 0.0)

            sendManualReport(
                image,
                fullAddress,
                dateTime,
                userId,
                detectionsStr.toString(),
                longitude,
                latitude
            )
        }

        val cancelButton = findViewById<Button>(R.id.resultCancelButton)
        cancelButton.setOnClickListener {
            finish()
        }
    }

    private fun decodeBase64ToBitmap(base64Str: String): Bitmap {
        val decodedBytes = Base64.decode(base64Str, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
    }

    private fun sendManualReport(
        image: String,
        fullAddress: String,
        dateTime: String,
        userId: String,
        hazardDescription: String,
        longitude: Number,
        latitude: Number
    ) {
        val report = hashMapOf(
            "id" to generateRandomId(),
            "userid" to userId,
            "image" to image,
            "location" to fullAddress,
            "reportedAt" to dateTime,
            "status" to "pending",
            "description" to hazardDescription,
            "latitude" to latitude,
            "longitude" to longitude,
        )

        val db = Firebase.database.reference
        db.child("roadhazards").push().setValue(report)
            .addOnSuccessListener {
                Toast.makeText(this, "Report submitted manually!", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this, MainActivity::class.java))
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Upload failed: ${e.message}", Toast.LENGTH_SHORT).show()
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
}
