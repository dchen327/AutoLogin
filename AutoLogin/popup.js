const selectorInput = document.getElementById("selectorInput");
const addNewSelector = document.getElementById("addNewSelector");

// grab the base URL (to use as key in storage)
const getTabURL = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new URL(tab.url).origin;
};

const getSelectors = async () => {
  let url = await getTabURL();
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({ [url]: [] }, (res) => {
      resolve(res[url] + "HELLO");
    });
  });
};

addNewSelector.addEventListener("click", async (e) => {
  e.preventDefault();
  let url = await getTabURL();
  let selector = selectorInput.value;
  selectorInput.value = "";
  await chrome.storage.sync.set({ [url]: [selector] });
});

const setupPopup = async () => {
  let selectors = await getSelectors();
  alert(selectors);
};
// TODO: render selectors in popup with delete button

setupPopup();
