"use strict";

(function () {
  const ERROR_PAGE_NAME = "generic-error.html";
  const ERROR_PAGE_PATH = "/MovieVerse-Frontend/html/generic-error.html";
  const SAFE_PAGE_NAMES = new Set([ERROR_PAGE_NAME, "api_fails.html"]);
  const WIDTH_THRESHOLD = 160;
  const HEIGHT_THRESHOLD = 160;
  const CHECK_INTERVAL_MS = 500;

  const currentPath = window.location.pathname || "";
  if (SAFE_PAGE_NAMES.has(currentPath.split("/").pop() || "")) {
    return;
  }

  const redirectTarget = (() => {
    try {
      if (window.location.protocol === "file:") {
        return new URL(ERROR_PAGE_NAME, window.location.href).toString();
      }
      return new URL(ERROR_PAGE_PATH, window.location.origin).toString();
    } catch (error) {
      return window.location.protocol === "file:"
        ? ERROR_PAGE_NAME
        : ERROR_PAGE_PATH;
    }
  })();

  let redirected = false;

  function triggerRedirect() {
    if (redirected) {
      return;
    }
    redirected = true;
    try {
      sessionStorage.setItem("mv-last-safe-url", window.location.href);
    } catch (error) {
      // Ignore storage errors (e.g., Safari private mode)
    }
    window.location.replace(redirectTarget);
  }

  function dimensionsSuggestDevTools() {
    if (
      typeof window.outerWidth !== "number" ||
      typeof window.outerHeight !== "number"
    ) {
      return false;
    }
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    return widthDiff > WIDTH_THRESHOLD || heightDiff > HEIGHT_THRESHOLD;
  }

  function installDimensionChecks() {
    const handler = () => {
      if (dimensionsSuggestDevTools()) {
        triggerRedirect();
      }
    };
    window.addEventListener("resize", handler, { passive: true });
    window.addEventListener("orientationchange", handler, { passive: true });
    setInterval(handler, CHECK_INTERVAL_MS);
    handler();
  }

  function installConsoleDetection() {
    const bait = new Image();
    Object.defineProperty(bait, "id", {
      get: () => {
        triggerRedirect();
        return "";
      },
    });

    const log = () => {
      console.log(bait);
    };

    log();
    const observer = setInterval(log, CHECK_INTERVAL_MS);
    setTimeout(() => {
      if (redirected) {
        clearInterval(observer);
      }
    }, CHECK_INTERVAL_MS * 4);
  }

  function installKeyGuards() {
    const blockedKeys = new Set(["F12", "I", "J", "C", "K", "U"]);
    document.addEventListener(
      "keydown",
      (event) => {
        const key = event.key ? event.key.toUpperCase() : "";
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        const shift = event.shiftKey;
        const alt = event.altKey;

        if (key === "F12") {
          event.preventDefault();
          triggerRedirect();
          return;
        }

        if (ctrlOrMeta && shift && blockedKeys.has(key)) {
          event.preventDefault();
          triggerRedirect();
          return;
        }

        if (ctrlOrMeta && alt && blockedKeys.has(key)) {
          event.preventDefault();
          triggerRedirect();
        }
      },
      { capture: true },
    );

    document.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          triggerRedirect();
        }
      },
      { capture: true },
    );
  }

  function installFocusGuards() {
    window.addEventListener(
      "blur",
      () => {
        setTimeout(() => {
          if (dimensionsSuggestDevTools()) {
            triggerRedirect();
          }
        }, 150);
      },
      { passive: true },
    );
  }

  installDimensionChecks();
  installConsoleDetection();
  installKeyGuards();
  installFocusGuards();
})();
