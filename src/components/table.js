export class OSTable extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const haveLoopAttribute = this.getAttribute("data-os-element") === "loop";

    if (haveLoopAttribute) {
      this.addEventListener("table-success", (event) => {
        const data = event.detail.data;
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");
        table.appendChild(thead);
        table.appendChild(tbody);
        data.forEach((columns, index) => {
          const tbodyRow = document.createElement("tr");
          const theadRow = document.createElement("tr");
          columns.forEach((column) => {
            if (index === 0) {
              // create thead
              const th = document.createElement("th");
              th.innerHTML = column.name;
              theadRow.appendChild(th);
              thead.appendChild(theadRow);
            }
            // create tbody
            const td = document.createElement("td");
            td.innerHTML = column.value;
            td.setAttribute("data-os-default", "column");
            td.setAttribute("data-os-column", column.uuid);
            tbodyRow.appendChild(td);
          });
          tbody.appendChild(tbodyRow);
        });

        this.appendChild(table);
      });
    }
  }
}

customElements.define("os-table", OSTable);
