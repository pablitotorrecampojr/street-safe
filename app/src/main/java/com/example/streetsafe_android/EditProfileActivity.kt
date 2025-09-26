package com.example.streetsafe_android

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Switch
import android.widget.Toast
import android.widget.ToggleButton
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
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
        val deleteAccountButton = findViewById<Button>(R.id.deleteAccountButton)
        val backButton = findViewById<Button>(R.id.backButton)
        val toggleChangePassword = findViewById<Switch>(R.id.toggleChangePassword)

        // Disable password fields by default
        passwordInput.isEnabled = false
        confirmPasswordInput.isEnabled = false
        toggleChangePassword.isChecked = false  // Ensure toggle is off by default
        emailInput.isEnabled = false
        // Toggle button listener
        toggleChangePassword.setOnCheckedChangeListener { _, isChecked ->
            passwordInput.isEnabled = isChecked
            confirmPasswordInput.isEnabled = isChecked
        }

        // Fetch user data from Firestore
        db.collection("users").document(userId).get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    fullNameInput.setText(document.getString("fullname"))
                    emailInput.setText(document.getString("email"))
                    phoneNumberInput.setText(document.getString("phone"))
                } else {
                    Toast.makeText(this, "User data not found", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Error fetching data: ${e.message}", Toast.LENGTH_SHORT).show()
            }

        updateButton.setOnClickListener {
            val updatedData = mapOf(
                "fullname" to fullNameInput.text.toString(),
                "phone" to phoneNumberInput.text.toString()
            )

            db.collection("users").document(userId).update(updatedData)
                .addOnSuccessListener {
                    // Handle password update in Firebase Authentication if toggle is checked
                    if (toggleChangePassword.isChecked) {
                        val newPassword = passwordInput.text.toString()
                        val confirmPassword = confirmPasswordInput.text.toString()

                        if (newPassword.isEmpty() || confirmPassword.isEmpty()) {
                            Toast.makeText(this, "Password fields cannot be empty", Toast.LENGTH_SHORT).show()
                            return@addOnSuccessListener
                        }

                        if (newPassword != confirmPassword) {
                            Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                            return@addOnSuccessListener
                        }

                        val user: FirebaseUser? = auth.currentUser
                        user?.updatePassword(newPassword)
                            ?.addOnSuccessListener {
                                Toast.makeText(this, "Password updated successfully!", Toast.LENGTH_SHORT).show()

                                // Redirect to MainActivity after a successful update
                                val intent = Intent(this, MainActivity::class.java)
                                intent.putExtra("FRAGMENT_TO_LOAD", "ProfileFragment")
                                startActivity(intent)
                                finish()  // Close the current activity
                            }
                            ?.addOnFailureListener { e ->
                                Toast.makeText(this, "Password update failed: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                    } else {
                        // If toggle is not checked, still redirect to MainActivity after updating user data
                        val intent = Intent(this, MainActivity::class.java)
                        intent.putExtra("FRAGMENT_TO_LOAD", "ProfileFragment")
                        startActivity(intent)
                        finish()  // Close the current activity
                    }
                }
                .addOnFailureListener { e ->
                    Toast.makeText(this, "Update failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
        }

        //TODO: handle user acount deletion
        deleteAccountButton.setOnClickListener {
            val builder = AlertDialog.Builder(this)
            builder.setTitle("Delete Account")
            builder.setMessage("Are you sure you want to delete your account? This action cannot be undone.")

            // Confirm button
            builder.setPositiveButton("Delete") { dialog, _ ->
                val user = FirebaseAuth.getInstance().currentUser
                val db = FirebaseFirestore.getInstance()

                if (user != null) {
                    val uid = user.uid

                    //TODO: Delete Firestore data
                    db.collection("users").document(uid).delete()
                        .addOnSuccessListener {
                            //TODO: Then delete Auth account
                            user.delete()
                                .addOnCompleteListener { task ->
                                    if (task.isSuccessful) {
                                        Toast.makeText(this, "Account deleted", Toast.LENGTH_SHORT).show()
                                        // TODO: redirect user to sign-in screen
                                        startActivity(Intent(this, SignInActivity::class.java))
                                    } else {
                                        Toast.makeText(this, "Error deleting account", Toast.LENGTH_SHORT).show()
                                    }
                                }
                        }
                        .addOnFailureListener {
                            Toast.makeText(this, "Failed to delete user data", Toast.LENGTH_SHORT).show()
                        }
                }

                dialog.dismiss()
            }


            // Cancel button
            builder.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }

            // Show the alert
            val dialog = builder.create()
            dialog.show()
        }


        // Handle back button click
        backButton.setOnClickListener {
            finish() //
        }
    }
}
