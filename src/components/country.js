import { workspaceId } from "../utils/script_attributes";

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

    fetch("https://avala-3480.formliapp.com/api/v1/countries", {
      headers: {
        "Workspace-Id": workspaceId,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const countries = await response.json();
          for (const [value, name] of Object.entries(countries)) {
            const option = document.createElement("option");
            option.textContent = name;
            option.value = value;
            selectEl.appendChild(option);
          }

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
