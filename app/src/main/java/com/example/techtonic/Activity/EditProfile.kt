package com.example.techtonic.Activity

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.example.techtonic.Fragments.Profile
import com.example.techtonic.R
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.*
import com.google.firebase.storage.FirebaseStorage
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

class EditProfile : AppCompatActivity() {
    private lateinit var firstname: EditText
    private lateinit var Save: Button
    private lateinit var Pic: Button
    private lateinit var emailTextView: EditText
    private lateinit var lastname: EditText
    private lateinit var phoneNumberTextView: EditText
    private lateinit var database: DatabaseReference
    private lateinit var userProfile: ImageView
    private lateinit var cameraLauncher: ActivityResultLauncher<Intent>
    private var ProfileimageUri: Uri? = null
    private lateinit var auth: FirebaseAuth
    private lateinit var userId: String
    private lateinit var backButton: ImageButton

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_edit_profile)

        auth = FirebaseAuth.getInstance()
        userId = auth.currentUser?.uid ?: ""

        database = FirebaseDatabase.getInstance().reference.child("Android_Users").child(userId)

        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.CAMERA),
            1
        )

        firstname = findViewById(R.id.edtfirstname)
        lastname = findViewById(R.id.edtlastname)
        emailTextView = findViewById(R.id.edtEmailAddress)
        phoneNumberTextView = findViewById(R.id.edtPhoneNumber)
        userProfile = findViewById(R.id.Profile)
        Save = findViewById(R.id.btn_save)
        Pic = findViewById(R.id.profileButton)

        loadUserProfile()

        cameraLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                val bitmap: Bitmap? = result.data?.extras?.get("data") as? Bitmap
                bitmap?.let {
                    userProfile.setImageBitmap(it)
                    ProfileimageUri = saveImageAndGetUri(it)
                }
            }
        }

        Pic.setOnClickListener {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            cameraLauncher.launch(intent)
        }

        Save.setOnClickListener {
            if (validateInput()) {
                submitEditProfile()
            }
        }
        backButton = findViewById(R.id.back_button)
        backButton.setOnClickListener {
            finish()
        }

    }

    private fun loadUserProfile() {
        database.addListenerForSingleValueEvent(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                if (snapshot.exists()) {
                    firstname.setText(snapshot.child("firstName").value?.toString() ?: "")
                    lastname.setText(snapshot.child("lastName").value?.toString() ?: "")
                    emailTextView.setText(snapshot.child("email").value?.toString() ?: "")
                    phoneNumberTextView.setText(snapshot.child("phoneNumber").value?.toString() ?: "")
                }
            }

            override fun onCancelled(error: DatabaseError) {
                Toast.makeText(this@EditProfile, "Failed to load profile", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun validateInput(): Boolean {
        return when {
            firstname.text.isNullOrEmpty() -> {
                Toast.makeText(this, "First Name cannot be empty", Toast.LENGTH_SHORT).show()
                false
            }
            lastname.text.isNullOrEmpty() -> {
                Toast.makeText(this, "Last Name cannot be empty", Toast.LENGTH_SHORT).show()
                false
            }
            else -> true
        }
    }

    private fun saveImageAndGetUri(bitmap: Bitmap): Uri? {
        return try {
            val tempFile = File.createTempFile("profile_image", ".jpg", cacheDir)
            val outputStream = FileOutputStream(tempFile)
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream)
            outputStream.flush()
            outputStream.close()
            Uri.fromFile(tempFile)
        } catch (e: IOException) {
            null
        }
    }

    private fun uploadImageToFirebase(uri: Uri) {
        val storageRef = FirebaseStorage.getInstance().reference.child("profile/$userId.jpg")

        storageRef.putFile(uri)
            .addOnSuccessListener {
                storageRef.downloadUrl.addOnSuccessListener { url ->
                    database.child("imageUrl").setValue(url.toString())
                        .addOnSuccessListener {
                            Toast.makeText(this, "Profile updated successfully", Toast.LENGTH_SHORT).show()
                        }
                }
            }
            .addOnFailureListener {
                Toast.makeText(this, "Image upload failed", Toast.LENGTH_SHORT).show()
            }
    }

    private fun submitEditProfile() {
        val user = mapOf(
            "firstName" to firstname.text.toString(),
            "lastName" to lastname.text.toString(),
            "email" to emailTextView.text.toString(),
            "phoneNumber" to phoneNumberTextView.text.toString()
        )

        database.setValue(user)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    ProfileimageUri?.let { uploadImageToFirebase(it) }
                    clearFields()
                    finish()
                } else {
                    Toast.makeText(this, "Error Editing Profile", Toast.LENGTH_SHORT).show()
                }
            }
    }

    private fun clearFields() {
        firstname.text.clear()
        lastname.text.clear()
        emailTextView.text.clear()
        phoneNumberTextView.text.clear()
        userProfile.setImageDrawable(null)
    }
}
