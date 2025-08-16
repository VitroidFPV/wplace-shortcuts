// ==UserScript==
// @name         WPlace Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Keyboard shortcuts and enhancements for WPlace drawing
// @author       Vitroid
// @match        https://wplace.live/
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  "use strict";
  (function() {
    class ColorShortcuts {
      // milliseconds to collect numbers
      constructor() {
        this.lastKeyPress = "";
        this.lastKeyTime = 0;
        this.doublePressTimeout = 500;
        this.waitingForNumber = false;
        this.numberTimeout = null;
        this.collectedNumbers = "";
        this.numberCollectionTimeout = 500;
        this.init();
      }
      init() {
        console.log("Color Shortcuts initialized - Double-tap C followed by a number");
        this.bindEvents();
      }
      bindEvents() {
        document.addEventListener("keydown", (event) => {
          if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
            return;
          }
          this.handleKeyPress(event);
        });
      }
      handleKeyPress(event) {
        const key = event.key.toLowerCase();
        const currentTime = Date.now();
        if (key === "c") {
          if (this.lastKeyPress === "c" && currentTime - this.lastKeyTime < this.doublePressTimeout) {
            event.preventDefault();
            this.startNumberWait();
            this.lastKeyPress = "";
            return;
          }
          this.lastKeyPress = "c";
          this.lastKeyTime = currentTime;
          return;
        }
        if (this.waitingForNumber && this.isNumberKey(key)) {
          event.preventDefault();
          this.addNumberToCollection(key);
          return;
        }
        if (key !== "c") {
          this.resetState();
        }
      }
      startNumberWait() {
        this.waitingForNumber = true;
        this.collectedNumbers = "";
        console.log("Double-C detected! Press number(s) (0-9) to click color element");
        if (this.numberTimeout) {
          clearTimeout(this.numberTimeout);
        }
        this.numberTimeout = setTimeout(() => {
          console.log("Number timeout - resetting");
          this.resetState();
        }, 3e3);
      }
      isNumberKey(key) {
        return /^[0-9]$/.test(key);
      }
      addNumberToCollection(number) {
        this.collectedNumbers += number;
        console.log(`Collected: ${this.collectedNumbers}`);
        this.showFeedback(`Number: ${this.collectedNumbers}`, "info");
        if (this.numberTimeout) {
          clearTimeout(this.numberTimeout);
        }
        this.numberTimeout = setTimeout(() => {
          this.clickColorElement(this.collectedNumbers);
          this.resetState();
        }, this.numberCollectionTimeout);
      }
      clickColorElement(number) {
        const elementId = `color-${number}`;
        const element = document.getElementById(elementId);
        if (element) {
          console.log(`Clicking element: ${elementId}`);
          element.click();
          this.showFeedback(`Clicked ${elementId}`, "success");
        } else {
          console.log(`Element not found: ${elementId}`);
          this.showFeedback(`Element ${elementId} not found`, "error");
        }
      }
      showFeedback(message, type) {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 5px;
                color: white;
                font-family: Arial, sans-serif;
                font-size: 14px;
                z-index: 10000;
                transition: opacity 0.3s ease;
                background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
            `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        }, 2e3);
      }
      resetState() {
        this.waitingForNumber = false;
        this.lastKeyPress = "";
        this.collectedNumbers = "";
        if (this.numberTimeout) {
          clearTimeout(this.numberTimeout);
          this.numberTimeout = null;
        }
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        new ColorShortcuts();
      });
    } else {
      new ColorShortcuts();
    }
  })();
})();
