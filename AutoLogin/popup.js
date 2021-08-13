const selectorInput = document.getElementById("selectorInput");
const addNewSelector = document.getElementById("addNewSelector");

addNewSelector.addEventListener("click", async (e) => {
  e.preventDefault();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  alert(new URL(tab.url).origin);
  let selector = selectorInput.value;
  // let url = location.origin;
  // chrome.storage.sync.set()
  selectorInput.value = "";
});
