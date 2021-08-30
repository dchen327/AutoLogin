const renderSelectorList = async () => {
  const selectorList = document.getElementById("selectorList");
  chrome.storage.sync.get(null, (allData) => {
    let row = 0;
    for (const [url, selectorInfo] of Object.entries(allData)) {
      // ignore toggle state data
      if (url === "enabled") continue;

      const websiteLabel = `<a href=${url} class="pt-1 has-text-weight-semibold" target="_blank">${url}</a>`;
      selectorList.insertAdjacentHTML("beforeend", websiteLabel);
      // render selectors in list
      selectorInfo.forEach((selector) => {
        let tr = `
          <tr>
            <td>${selector.element}</td>
            <td align="center">Delay: ${selector.delay}ms</td>
            <td align="center">Retries: ${selector.retries}</td>
          </tr>
        `;
        selectorList.insertAdjacentHTML("beforeend", tr);
        row++;
      });
    }
  });
};

renderSelectorList();
