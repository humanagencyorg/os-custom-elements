import { host, workspaceId } from "../utils/script_attributes";

export class OSTable extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const haveLoopAttribute = this.getAttribute("data-os-element") === "loop";
    const requestHost = host || "https://app.formli.com";

    if (haveLoopAttribute) {
      const responseViewUuid = this.getAttribute("data-os-view");
      fetch(
        `${requestHost}/api/v1/response_views/${responseViewUuid}/items`,
        {
          credentials: "include",
          headers: {
            "Workspace-Id": workspaceId,
          },
        },
      ).then(async (response) => {
        if (response.ok) {
          const { data } = await response.json();
          if (data.length > 0) {
            const table = document.createElement("table");
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");
            table.appendChild(thead);
            table.appendChild(tbody);
            // hide the empty element
            this.dispatchEvent(
              new CustomEvent("table-success", { detail: { element: this } }),
            );

            data.forEach((columns) => {
              const tableRow = document.createElement("tr");
              columns.forEach((column) => {
                const td = document.createElement("td");
                td.innerHTML = column.value;
                td.setAttribute("data-os-default", "column");
                td.setAttribute("data-os-column", column.uuid);
                tableRow.appendChild(td);
              });
              tbody.appendChild(tableRow);
            });

            this.appendChild(table);
          } else {
            // show the empty element
          }
        }
      }).catch((error) => {
        console.error(error);
        this.dispatchEvent(
          new CustomEvent("table-error", { detail: { error } }),
        );
      });
    }
  }
}

customElements.define("os-table", OSTable);
