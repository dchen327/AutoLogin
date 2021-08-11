const signIn = (url) => {
  if (url in sites) {
    let retryCount = 2;
    let intervalID = setInterval(() => {
      if (retryCount-- <= 0) {
        clearInterval(intervalID);
      }
      console.log("attempt to signin", new Date().getSeconds());
      const elementsToClick = document.querySelectorAll(sites[url]);
      // all elements present
      if (elementsToClick.length) {
        chrome.browserAction.setIcon({ default_icon: "icons/login.png" });
        // elements have loaded
        elementsToClick.forEach((element) => {
          // avoid clicking sign out buttons
          const elementText = element.innerText.toLowerCase();
          console.log(elementText);
          if (!elementText.includes("out")) {
            element.click();
          } else {
            chrome.browserAction.setIcon({ default_icon: "icons/icon.png" });
            clearInterval(intervalID);
          }
        });
      } else {
        clearInterval(intervalID);
      }
    }, 3000); // check every second
    console.log("done?");
  }
};

signIn(location.origin);
