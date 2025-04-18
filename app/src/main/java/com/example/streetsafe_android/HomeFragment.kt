package com.example.streetsafe_android
import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import com.google.firebase.auth.FirebaseAuth
class HomeFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val user = FirebaseAuth.getInstance().currentUser
        val userId = user?.uid
        val view = inflater.inflate(R.layout.fragment_maps, container, false)
        val webView = view.findViewById<WebView>(R.id.mapsWebView)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (url.contains("/report-hazard?isHomeFramentButton=true")) {
                    parentFragmentManager.beginTransaction()
                        .replace(R.id.nav_host_fragment, ReportFragment())
                        .addToBackStack(null)
                        .commit()
                    return true
                }
                return false
            }
        }
        val url = "${Constants.BASE_URL}home-fragment?userId=$userId"
        webView.loadUrl(url)
        return  view
    }
}