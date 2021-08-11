// const loginButton1 = document.querySelector("#siteNavBar_loginToggle");  // first login
// const loginButton2 = document.querySelector("#siteNavBar_ctl00_btnLogin"); // second log-in (shows beneath first)
// if (loginButton1) loginButton1.click();
// if (loginButton2) loginButton2.click();

const signIn = (url) => {
  if (url in sites) {
    console.log("IN SITES:", url);
    let retryCount = 1;
    var intervalID = setInterval(() => {
      console.log("RUNNING INTERVALS");
      if (--retryCount <= 0) {
        clearInterval(intervalID);
      }
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

console.log("URL:", location.origin);
