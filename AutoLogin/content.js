const signIn = () => {
  let url = location.origin;
  chrome.storage.sync.get([url], (res) => {
    if (!(typeof res[url] === "undefined")) {
      let selectorInfo = res[url];
      for (let selector of selectorInfo) {
        // contains element, retries, and delay
        let retryCount = selector.retries;
        let maxRetries = retryCount;
        setTimeout(() => {
          // delay before 1st click
          clickElement(selector.element, "", retryCount--, maxRetries);
          // retries
          let intervalID = setInterval(() => {
            clickElement(
              selector.element,
              intervalID,
              retryCount--,
              maxRetries
            );
          }, 2000);
        }, selector.delay);
      }
    }
  });
};

const clickElement = (selector, intervalID, retryCount, maxRetries) => {
  console.log("retry count: " + retryCount);
  if (retryCount <= 0) clearInterval(intervalID);
  // grab element
  const element = document.querySelector(selector);
  console.log("attempt to click: ", element, new Date().getSeconds());
  // all elements present
  if (element !== null) {
    // avoid clicking sign out buttons (this needs improvement but idk how)
    const elementText = element.innerText.toLowerCase();
    if (elementText.includes("out")) {
      clearInterval(intervalID);
      return false;
    } else {
      element.click();
      // login was clicked
      chrome.runtime.sendMessage({
        action: "updateIcon",
      });
      return true;
    }
  } else if (maxRetries - retryCount >= 2) {
    // element isn't present and page should be done loading
    clearInterval(intervalID);
    return false;
  }
};

window.addEventListener("load", () => {
  chrome.storage.sync.get({ enabled: true }, (res) => {
    if (res.enabled) signIn();
  });
});
