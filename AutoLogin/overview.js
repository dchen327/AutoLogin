const renderSelectorList = async () => {
  const selectorList = document.getElementById("selectorList");
  chrome.storage.sync.get(null, (allData) => {
    let row = 0;
    for (const [url, selectors] of Object.entries(allData)) {
      const websiteLabel = `<a href=${url} class="pt-1 has-text-weight-semibold" target="_blank">${url}</a>`;
      selectorList.insertAdjacentHTML("beforeend", websiteLabel);
      // render selectors in list
      selectors.forEach((selector) => {
        let tr = `
          <tr>
            <td>${selector}</td>
            <td class="has-text-right"><a id=selector${row} row=${row}>[x]</a></td>
          </tr>
        `;
        selectorList.insertAdjacentHTML("beforeend", tr);
        // link delete function
        document
          .getElementById(`selector${row}`)
          ?.addEventListener("click", deleteSelector);
        row++;
      });
    }
  });
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
  await renderSelectorList();
};

renderSelectorList();
