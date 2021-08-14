const signIn = () => {
  let url = location.origin;
  chrome.storage.sync.get([url], (res) => {
    if (!(typeof res[url] === "undefined")) {
      let selectors = res[url];
      console.log("attempt to signin", new Date().getSeconds());
      // grab elements, convert to array to use .every()
      const elementsToClick = Array.from(document.querySelectorAll(selectors));
      console.log("elements", elementsToClick);
      // all elements present
      if (elementsToClick.length) {
        let signInButtonFound = false;
        elementsToClick.every((element) => {
          // avoid clicking sign out buttons (this needs improvement but idk how)
          const elementText = element.innerText.toLowerCase();
          if (elementText.includes("out")) {
            signInButtonFound = false; // ignore others
            return false; // break out of loop
          } else {
            try {
              // might give an error if element has inline js, so wrap in try/catch
              element.click();
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
        }
      }
    }
  });
};

window.addEventListener("load", () => {
  chrome.storage.sync.get({ enabled: true }, (res) => {
    if (res.enabled) signIn();
  });
});
