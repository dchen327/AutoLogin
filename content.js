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
        // elements have loaded
        let signInButtonFound = false;
        elementsToClick.forEach((element) => {
          // avoid clicking sign out buttons
          const elementText = element.innerText.toLowerCase();
          if (!elementText.includes("out")) {
            element.click();
            signInButtonFound = true;
          } else {
            clearInterval(intervalID);
          }
        });
        if (signInButtonFound) {
          // login was clicked
          chrome.runtime.sendMessage({
            action: "updateIcon",
          });
        }
      } else {
        clearInterval(intervalID);
      }
    }, 3000); // wait in ms before retrying
  }
};

signIn(location.origin);
