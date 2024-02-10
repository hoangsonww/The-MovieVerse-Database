class NavigationUtils {
    companion object {
        fun handleNavigation() {
            document.addEventListener("DOMContentLoaded") {
                applyNavigation()
            }
        }

        private fun applyNavigation() {
            document.querySelectorAll("nav a").forEach { link ->
                link.addEventListener("click") { event ->
                    event.preventDefault()
                    val href = link.getAttribute("href")
                    if (href != null) {
                        if (href.startsWith("#")) {
                            val targetMain = document.querySelector(href)
                            var targetDiv = targetMain.previousElementSibling
                            while (targetDiv != null && !targetDiv.classList.contains("genres")) {
                                targetDiv = targetDiv.previousElementSibling
                            }
                            targetDiv?.scrollIntoView(js("{ behavior: 'smooth' }"))
                        } else {
                            window.location.href = href
                        }
                    }
                }
            }
        }
    }
}
