package com.example.streetsafe_android

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

class HazardsFragment : Fragment() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    @SuppressLint("MissingPermission", "SetJavaScriptEnabled")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_maps, container, false)
        val webView = view.findViewById<WebView>(R.id.mapsWebView)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()
        val url = "${Constants.BASE_URL}hazards-fragment"
        webView.loadUrl(url)
        return  view
    }
}