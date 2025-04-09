package com.example.streetsafe_android

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.fragment.app.Fragment

class MapsFragment : Fragment() {
    @SuppressLint("SetJavaScriptEnabled") // Allow JavaScript in WebView
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_maps, container, false)
        val webView = view.findViewById<WebView>(R.id.mapsWebView)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()
        val loadingText = arguments?.getString("loadingText") ?: "Loading..."
        val url = "${Constants.BASE_URL}/maps-fragment?loadingText=$loadingText"
        webView.loadUrl(url)
        return view
    }
}
