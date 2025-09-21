package com.example.streetsafe_android

import android.content.Context
import androidx.core.content.edit

object SessionManager {
    private const val PREFS_NAME = "app_prefs"
    private const val KEY_USER_ID = "USER_ID"

    @Volatile
    var currentUserId: String? = null
        private set

    fun setUserId(uid: String?) {
        currentUserId = uid
    }

    fun clear() {
        currentUserId = null
    }

    fun saveToPrefs(context: Context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit() {
                putString(KEY_USER_ID, currentUserId)
            }
    }

    fun loadFromPrefs(context: Context) {
        currentUserId = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_USER_ID, null)
    }

    fun clearPrefs(context: Context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit() {
                remove(KEY_USER_ID)
            }
    }
}
