class ServiceWorkerUtils {
    companion object {
        fun registerServiceWorker() {
            if ("serviceWorker" in navigator) {
                window.addEventListener("load") {
                    navigator.serviceWorker.register("src/js/service-worker.js").then({
                        console.log("ServiceWorker registration successful with scope: ", it.scope)
                    }, {
                        console.log("ServiceWorker registration failed: ", it)
                    })
                }
            }
        }
    }
}
