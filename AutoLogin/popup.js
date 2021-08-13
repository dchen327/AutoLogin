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
  // if (selectors.length === 0) selectors.push("None");
  // render elements in list
  selectors.forEach((selector) => {
    let tr = `
    <tr>
      <td>${selector}</td>
      <td><a id=${selector}>[x]</a></td>
    </tr>
    `;
    selectorList.insertAdjacentHTML("beforeend", tr);
    // attach delete button to delete function
    document.getElementById(selector).addEventListener("click", deleteSelector);
  });
};

const deleteSelector = async (e) => {
  e.preventDefault();
  let url = await getTabURL();
  const selector = e.target.id; // grab id from clicked element
  let selectors = await getSelectors();
  const index = selectors.indexOf(selector);
  if (index > -1) selectors.splice(index, 1);
  await chrome.storage.sync.set({ [url]: selectors });
  window.close();
};

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
