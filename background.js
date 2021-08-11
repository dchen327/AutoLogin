chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "updateIcon") {
    console.log("action received");
    chrome.browserAction.setIcon({ path: "icons/login128.png" });
    // change back to default icon after a delay
    setTimeout(() => {
      chrome.browserAction.setIcon({ path: "icons/icon128.png" });
    }, 5000);
  }
});
