const signIn = () => {
  let url = location.origin;
  chrome.storage.sync.get([url], (res) => {
    if (!(typeof res[url] === "undefined")) {
      let selectors = res[url];
      let retryCount = 3;
      let intervalID = setInterval(() => {
        if (retryCount-- <= 0) {
          clearInterval(intervalID);
        }
        console.log("attempt to signin", new Date().getSeconds());
        // grab elements, convert to array to use .every()
        const elementsToClick = Array.from(
          document.querySelectorAll(selectors)
        );
        // all elements present
        if (elementsToClick.length) {
          // elements have loaded
          let signInButtonFound = false;
          elementsToClick.every((element) => {
            // avoid clicking sign out buttons
            const elementText = element.innerText.toLowerCase();
            if (elementText.includes("out")) {
              clearInterval(intervalID);
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
        } else {
          clearInterval(intervalID);
        }
      }, 3000); // wait in ms before retrying
    }
  });
};

const getAllData = () => {
  chrome.storage.sync.get(null, (all) => {
    console.log(all);
  });
};

signIn();
