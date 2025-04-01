package com.example.streetsafe_android

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class SignInActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.sign_in) // This loads sign_up.xml

        findViewById<TextView>(R.id.signupLink).setOnClickListener{
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        findViewById<Button>(R.id.signinButton).setOnClickListener{
            startActivity(Intent(this, MainActivity::class.java))
        }
    }
}
