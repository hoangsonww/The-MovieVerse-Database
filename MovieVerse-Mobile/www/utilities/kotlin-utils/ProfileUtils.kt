class ProfileUtils {
    companion object {
        fun redirectToProfilePage() {
            val profileBtn = document.getElementById("profileBtn")
            profileBtn?.addEventListener("click") {
                window.location.href = "./src/html/user-profile.html"
            }

            val mobileProfileBtn = document.getElementById("mobileProfileBtn")
            mobileProfileBtn?.addEventListener("click") {
                window.location.href = "./src/html/user-profile.html"
            }
        }
    }
}
