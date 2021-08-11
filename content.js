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
        elementsToClick.forEach((element) => {
          // avoid clicking sign out buttons
          const elementText = element.innerText.toLowerCase();
          console.log(elementText);
          if (!elementText.includes("out")) {
            element.click();
          } else {
            clearInterval(intervalID);
          }
        });
      } else {
        clearInterval(intervalID);
      }
    }, 2000); // check every second
  }
};

signIn(location.origin);
