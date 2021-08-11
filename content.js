// const loginButton1 = document.querySelector("#siteNavBar_loginToggle");  // first login
// const loginButton2 = document.querySelector("#siteNavBar_ctl00_btnLogin"); // second log-in (shows beneath first)
// if (loginButton1) loginButton1.click();
// if (loginButton2) loginButton2.click();

const signIn = (url) => {
  if (url in sites) {
    console.log("IN SITES:", url);
    const elementsToClick = document.querySelectorAll(sites[url]);
    console.log(elementsToClick);
    elementsToClick.forEach((element) => {
      element.click();
    });
  }
};

signIn(location.origin);

console.log("URL:", location.origin);
