chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "updateIcon") {
    console.log("action received");
    chrome.browserAction.setIcon({ path: "icons/login.png" });
  }
});
