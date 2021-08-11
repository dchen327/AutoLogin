const signIn = (url) => {
  if (url in sites) {
    let retryCount = 2;
    var intervalID = setInterval(() => {
      if (retryCount-- <= 0) {
        clearInterval(intervalID);
      }
      console.log("attempt to signin");
      const elementsToClick = document.querySelectorAll(sites[url]);
      // all elements present
      if (elementsToClick.length === sites[url].length) {
        // elements have loaded
        elementsToClick.forEach((element) => {
          // avoid clicking sign out buttons
          const elementText = element.innerText.toLowerCase();
          if (!elementText.includes("out")) {
            element.click();
          }
        });
      }
    }, 1000); // check every second
  }
};

signIn(location.origin);
