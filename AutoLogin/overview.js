const renderSelectorList = async () => {
  const selectorList = document.getElementById("selectorList");
  chrome.storage.sync.get(null, (allData) => {
    console.log(allData);
    let row = 0;
    for (const [url, selectors] of Object.entries(allData)) {
      // ignore toggle state data
      if (url === "enabled") continue;
      const websiteLabel = `<a href=${url} class="pt-1 has-text-weight-semibold" target="_blank">${url}</a>`;
      selectorList.insertAdjacentHTML("beforeend", websiteLabel);
      // render selectors in list
      selectors.forEach((selector) => {
        let tr = `
          <tr>
            <td id}>${selector}</td>
          </tr>
        `;
        selectorList.insertAdjacentHTML("beforeend", tr);
        row++;
      });
    }
  });
};

renderSelectorList();
