package com.example.streetsafe_android

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class LoadingScreen : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled") // to allow JS in WebView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.loading_screen)

        val webView = findViewById<WebView>(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()

        val loadingText = "Sending Data "
        webView.loadUrl("http://192.168.1.188:5173/loading-screen?loadingText=$loadingText")
    }
}
