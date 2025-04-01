package com.example.streetsafe_android

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.fragment.app.Fragment

class ProfileFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Find the button by ID
        val signOutButton = view.findViewById<Button>(R.id.button3)

        // Set click listener
        signOutButton.setOnClickListener {
            Toast.makeText(requireContext(), "Sign Out Clicked", Toast.LENGTH_SHORT).show()
            // Add navigation logic or other actions here
        }
    }
}
