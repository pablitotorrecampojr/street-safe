package com.example.streetsafe_android

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class EditProfileActivity : AppCompatActivity() {
    private lateinit var db: FirebaseFirestore
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.edit_profile)

        // Initialize Firebase Firestore and Auth
        db = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()

        // Get current user's ID
        val userId = auth.currentUser?.uid
        if (userId == null) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Reference UI elements
        val fullNameInput = findViewById<EditText>(R.id.fullNameInput)
        val emailInput = findViewById<EditText>(R.id.emailInput)
        val phoneNumberInput = findViewById<EditText>(R.id.phoneNumber)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val confirmPasswordInput = findViewById<EditText>(R.id.confirmpasswordInput)
        val updateButton = findViewById<Button>(R.id.updateButton)
        val backButton = findViewById<Button>(R.id.backButton)

        // Fetch user data from Firestore
        db.collection("users").document(userId).get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    fullNameInput.setText(document.getString("fullname"))
                    emailInput.setText(document.getString("email"))
                    phoneNumberInput.setText(document.getString("phone"))
                    passwordInput.setText(document.getString("password")) // Handle securely in real apps
                    confirmPasswordInput.setText(document.getString("password")) // Handle securely
                } else {
                    Toast.makeText(this, "User data not found", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Error fetching data: ${e.message}", Toast.LENGTH_SHORT).show()
            }

        // Update Firestore on button click
        updateButton.setOnClickListener {
            val updatedData = mapOf(
                "fullName" to fullNameInput.text.toString(),
                "email" to emailInput.text.toString(),
                "phoneNumber" to phoneNumberInput.text.toString(),
                "password" to passwordInput.text.toString() // Encrypt in production apps
            )

            db.collection("users").document(userId).update(updatedData)
                .addOnSuccessListener {
                    Toast.makeText(this, "Profile updated successfully!", Toast.LENGTH_SHORT).show()
                }
                .addOnFailureListener { e ->
                    Toast.makeText(this, "Update failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
        }

        // Handle back button click
        backButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.putExtra("FRAGMENT_TO_LOAD", "ProfileFragment")
            startActivity(intent)
        }
    }
}
