'use strict';

(function () {
  if (window.__MV_DEVTOOLS_GUARD_ACTIVE__) {
    return;
  }
  window.__MV_DEVTOOLS_GUARD_ACTIVE__ = true;

  const ERROR_PAGE_NAME = 'generic-error.html';
  const ERROR_PAGE_PATH = '/MovieVerse-Frontend/html/generic-error.html';
  const SAFE_PAGE_NAMES = new Set([ERROR_PAGE_NAME, 'api_fails.html']);
  const CHECK_INTERVAL_MS = 500;
  const isMobileClient = (() => {
    try {
      const ua = navigator.userAgent || '';
      if (/Android|iPhone|iPad|iPod|Mobile|IEMobile|BlackBerry|Opera Mini/i.test(ua)) {
        return true;
      }
      const platform = navigator.platform || '';
      if (platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
        return true; // iPadOS spoofs a desktop UA but still reports touch support.
      }
    } catch (error) {
      // If detection fails, fall back to running the guard.
    }
    return false;
  })();

  const currentPath = window.location.pathname || '';
  const currentPage = currentPath.split('/').pop() || '';
  const onSafePage = SAFE_PAGE_NAMES.has(currentPage);

  if (isMobileClient) {
    return;
  }

  const redirectTarget = (() => {
    try {
      if (window.location.protocol === 'file:') {
        return new URL(ERROR_PAGE_NAME, window.location.href).toString();
      }
      return new URL(ERROR_PAGE_PATH, window.location.origin).toString();
    } catch (error) {
      return window.location.protocol === 'file:' ? ERROR_PAGE_NAME : ERROR_PAGE_PATH;
    }
  })();

  let redirected = false;

  function triggerRedirect() {
    if (redirected) {
      return;
    }
    redirected = true;
    if (onSafePage) {
      return;
    }
    try {
      sessionStorage.setItem('mv-last-safe-url', window.location.href);
    } catch (error) {
      // Ignore storage errors (e.g., Safari private mode)
    }
    window.location.replace(redirectTarget);
  }

  function installConsoleDetection() {
    const bait = new Image();
    Object.defineProperty(bait, 'id', {
      get: () => {
        triggerRedirect();
        return '';
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
    const blockedKeys = new Set(['F12', 'F9', 'F10', 'F11', 'F8', 'I', 'J', 'C', 'K', 'U', 'S', 'E', 'M', 'O', 'P', 'F', 'L', 'D']);

    const codeBlocklist = new Set(['KEYI', 'KEYJ', 'KEYC', 'KEYK', 'KEYU', 'KEYS', 'KEYE', 'KEYM', 'KEYO', 'KEYP', 'KEYF', 'KEYL', 'KEYD']);

    const blockOnEvent = event => {
      const key = event.key ? event.key.toUpperCase() : '';
      const code = event.code ? event.code.toUpperCase() : '';
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      const isFunctionKey = key.startsWith('F') && blockedKeys.has(key);
      const chromeStyleCombo = ctrlOrMeta && shift && blockedKeys.has(key);
      const safariCombo = ctrlOrMeta && alt && (blockedKeys.has(key) || codeBlocklist.has(code) || key === 'DEAD');
      const metaAltCombo = event.metaKey && alt;
      const ctrlAltCombo = event.ctrlKey && alt;
      const metaShiftCombo = event.metaKey && shift && blockedKeys.has(key);
      const ctrlShiftCombo = event.ctrlKey && shift && blockedKeys.has(key);
      const firefoxFunctionCombo = shift && (key === 'F7' || key === 'F8' || key === 'F9' || key === 'F10' || key === 'F12');
      const explicitCodes = new Set(['F12', 'F11', 'F10', 'F9', 'F8', 'F7', 'BRACKETLEFT']);

      if (
        isFunctionKey ||
        chromeStyleCombo ||
        safariCombo ||
        metaAltCombo ||
        firefoxFunctionCombo ||
        ctrlAltCombo ||
        metaShiftCombo ||
        ctrlShiftCombo ||
        explicitCodes.has(code)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        triggerRedirect();
      }
    };

    ['keydown', 'keypress', 'keyup'].forEach(type => {
      document.addEventListener(type, blockOnEvent, { capture: true });
      document.addEventListener(type, blockOnEvent, { capture: true, passive: false });
      window.addEventListener(type, blockOnEvent, { capture: true });
    });

    const blockContextMenu = event => {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        triggerRedirect();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu, { capture: true });
    document.addEventListener('contextmenu', blockContextMenu, { capture: true, passive: false });
    window.addEventListener('contextmenu', blockContextMenu, { capture: true });
    window.addEventListener('contextmenu', blockContextMenu, { capture: true, passive: false });

    const blockMouseButtons = event => {
      if (event.button === 2 || event.button === 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
      }
      if ((event.button === 0 || event.button === 1) && (event.metaKey || event.ctrlKey)) {
        triggerRedirect();
      }
    };

    ['mousedown', 'mouseup'].forEach(type => {
      document.addEventListener(type, blockMouseButtons, { capture: true });
      document.addEventListener(type, blockMouseButtons, { capture: true, passive: false });
    });
    window.addEventListener('mousedown', blockMouseButtons, { capture: true });
    window.addEventListener('mousedown', blockMouseButtons, { capture: true, passive: false });
    window.addEventListener('mouseup', blockMouseButtons, { capture: true });
    window.addEventListener('mouseup', blockMouseButtons, { capture: true, passive: false });
  }

  installConsoleDetection();
  installKeyGuards();
})();
