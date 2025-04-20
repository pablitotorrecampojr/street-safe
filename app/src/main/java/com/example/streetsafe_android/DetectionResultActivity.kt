package com.example.streetsafe_android

import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity

class DetectionResultActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detection_result)

        val imageView = findViewById<ImageView>(R.id.imageWithBoxesView)
        val base64Image = intent.getStringExtra("boxedImageBase64")

        if (!base64Image.isNullOrEmpty()) {
            val imageBytes = Base64.decode(base64Image, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            imageView.setImageBitmap(bitmap)
        }
    }
}
