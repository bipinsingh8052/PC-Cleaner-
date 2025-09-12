/* global chrome */
console.log("Background script loaded.");

chrome.runtime.onInstalled.addListener(() => {
  console.log("PC Cleaner Extension Installed");
});
