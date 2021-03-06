const selectorInput = document.getElementById("selectorInput");
const addNewSelector = document.getElementById("addNewSelector");
const viewSettingsSelector = document.getElementById("viewSettings");
const toggleSelector = document.getElementById("toggleAutoLogin");

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
      <td>${selector.element}</td>
      <td class="has-text-right"><a id=selector${index} row=${index}>[x]</a></td>
    </tr>
    <tr>
      <td>
        <div class="field is-horizontal is-inline-flex-mobile">
          <div class="field-label is-tiny">
            <label class="label pr-2" style="white-space: nowrap">Delay (ms):</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input id=delay${index} class="input is-small" type="number" step=100 min=0 value=${selector.delay}>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal is-inline-flex-mobile">
          <div class="field-label is-small">
            <label class="label pr-2">Retry:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input id=retry${index} class="input is-small" type="number" min=0 max=5 value=${selector.retries}>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td class="has-text-right"><a id=edit${index} row=${index}>[Save]</a></td>
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
    document
      .getElementById(`edit${index}`)
      ?.addEventListener("click", saveEdits);
  }
  await renderToggleButton();
};

const renderToggleButton = async () => {
  await chrome.storage.sync.get({ enabled: true }, (res) => {
    if (res.enabled) {
      // show red disable button
      toggleSelector.classList.remove("is-success");
      toggleSelector.classList.add("is-danger");
      toggleSelector.innerHTML = "Disable";
    } else {
      // show green enable button
      toggleSelector.classList.remove("is-danger");
      toggleSelector.classList.add("is-success");
      toggleSelector.innerHTML = "Enable";
    }
  });
};

const saveEdits = async (e) => {
  e.preventDefault();
  let url = await getTabURL();
  const index = e.target.attributes.row.value;
  const delay = document.querySelector(`#delay${index}`).value;
  const retries = document.querySelector(`#retry${index}`).value;
  let selectors = await getSelectors();
  console.log(selectors);
  selectors[index].delay = parseInt(delay);
  selectors[index].retries = parseInt(retries);
  console.log(selectors);
  await chrome.storage.sync.set({ [url]: selectors });
};

const deleteSelector = async (e) => {
  e.preventDefault();
  let index = e.target.attributes.row.value;
  let url = await getTabURL();
  let selectors = await getSelectors();
  selectors.splice(index, 1);
  // update array, or delete if empty
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
  selectors.push({
    element: newSelector,
    retries: 2,
    delay: 0,
  });
  await chrome.storage.sync.set({ [url]: selectors });
  await renderPopup();
});

viewSettingsSelector.addEventListener("click", () => {
  chrome.tabs.create({ url: "overview.html" });
});

toggleSelector.addEventListener("click", async () => {
  // toggle enabled state
  await chrome.storage.sync.get({ enabled: true }, (res) => {
    chrome.storage.sync.set({ enabled: !res.enabled });
    renderToggleButton();
  });
});

renderPopup();
