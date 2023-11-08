/*
  ZaDark – Zalo Dark Mode
  Made by Quaric
*/

(function () {
  if (typeof require === "function") {
   
  }

  const ZADARK_THEME_KEY = "@ZaDark:THEME";
  const ZADARK_FONT_FAMILY_KEY = "@ZaDark:FONT_FAMILY";
  const ZADARK_FONT_SIZE_KEY = "@ZaDark:FONT_SIZE";

  const ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY = "@ZaDark:ENABLED_HIDE_LATEST_MESSAGE";
  const ZADARK_ENABLED_HIDE_CONV_AVATAR_KEY = "@ZaDark:ENABLED_HIDE_CONV_AVATAR";
  const ZADARK_ENABLED_HIDE_CONV_NAME_KEY = "@ZaDark:ENABLED_HIDE_CONV_NAME";
  const ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY = "@ZaDark:ENABLED_HIDE_THREAD_CHAT_MESSAGE";

  const ZADARK_ENABLED_BLOCK_TYPING_KEY = "@ZaDark:ENABLED_BLOCK_TYPING";
  const ZADARK_ENABLED_BLOCK_DELIVERED_KEY = "@ZaDark:ENABLED_BLOCK_DELIVERED";
  const ZADARK_ENABLED_BLOCK_SEEN_KEY = "@ZaDark:ENABLED_BLOCK_SEEN";
  const BLOCK_STORAGE_KEYS = {
    block_typing: ZADARK_ENABLED_BLOCK_TYPING_KEY,
    block_delivered: ZADARK_ENABLED_BLOCK_DELIVERED_KEY,
    block_seen: ZADARK_ENABLED_BLOCK_SEEN_KEY,
  };
  const BLOCK_IDS = ["block_typing", "block_delivered", "block_seen", "block_online"];

  const ZADARK_USE_HOTKEYS = "@ZaDark:USE_HOTKEYS";
  const ZADARK_KNOWN_VERSION_KEY = "@ZaDark:KNOWN_VERSION";
  const ZALO_APP_VERSION_KEY = "sh_app_ver";

  const ZADARK_MIGRATION_KEY = "@ZaDark:MIGRATION";
  const ZADARK_MIGRATION_VALUE = "S2zhgZnVijSf9MSi";




  const ZaDarkCookie = {
    isSupport: () => {
      if (window.$zelectron && typeof window.$zelectron.setCookie === "function") {
        return true;
      }

      if (window.electronAPI && typeof window.electronAPI.setCustomCookie === "function") {
        return true;
      }

      return false;
    },

    set: async (name, value) => {
      try {
        const url = "https://zadark.com/";
        const domain = "zadark.com";

        if (window.$zelectron && typeof window.$zelectron.setCookie === "function") {
          await window.$zelectron.setCookie(name, value, url, domain);
          return true;
        }

        if (window.electronAPI && typeof window.electronAPI.setCustomCookie === "function") {
          await window.electronAPI.setCustomCookie(url, domain, {
            name,
            value,
            expirationDate: Date.now() + 31536e6, // 1 year
          });
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }

      // Refs:
      // Zalo <= 23.6.1
      // window.electronAPI.setCustomCookie('https://zadark.com', 'zadark.com', { name: "@ZaDark:THEME", value: "dark", expirationDate: Date.now() + 31536e6 })
      //
      // Zalo >= 23.7.1
      // window.$zelectron.setCookie('@ZaDark:THEME', 'dark', 'https://zadark.com', 'zadark.com')
    },
  };

  const ZaDarkStorage = {
    getTheme: () => {
      return localStorage.getItem(ZADARK_THEME_KEY) || "dark";
    },
    saveTheme: (theme) => {
      return localStorage.setItem(ZADARK_THEME_KEY, theme);
    },

    getFontFamily: () => {
      const value = localStorage.getItem(ZADARK_FONT_FAMILY_KEY);

      if (value === null) {
        return "Open Sans";
      }

      return value;
    },
    saveFontFamily: (font) => {
      return localStorage.setItem(ZADARK_FONT_FAMILY_KEY, font);
    },

    getFontSize: () => {
      return localStorage.getItem(ZADARK_FONT_SIZE_KEY) || "medium";
    },
    saveFontSize: (fontSize) => {
      return localStorage.setItem(ZADARK_FONT_SIZE_KEY, fontSize);
    },

    saveEnabledHideLatestMessage: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY, isEnabled);
    },
    getEnabledHideLatestMessage: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_LATEST_MESSAGE_KEY) === "true";
    },

    saveEnabledHideConvAvatar: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_CONV_AVATAR_KEY, isEnabled);
    },
    getEnabledHideConvAvatar: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_CONV_AVATAR_KEY) === "true";
    },

    saveEnabledHideConvName: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_CONV_NAME_KEY, isEnabled);
    },
    getEnabledHideConvName: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_CONV_NAME_KEY) === "true";
    },

    saveEnabledHideThreadChatMessage: (isEnabled) => {
      return localStorage.setItem(ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY, isEnabled);
    },
    getEnabledHideThreadChatMessage: () => {
      return localStorage.getItem(ZADARK_ENABLED_HIDE_THREAD_CHAT_MESSAGE_KEY) === "true";
    },

    saveBlockSettings: (blockId, isEnabled) => {
      const key = BLOCK_STORAGE_KEYS[blockId];
      if (key) {
        ZaDarkCookie.set(key, isEnabled ? "true" : "false");
        return localStorage.setItem(key, isEnabled);
      }
    },
    getBlockSettings: () => {
      return {
        block_typing: localStorage.getItem(ZADARK_ENABLED_BLOCK_TYPING_KEY) === "true",
        block_delivered: localStorage.getItem(ZADARK_ENABLED_BLOCK_DELIVERED_KEY) === "true",
        block_seen: localStorage.getItem(ZADARK_ENABLED_BLOCK_SEEN_KEY) === "true",
      };
    },

    saveUseHotkeys: (useHotkeys) => {
      return localStorage.setItem(ZADARK_USE_HOTKEYS, useHotkeys);
    },
    getUseHotkeys: () => {
      const value = localStorage.getItem(ZADARK_USE_HOTKEYS) || "true";
      return value === "true";
    },

    getKnownVersion: () => {
      return localStorage.getItem(ZADARK_KNOWN_VERSION_KEY) || "0.0";
    },
    saveKnownVersion: (version) => {
      return localStorage.setItem(ZADARK_KNOWN_VERSION_KEY, version);
    },

    getZaloAppVersion: () => {
      return localStorage.getItem(ZALO_APP_VERSION_KEY) || "0.0";
    },

    isMigrationNeeded: () => {
      return localStorage.getItem(ZADARK_MIGRATION_KEY) !== ZADARK_MIGRATION_VALUE;
    },
    setMigrationDone: () => {
      return localStorage.setItem(ZADARK_MIGRATION_KEY, ZADARK_MIGRATION_VALUE);
    },
  };

  const ZaDarkUtils = {
    toggleBodyClassName: (className, isEnabled) => {
      if (isEnabled) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    },

    isMac: () => {
      return document.documentElement.getAttribute("data-zadark-os") === "macOS";
    },

    setThemeAttr: (themeMode) => {
      document.documentElement.setAttribute("data-zadark-theme", themeMode);
    },

    setFontFamilyAttr: (fontFamily) => {
      if (!fontFamily) {
        document.querySelector(":root").style.removeProperty("--zadark-font-family");
        document.documentElement.removeAttribute("data-zadark-use-font");
        return;
      }

      document.querySelector(":root").style.setProperty("--zadark-font-family", fontFamily);
      document.documentElement.setAttribute("data-zadark-use-font", "true");
    },

    setFontSizeAttr: (fontSize) => {
      document.documentElement.setAttribute("data-zadark-font-size", fontSize);
    },

    setHideLatestMessageAttr: function (isEnabled) {
      this.toggleBodyClassName("zadark-prv--latest-message", isEnabled);
    },

    setHideConvAvatarAttr: function (isEnabled) {
      this.toggleBodyClassName("zadark-prv--conv-avatar", isEnabled);
    },

    setHideConvNameAttr: function (isEnabled) {
      this.toggleBodyClassName("zadark-prv--conv-name", isEnabled);
    },

    setHideThreadChatMessageAttr: function (isEnabled) {
      this.toggleBodyClassName("zadark-prv--thread-chat-message", isEnabled);
    },

    setUseHotkeysAttr: function (isEnabled) {
      this.toggleBodyClassName("zadark--use-hotkeys", isEnabled);
    },

    setPageTheme: function (theme) {
      switch (theme) {
        case "light":
        case "dark": {
          this.setThemeAttr(theme);
          return;
        }

        case "auto": {
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          this.setThemeAttr(isDark ? "dark" : "light");
          return;
        }

        default: {
          this.setThemeAttr("dark");
        }
      }
    },




 

    setSelect: (elName, value) => {
      $(elName).val(value);
    },

    setSwitch: (elName, enabled) => {
      $(elName).prop("checked", enabled);
    },

    installFontFamily: (fontFamilies = [], classes = true) => {
      if (!fontFamilies.length) {
        return Promise.resolve(false);
      }

      return new Promise((resolve) => {
        WebFont.load({
          google: {
            families: fontFamilies,
          },
          loading: () => {
            console.log("Fonts are being loaded", fontFamilies);
          },
          active: () => {
            console.log("Fonts have been rendered", fontFamilies);
            resolve(true);
          },
          inactive: () => {
            console.log("Fonts failed to load", fontFamilies);
            resolve(false);
          },
          classes,
          timeout: 1408,
        });
      });
    },

    initFontFamily: async function () {
      const fontFamily = ZaDarkStorage.getFontFamily();

      if (!fontFamily) {
        this.installFontFamily(["Open Sans:400,500,600:latin,vietnamese"], false);
        return;
      }

      await this.installFontFamily([`${fontFamily}:400,500,600:latin,vietnamese`, "Open Sans:400,500,600:latin,vietnamese"], false);
      this.setFontFamilyAttr(fontFamily);
    },

    initPageSettings: async function () {
      this.initFontFamily();
      this.initBlockSettings();

    },

    updateTheme: function (theme) {
      this.setPageTheme(theme);
    },

 


    debounce: (func, delay) => {
      let timer;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
      };
    },

  
  };

  ZaDarkUtils.initPageSettings();

  window.matchMedia("(prefers-color-scheme: dark)").addListener((event) => {
    if (theme === "auto") {
      ZaDarkUtils.setThemeAttr(event.matches ? "dark" : "light");
    }
  });

  const popupScrollableElName = "#js-zadark-popup__scrollable";
  const btnScrollElName = "#js-btn-scroll";
  const versionElName = "#js-ext-version";

  const radioInputThemeElName = '#js-radio-input-theme input:radio[name="theme"]';
  const inputFontFamilyElName = "#js-input-font-family";
  const selectFontSizeElName = "#js-select-font-size";

  const switchHideLatestMessageElName = "#js-switch-hide-latest-message";
  const switchHideConvAvatarElName = "#js-switch-hide-conv-avatar";
  const switchHideConvNameElName = "#js-switch-hide-conv-name";
  const switchHideThreadChatMessageElName = "#js-switch-hide-thread-chat-message";

  const switchBlockTypingElName = "#js-switch-block-typing";
  const switchBlockSeenElName = "#js-switch-block-seen";
  const switchBlockDeliveredElName = "#js-switch-block-delivered";

  const switchUseHotkeysElName = "#js-switch-use-hotkeys";

  const isSupportFeatureBlock = ZaDarkCookie.isSupport();

  const setRadioInputTheme = (theme) => {
    const options = ["light", "dark", "auto"];
    options.forEach((option) => {
      $(radioInputThemeElName)
        .filter(`[value="${option}"]`)
        .prop("checked", option === theme);
    });
  };

  function handleThemeChange() {
    const theme = $(this).val();
    ZaDarkUtils.updateTheme(theme);
  }

  const handleNextTheme = () => {
    const theme = ZaDarkStorage.getTheme();

    const themes = ["light", "dark"];

    const nextIndex = themes.indexOf(theme) + 1;
    const nextTheme = themes[nextIndex] || themes[0];

    setRadioInputTheme(nextTheme);
    ZaDarkUtils.updateTheme(nextTheme);
  };

  async function handleInputFontFamilyKeyPress(event) {
    const isEnter = Number(event.keyCode ? event.keyCode : event.which) - 1 === 12;

    if (!isEnter) {
      return;
    }

    const fontFamily = $(this).val();
    const success = await ZaDarkUtils.updateFontFamily(fontFamily);

    if (!success) {
      $(this).val("");
    }
  }

  function handleFontSizeChange() {
    const fontSize = $(this).val();
    ZaDarkUtils.updateFontSize(fontSize);
  }

  const handleNextFontSize = (count) => {
    const fontSize = ZaDarkStorage.getFontSize();

    const fontSizes = ["small", "medium", "big", "very-big"];

    const nextIndex = count > 0 ? Math.min(fontSizes.indexOf(fontSize) + 1, fontSizes.length - 1) : Math.max(fontSizes.indexOf(fontSize) - 1, 0);

    const nextFontSize = fontSizes[nextIndex];

    ZaDarkUtils.setSelect(selectFontSizeElName, nextFontSize);
    handleFontSizeChange.bind($(selectFontSizeElName))();
  };

  function handleHideLastestMessageChange() {
    const isEnabled = $(this).is(":checked");
    ZaDarkUtils.updateHideLatestMessage(isEnabled);
  }

  function handleHideConvAvatarChange() {
    const isEnabled = $(this).is(":checked");
    ZaDarkUtils.updateHideConvAvatar(isEnabled);
  }

  function handleHideConvNameChange() {
    const isEnabled = $(this).is(":checked");
    ZaDarkUtils.updateHideConvName(isEnabled);
  }

  function handleHideThreadChatMessageChange() {
    const isEnabled = $(this).is(":checked");
    ZaDarkUtils.updateHideThreadChatMessage(isEnabled);
  }

  const handleBlockSettingsChange = (blockId) => {
    return function (event) {
      if (!isSupportFeatureBlock) {
        ZaDarkUtils.setSwitch(this, false);
        ZaDarkUtils.showToast(`Vì Zalo nâng cấp mã nguồn, nên chức năng này tạm thời không khả dụng trên <strong>Zalo PC ${ZaDarkStorage.getZaloAppVersion()}</strong>.<br/>ZaDark sẽ cập nhật trong thời gian tới.`, {
          className: "toastify--error",
        });
        return;
      }

      const isEnabled = $(this).is(":checked");
      ZaDarkUtils.updateBlockSettings(blockId, isEnabled);
    };
  };







  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.id === "app-page") {
          loadZaDarkPopup();
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.querySelector("#app"), { subtree: false, childList: true });
})()(
  /*
  ZaDark – Zalo Dark Mode
  Browser Extension
  Made by Quaric
*/

  function (global) {
    const ZaDarkUtils = {

      toggleBodyClassName: (className, isEnabled) => {
        if (isEnabled) {
          document.body.classList.add(className);
        } else {
          document.body.classList.remove(className);
        }
      },

      setOSAttr: (os) => {
        document.documentElement.setAttribute("data-zadark-os", os);
      },

      setThemeAttr: (themeMode) => {
        document.documentElement.setAttribute("data-zadark-theme", themeMode);
      },

      setFontFamilyAttr: (fontFamily) => {
        if (!fontFamily) {
          document.querySelector(":root").style.removeProperty("--zadark-font-family");
          document.documentElement.removeAttribute("data-zadark-use-font");
          return;
        }

        document.querySelector(":root").style.setProperty("--zadark-font-family", fontFamily);
        document.documentElement.setAttribute("data-zadark-use-font", "true");
      },

      setFontSizeAttr: (fontSize) => {
        document.documentElement.setAttribute("data-zadark-font-size", fontSize);
      },

      setHideLatestMessageAttr: function (isEnabled) {
        this.toggleBodyClassName("zadark-prv--latest-message", isEnabled);
      },

      setHideConvAvatarAttr: function (isEnabled) {
        this.toggleBodyClassName("zadark-prv--conv-avatar", isEnabled);
      },

      setHideConvNameAttr: function (isEnabled) {
        this.toggleBodyClassName("zadark-prv--conv-name", isEnabled);
      },

      setHideThreadChatMessageAttr: function (isEnabled) {
        this.toggleBodyClassName("zadark-prv--thread-chat-message", isEnabled);
      },

      setUseHotkeysAttr: function (isEnabled) {
        this.toggleBodyClassName("zadark--use-hotkeys", isEnabled);
      },

      setPageTheme: function (theme) {
        switch (theme) {
          case "light":
          case "dark": {
            this.setThemeAttr(theme);
            return;
          }

          case "auto": {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            this.setThemeAttr(isDark ? "dark" : "light");
            return;
          }

          default: {
            this.setThemeAttr("dark");
          }
        }
      },

      isSupportDeclarativeNetRequest: () => {
        const {
          parsedResult: { browser },
        } = bowser.getParser(window.navigator.userAgent);

        const browserName = browser.name;
        const browserVersion = parseFloat(browser.version);

        // Chrome (Chromium) 84+ supports Declarative Net Request WebExtensions API
        if (["Chrome", "Microsoft Edge", "Opera"].includes(browserName) && browserVersion >= 84) {
          return true;
        }

        // Safari 15+ supports Declarative Net Request WebExtensions API
        if (browserName === "Safari" && browserVersion >= 15) {
          return true;
        }

        // Firefox 113+ supports Declarative Net Request WebExtensions API
        if (browserName === "Firefox" && browserVersion >= 113) {
          return true;
        }

        return false;
      },

  

      initPageSettings: async function () {
        this.initOSName();
        this.initFontFamily();

        this.setPageTheme(theme);
        this.setFontSizeAttr(fontSize);

        this.setHideLatestMessageAttr(enabledHideLatestMessage);
        this.setHideConvAvatarAttr(enabledHideConvAvatar);
        this.setHideConvNameAttr(enabledHideConvName);
        this.setHideThreadChatMessageAttr(enabledHideThreadChatMessage);

        this.setUseHotkeysAttr(useHotkeys);
      },

      installFontFamily: async (fontFamilies = [], classes = true) => {
        if (!fontFamilies.length) {
          return false;
        }

        try {
          await ZaDarkFonts.loadGoogleFonts(fontFamilies, classes);
          return true;
        } catch (error) {
          return false;
        }
      },

      updateTheme: async function (theme) {
        await ZaDarkBrowser.saveExtensionSettings({ theme });
        this.setPageTheme(theme);
      },

      updateFontFamily: async function (fontFamily) {
        if (!fontFamily) {
          // Use default font
          await ZaDarkBrowser.saveExtensionSettings({ fontFamily });
          this.setFontFamilyAttr("");
          this.showToast("Đã thay đổi phông chữ.");
          return true;
        }

        const toast = this.showToast("Đang tải phông chữ...", { duration: -1 });

        const success = await this.installFontFamily([`${fontFamily}:400;500;600`], false);

        toast.hideToast();

        if (!success) {
          this.showToast("Không thể tải phông chữ.");
          return false;
        }

        await ZaDarkBrowser.saveExtensionSettings({ fontFamily });

        this.setFontFamilyAttr(fontFamily);
        this.showToast("Đã thay đổi phông chữ.");

        return true;
      },

      updateFontSize: async function (fontSize) {
        await ZaDarkBrowser.saveExtensionSettings({ fontSize });
        this.setFontSizeAttr(fontSize);
        ZaDarkUtils.showToast(this.HOTKEYS_TOAST_MESSAGE.fontSize[fontSize]);
      },

      updateHideLatestMessage: async function (enabledHideLatestMessage) {
        await ZaDarkBrowser.saveExtensionSettings({ enabledHideLatestMessage });
        this.toggleBodyClassName("zadark-prv--latest-message", enabledHideLatestMessage);
        this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideLatestMessage[enabledHideLatestMessage]);
      },

      updateHideConvAvatar: async function (enabledHideConvAvatar) {
        await ZaDarkBrowser.saveExtensionSettings({ enabledHideConvAvatar });
        this.toggleBodyClassName("zadark-prv--conv-avatar", enabledHideConvAvatar);
        this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideConvAvatar[enabledHideConvAvatar]);
      },

      updateHideConvName: async function (enabledHideConvName) {
        await ZaDarkBrowser.saveExtensionSettings({ enabledHideConvName });
        this.toggleBodyClassName("zadark-prv--conv-name", enabledHideConvName);
        this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideConvName[enabledHideConvName]);
      },

      updateHideThreadChatMessage: async function (enabledHideThreadChatMessage) {
        await ZaDarkBrowser.saveExtensionSettings({ enabledHideThreadChatMessage });
        this.toggleBodyClassName("zadark-prv--thread-chat-message", enabledHideThreadChatMessage);
        this.showToast(this.HOTKEYS_TOAST_MESSAGE.hideThreadChatMessage[enabledHideThreadChatMessage]);
      },

      updateUseHotkeys: async function (useHotkeys) {
        await ZaDarkBrowser.saveExtensionSettings({ useHotkeys });
        this.showToast(this.HOTKEYS_TOAST_MESSAGE.useHotkeys[useHotkeys]);
        this.setUseHotkeysAttr(useHotkeys);
      },

      debounce: (func, delay) => {
        let timer;
        return () => {
          clearTimeout(timer);
          timer = setTimeout(func, delay);
        };
      },
    };

    window.matchMedia("(prefers-color-scheme: dark)").addListener(function (event) {
      ZaDarkBrowser.getExtensionSettings().then(({ theme }) => {
        if (theme === "auto") {
          ZaDarkUtils.setThemeAttr(event.matches ? "dark" : "dark");
        }
      });
    });

    global.ZaDarkUtils = ZaDarkUtils;
  }
)(this);
document.documentElement.setAttribute("data-zadark-theme", "dark");
