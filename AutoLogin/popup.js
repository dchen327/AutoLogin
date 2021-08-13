const selectorInput = document.getElementById("selectorInput");
const addNewSelector = document.getElementById("addNewSelector");

addNewSelector.addEventListener("click", async (e) => {
  e.preventDefault();
  let selector = selectorInput.value;
  selectorInput.value = "";
});
