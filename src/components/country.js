import { host, workspaceId } from "../utils/script_attributes";

export class OSCountry extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const defaultValue = this.getAttribute("value");
    const selectEl = document.createElement("select");
    this.appendChild(selectEl);

    const emptyOption = document.createElement("option");
    emptyOption.textContent = "";
    emptyOption.value = "";
    selectEl.appendChild(emptyOption);

    const requestHost = host || "https://avala-3480.formliapp.com";
    fetch(`${requestHost}/api/v1/countries`, {
      headers: {
        "Workspace-Id": workspaceId,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const countries = await response.json();

          countries.data.forEach((country) => {
            const option = document.createElement("option");
            option.textContent = country.name;
            option.value = country.code;
            selectEl.appendChild(option);
          });

          if (defaultValue) {
            selectEl.value = defaultValue;
          }
        } else {
          console.error("Something went wrong. Try again later.");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    selectEl.addEventListener("change", (event) => {
      this.setAttribute("value", event.target.value);
    });
  }
}
