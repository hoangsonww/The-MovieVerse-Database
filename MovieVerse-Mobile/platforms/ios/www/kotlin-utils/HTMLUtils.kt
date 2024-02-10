class HTMLUtils {
    companion object {
        fun scrollToElement(elementId: String) {
            val element = document.getElementById(elementId)
            element?.scrollIntoView(js("{ behavior: 'smooth' }"))
        }

        fun applySettings() {
            val savedBg = localStorage.getItem("backgroundImage")
            val savedTextColor = localStorage.getItem("textColor")
            val savedFontSize = localStorage.getItem("fontSize")

            if (savedBg != null) {
                document.body.style.backgroundImage = "url('$savedBg')"
            }
            if (savedTextColor != null) {
                document.querySelectorAll("h1, h2, h3, p, span, div, button, input, select, textarea").forEach { element ->
                    element.style.color = savedTextColor
                }
            }
            if (savedFontSize != null) {
                val size = when (savedFontSize) {
                    "small" -> "12px"
                    "medium" -> "16px"
                    else -> "20px"
                }
                document.body.style.fontSize = size
            }
        }
    }
}
