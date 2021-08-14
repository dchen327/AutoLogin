const signIn = () => {
  let url = location.origin;
  chrome.storage.sync.get([url], (res) => {
    if (!(typeof res[url] === "undefined")) {
      let selectors = res[url];
      let retryCount = 3;
      let maxRetries = retryCount;
      clickElements(selectors, "", retryCount--, maxRetries);
      let intervalID = setInterval(() => {
        clickElements(selectors, intervalID, retryCount--, maxRetries);
      }, 2000);
    }
  });
};

const clickElements = (selectors, intervalID, retryCount, maxRetries) => {
  if (retryCount <= 0) clearInterval(intervalID);
  // grab elements, convert to array to use .every()
  const elementsToClick = Array.from(document.querySelectorAll(selectors));
  // console.log("attempt to signin: ", new Date().getSeconds());
  // console.log("elements", elementsToClick);
  // all elements present
  if (elementsToClick.length) {
    let signInButtonFound = false;
    elementsToClick.every((element) => {
      // avoid clicking sign out buttons (this needs improvement but idk how)
      const elementText = element.innerText.toLowerCase();
      if (elementText.includes("out")) {
        clearInterval(intervalID);
        signInButtonFound = false; // ignore others
        return false; // break out of loop
      } else {
        try {
          // might give an error if element has inline js, so wrap in try/catch
          setTimeout(() => {
            // small timeout before click
            element.click();
          }, 250);
        } catch (error) {}
        signInButtonFound = true;
        return true; // continue the every()
      }
    });
    if (signInButtonFound) {
      // login was clicked
      chrome.runtime.sendMessage({
        action: "updateIcon",
      });
    } else {
      clearInterval(intervalID);
    }
  } else if (maxRetries - retryCount >= 2) {
    // element isn't present and page should be done loading
    clearInterval(intervalID);
  }
};

window.addEventListener("load", () => {
  chrome.storage.sync.get({ enabled: true }, (res) => {
    if (res.enabled) signIn();
  });
});
