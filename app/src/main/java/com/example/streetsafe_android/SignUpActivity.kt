package com.example.streetsafe_android

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class SignUpActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.sign_up)

        // Initialize Firebase Auth and Firestore
        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        // Get UI elements
        val fullNameInput = findViewById<EditText>(R.id.fullNameInput)
        val emailInput = findViewById<EditText>(R.id.emailInput)
        val phoneNumber = findViewById<EditText>(R.id.phoneNumber)
        val password = findViewById<EditText>(R.id.password)
        val confirmPassword = findViewById<EditText>(R.id.confirmPassword)
        val signUpButton = findViewById<Button>(R.id.signupButton)
        val loginLink = findViewById<TextView>(R.id.signupLink)

        signUpButton.setOnClickListener {
            val fullNameText = fullNameInput.text.toString().trim()
            val emailText = emailInput.text.toString().trim()
            val phoneText = phoneNumber.text.toString().trim()
            val passwordText = password.text.toString().trim()
            val confirmPasswordText = confirmPassword.text.toString().trim()

            if (fullNameText.isEmpty() || phoneText.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (!Patterns.EMAIL_ADDRESS.matcher(emailText).matches()) {
                emailInput.error = "Enter a valid email"
                return@setOnClickListener
            }

            if (passwordText.length < 6) {
                password.error = "Password must be at least 6 characters"
                return@setOnClickListener
            }

            if (passwordText != confirmPasswordText) {
                confirmPassword.error = "Passwords do not match"
                return@setOnClickListener
            }

            auth.createUserWithEmailAndPassword(emailText, passwordText)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val userId = auth.currentUser?.uid ?: return@addOnCompleteListener

                        val user = hashMapOf(
                            "fullname" to fullNameText,
                            "email" to emailText,
                            "phone" to phoneText,
                            "role" to "4",
                            "createdAt" to SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(
                                Date()
                            )
                        )

                        db.collection("users").document(userId).set(user)
                            .addOnSuccessListener {
                                Toast.makeText(this, "Sign-up Successful!", Toast.LENGTH_LONG).show()
                                startActivity(Intent(this, MainActivity::class.java))
                                finish()
                            }
                    }
                }
        }

        loginLink.setOnClickListener {
            startActivity(Intent(this, SignInActivity::class.java))
        }
    }
}