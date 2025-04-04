package com.example.streetsafe_android

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.streetsafe_android.databinding.FragmentProfileBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var auth: FirebaseAuth  // Firebase Authentication
    private val db = FirebaseFirestore.getInstance() // Firestore instance

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize Firebase Auth
        auth = FirebaseAuth.getInstance()
        val user = auth.currentUser

        // Display email directly from FirebaseAuth
        binding.emaiLTextView.text = user?.email ?: "Email not available"

        // Fetch full name from Firestore
        user?.uid?.let { uid ->
            db.collection("users").document(uid).get()
                .addOnSuccessListener { document ->
                    if (document.exists()) {
                        val fullname = document.getString("fullname") ?: "User"
                        binding.nameTextView.text = fullname
                    }

                    val fullname = document.getString("fullname") ?: "User"
                    binding.nameTextView.text = fullname

                    val firstLetter = fullname.trim().firstOrNull()?.toString() ?: "?"
                    val drawable = createInitialsDrawable(firstLetter, bgColor = Color.parseColor("#1E88E5")) // Custom blue
                    binding.profileImage.setImageBitmap(drawable)
                }
                .addOnFailureListener {
                    binding.nameTextView.text = "User"
                }
        }

        // Logout button action
        binding.signOutButton.setOnClickListener {
            auth.signOut()
            val intent = Intent(requireContext(), SignInActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }

        // Navigate to Edit Profile Page
        binding.profileButton.setOnClickListener {
            startActivity(Intent(requireContext(), EditProfileActivity::class.java))
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createInitialsDrawable(initial: String, bgColor: Int = android.graphics.Color.GRAY, textColor: Int = android.graphics.Color.WHITE): android.graphics.Bitmap {
        val size = 100
        val bitmap = android.graphics.Bitmap.createBitmap(size, size, android.graphics.Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(bitmap)

        val paint = android.graphics.Paint().apply {
            color = bgColor
            isAntiAlias = true
        }
        canvas.drawCircle(size / 2f, size / 2f, size / 2f, paint)

        paint.color = textColor
        paint.textSize = 40f
        paint.textAlign = android.graphics.Paint.Align.CENTER
        val textY = size / 2 - ((paint.descent() + paint.ascent()) / 2)
        canvas.drawText(initial.uppercase(), size / 2f, textY, paint)

        return bitmap
    }
}