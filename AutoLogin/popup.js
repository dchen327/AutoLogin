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
      resolve(res[url]);
    });
  });
};

const setupPopup = async () => {
  let selectors = await getSelectors();
  const selectorList = document.getElementById("selectorList");
  console.log(selectors);
  // show "None" in list of elements
  if (selectors.length === 0) selectors.push("None");
  // render elements in list
  selectors.forEach((selector) => {
    let li = `
    <li>${selector}</li>
    `;
    selectorList.insertAdjacentHTML("beforeend", li);
  });
};

const deleteSelector = async () => {};

addNewSelector.addEventListener("click", async (e) => {
  e.preventDefault();
  let url = await getTabURL();
  let newSelector = selectorInput.value;
  selectorInput.value = "";
  let selectors = await getSelectors();
  selectors.push(newSelector);
  await chrome.storage.sync.set({ [url]: selectors });
  window.close();
});

setupPopup();
