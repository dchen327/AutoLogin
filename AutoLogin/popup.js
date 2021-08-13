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

const renderPopup = async () => {
  const selectorList = document.getElementById("selectorList");
  let selectors = await getSelectors();
  let newListHTML = "";
  // render elements in list
  selectors.forEach((selector, index) => {
    let tr = `
    <tr>
      <td>${selector}</td>
      <td class="has-text-right"><a id=selector${index} row=${index}>[x]</a></td>
    </tr>
    `;
    newListHTML += tr;
  });
  selectorList.innerHTML = newListHTML; // update HTML
  // attach delete buttons to delete function
  for (let index = 0; index < selectors.length; index++) {
    document
      .getElementById(`selector${index}`)
      ?.addEventListener("click", deleteSelector);
  }
};

const deleteSelector = async (e) => {
  e.preventDefault();
  let index = e.target.attributes.row.value;
  let url = await getTabURL();
  let selectors = await getSelectors();
  selectors.splice(index, 1);
  if (selectors.length > 0) {
    await chrome.storage.sync.set({ [url]: selectors });
  } else {
    await chrome.storage.sync.remove([url]);
  }
  await renderPopup();
};

addNewSelector.addEventListener("click", async (e) => {
  e.preventDefault();
  let url = await getTabURL();
  let newSelector = selectorInput.value;
  selectorInput.value = "";
  let selectors = await getSelectors();
  selectors.push(newSelector);
  await chrome.storage.sync.set({ [url]: selectors });
  await renderPopup();
});

renderPopup();
