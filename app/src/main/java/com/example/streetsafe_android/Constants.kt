package com.example.streetsafe_android

object Constants {
    const val IS_PRODUCTION = false

//  private const val DEV_BASE_URL  = "http://192.168.1.188:5173"
    private const val DEV_BASE_URL  = "http://192.168.7.70:5173"
    private const val PROD_BASE_URL = "https://yourdomain.com"

    val BASE_URL = if (IS_PRODUCTION) PROD_BASE_URL else DEV_BASE_URL
}
