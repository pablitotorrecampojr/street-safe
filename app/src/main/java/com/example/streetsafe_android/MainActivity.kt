package com.example.streetsafe_android

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.streetsafe_android.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var bindings: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        bindings = ActivityMainBinding.inflate(layoutInflater)
        setContentView(bindings.root)

        val fragmentToLoad = intent.getStringExtra("FRAGMENT_TO_LOAD")

        if (fragmentToLoad == "ProfileFragment") {
            replaceFragment(ProfileFragment())
        } else {
            replaceFragment(HomeFragment()) // Default behavior
        }

        bindings.bottomNavigation.setOnItemSelectedListener {
            when(it.itemId) {
                R.id.home -> replaceFragment(HomeFragment())
                R.id.profile -> replaceFragment(ProfileFragment())
                R.id.report -> replaceFragment(ReportFragment())
                R.id.maps -> replaceFragment(MapsFragment())
                R.id.hazards -> replaceFragment(HazardsFragment())
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
