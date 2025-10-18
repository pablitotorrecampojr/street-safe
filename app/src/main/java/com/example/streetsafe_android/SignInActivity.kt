package com.example.streetsafe_android

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.view.View
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.example.streetsafe_android.databinding.SignInBinding
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.tasks.Task
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.util.Date
import java.util.Locale

class SignInActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore
    private lateinit var googleSignInClient: GoogleSignInClient
    private val binding by lazy { SignInBinding.inflate(layoutInflater) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.sign_in)

        // Initialize Firebase Auth and Firestore
        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)

        binding.signinButton.setOnClickListener {

            val emailText = binding.emailInput.text.toString().trim()
            val passwordText = binding.passwordInput.text.toString().trim()

            if (emailText.isEmpty() || !Patterns.EMAIL_ADDRESS.matcher(emailText).matches()) {
                binding.emailInput.error = "Enter a valid email"
                return@setOnClickListener
            }

            if (passwordText.isEmpty()) {
                binding.passwordInput.error = "Enter your password"
                return@setOnClickListener
            }

            binding.signinButton.isEnabled = false;
            binding.signinButton.text = "Signing In ..."
            // Authenticate User
            auth.signInWithEmailAndPassword(emailText, passwordText)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val user = auth.currentUser
                        if (user != null) {
                            if (user.isEmailVerified) {
                                db.collection("users").document(user.uid).get()
                                    .addOnSuccessListener { document ->
                                        if (document.exists()) {
                                            val status = document.getString("status");
                                            //TODO: check if user is still pending
                                            if (status == "0") {
                                                startActivity(Intent(this, PendingAccountPrompt::class.java))
                                            } else {
                                                SessionManager.setUserId(document.getString("uid"))
                                                SessionManager.saveToPrefs(this)
                                                startActivity(Intent(this, MainActivity::class.java))
                                            }
                                            Toast.makeText(this, "Welcome back, ${document.getString("fullname")}!", Toast.LENGTH_LONG).show()

                                            finish()
                                        } else {
                                            auth.signOut()
                                            binding.signinButton.isEnabled = true;
                                            binding.signinButton.text = "Sign In";
                                            Toast.makeText(this, "No user profile found. Please contact support.", Toast.LENGTH_LONG).show()
                                        }
                                    }
                                    .addOnFailureListener {
                                        auth.signOut()
                                        binding.signinButton.isEnabled = true;
                                        binding.signinButton.text = "Sign In";
                                        Toast.makeText(this, "Failed to load user data. Please try again.", Toast.LENGTH_LONG).show()
                                    }
                            } else {
                                startActivity(Intent(this, PendingAccountPrompt::class.java))
                            }
                        }
                    } else {
                        binding.signinButton.isEnabled = true;
                        binding.signinButton.text = "Sign In";
                        Toast.makeText(this, "Error: ${task.exception?.message}", Toast.LENGTH_LONG).show()
                    }
                }
        }

        binding.signupLink.setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        //TODO: handle google sign in process
        binding.googleSignInButton.setOnClickListener {
            setSigningInState(true)
            signInGoogle()
        }


    }

    private fun signInGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        launcher.launch(signInIntent)
    }

    private val launcher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            handleResults(task)
        }
    }

    private fun handleResults(task: Task<GoogleSignInAccount>) {
        if (task.isSuccessful) {
            val account: GoogleSignInAccount? = task.result
            if (account != null) {
                updateUI(account)
            }
        } else {
            Toast.makeText(this, task.exception.toString(), Toast.LENGTH_SHORT).show()
        }
    }

    //TODO: handle disabling buttons on google sign in
    private fun setSigningInState(isSigningIn: Boolean) {
        if (isSigningIn) {
            Log.d("isSigningIn", "false | google sign in in progress")
            binding.googleSignInButton.text = "Signing in, please wait..."
            binding.googleSignInButton.isEnabled = false
            binding.signinButton.text = "Signing in, please wait..."
            binding.signinButton.isEnabled = false
            binding.signInProgressBar.visibility = View.VISIBLE
        } else {
            binding.googleSignInButton.text = "Google Sign in"
            binding.googleSignInButton.isEnabled = true
            binding.signinButton.text = "Sign In"
            binding.signinButton.isEnabled = true
            binding.signInProgressBar.visibility = View.GONE
        }
    }

    //TODO: handle updating ui & creating firestore
    private fun updateUI(account: GoogleSignInAccount) {
        val credential = GoogleAuthProvider.getCredential(account.idToken, null)
        auth.signInWithCredential(credential).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val user = auth.currentUser
                val uid = user?.uid ?: return@addOnCompleteListener
                val email = account.email ?: ""
                val fullName = account.displayName ?: ""

                db.collection("users").document(uid).get()
                    .addOnSuccessListener { document ->
                        if (!document.exists()) {
                            val userData = hashMapOf(
                                "uid" to uid,
                                "fullname" to fullName,
                                "email" to email,
                                "role" to "3",
                                "status" to "1",
                                "createdAt" to SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
                            )

                            // Store user data in Firestore
                            db.collection("users").document(uid).set(userData)
                                .addOnSuccessListener {
                                    Toast.makeText(this, "User data saved successfully!", Toast.LENGTH_SHORT).show()
                                }
                                .addOnFailureListener { e ->
                                    Toast.makeText(this, "Failed to save user data: ${e.message}", Toast.LENGTH_SHORT).show()
                                }
                        }

                        //TODO: Navigate to MainActivity
                        startActivity(Intent(this, MainActivity::class.java).apply {
                            putExtra("email", email)
                            putExtra("fullName", fullName)
                        })
                        finish()
                    }
                    .addOnFailureListener {
                        Toast.makeText(this, "Error checking user: ${it.message}", Toast.LENGTH_SHORT).show()
                    }
            } else {
                Toast.makeText(this, task.exception.toString(), Toast.LENGTH_SHORT).show()
            }
        }
    }
}