chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "updateIcon") {
    console.log("action received");
    chrome.action.setIcon({ path: "icons/login128.png" });
    // change back to default icon after a delay
    setTimeout(() => {
      chrome.action.setIcon({ path: "icons/icon128.png" });
    }, 5000);
  }
});
