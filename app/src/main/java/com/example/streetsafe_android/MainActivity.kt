package com.example.streetsafe_android

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.setupWithNavController
import com.example.streetsafe_android.databinding.ActivityMainBinding
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    private lateinit var bindings: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        bindings = ActivityMainBinding.inflate(layoutInflater)
        setContentView(bindings.root)
        replaceFragment(HomeFragment())

        bindings.bottomNavigation.setOnItemSelectedListener {
            when(it.itemId) {
                R.id.homeFragment -> replaceFragment(HomeFragment())
                R.id.profileFragment -> replaceFragment(ProfileFragment())
                R.id.settingsFragment -> replaceFragment(SettingsFragment())

                else -> {

                }
            }
            true
        }
    }

    private fun replaceFragment(fragment: Fragment) {
        val fragmentManager = supportFragmentManager
        val fragmentTransaction = fragmentManager.beginTransaction()
        fragmentTransaction.replace(R.id.nav_host_fragment, fragment)
        fragmentTransaction.commit()
    }
}
