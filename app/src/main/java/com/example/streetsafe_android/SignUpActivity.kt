package com.example.streetsafe_android

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth

class SignUpActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.sign_up)

        // Initialize Firebase Auth
        auth = FirebaseAuth.getInstance()

        // Get UI elements
        val firstName = findViewById<EditText>(R.id.firstName)
        val lastName = findViewById<EditText>(R.id.lastName)
        val emailInput = findViewById<EditText>(R.id.emailInput)
        val phoneNumber = findViewById<EditText>(R.id.phoneNumber)
        val password = findViewById<EditText>(R.id.password)
        val confirmPassword = findViewById<EditText>(R.id.confirmPassword)
        val signUpButton = findViewById<Button>(R.id.signinButton)
        val loginLink = findViewById<TextView>(R.id.signupLink)

        // Handle Sign Up button click
        signUpButton.setOnClickListener {
            val firstNameText = firstName.text.toString().trim()
            val lastNameText = lastName.text.toString().trim()
            val emailText = emailInput.text.toString().trim()
            val phoneText = phoneNumber.text.toString().trim()
            val passwordText = password.text.toString().trim()
            val confirmPasswordText = confirmPassword.text.toString().trim()

            if (firstNameText.isEmpty() || lastNameText.isEmpty() || phoneText.isEmpty()) {
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

            // Create user in Firebase
            auth.createUserWithEmailAndPassword(emailText, passwordText)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        Toast.makeText(this, "Sign-up Successful!", Toast.LENGTH_LONG).show()
                        startActivity(Intent(this, MainActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this, "Error: ${task.exception?.message}", Toast.LENGTH_LONG).show()
                    }
                }
        }

        // Navigate to Login Screen
        loginLink.setOnClickListener {
            startActivity(Intent(this, SignInActivity::class.java))
        }
    }
}