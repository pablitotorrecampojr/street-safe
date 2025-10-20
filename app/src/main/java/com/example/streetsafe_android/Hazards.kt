package com.example.streetsafe_android

data class Hazards(val types: List<String>) {
    companion object {
        val DEFAULT = listOf(
            "Potholes",
            "Alligator Cracks",
            "Major Scalling",
            "Shoving and Corrugation",
            "Pumping and Depression",
            "No/Faded Road Markings",
            "Defects on Shoulders",
            "Lush Vegetation",
            "Clogged Drains",
            "Open Manhole",
            "No/Inadequate Sealant in Joints",
            "Cracks",
            "Raveling",
            "Unmaintained Signages and Road Markers",
            "Unmaintained Bridges",
            "Unmaintained Guardrails"
        )
    }
}