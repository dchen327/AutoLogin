const selectorInput = document.getElementById("selectorInput");
const addNewSelector = document.getElementById("addNewSelector");

// grab the base URL (to use as key in storage)
const getTabURL = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new URL(tab.url).origin;
};

const getSelectors = async () => {
  let url = await getTabURL();
  chrome.storage.sync.get({ [url]: [] }, (res) => {
    let selectors = res[url];
    alert(selectors);
  });
};

addNewSelector.addEventListener("click", async (e) => {
  e.preventDefault();
  let url = await getTabURL();
  let selector = selectorInput.value;
  // chrome.storage.sync.set({[url]: [selector]})
  selectorInput.value = "";
});

getSelectors();
