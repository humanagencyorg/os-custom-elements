import { host, workspaceId } from "../utils/script_attributes";

export class OSCountry extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    const defaultValue = this.getAttribute("value");
    const dataFieldUuid = this.getAttribute("data-os-uuid")
    const selectEl = document.createElement("select");
    this.appendChild(selectEl);

    console.log('script');
    const emptyOption = this.createOption("", "")
    selectEl.appendChild(emptyOption);

    const requestHost = host || "https://app.formli.com";

    if (dataFieldUuid) {
      fetch(`${requestHost}/api/v1/data_fields/${dataFieldUuid}/countries`, {
        headers: {
          "Workspace-Id": workspaceId,
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const countries = await response.json();

            countries.data.forEach((country) => {
              const option = this.createOption(country.name, country.code);
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
    } else {
      console.warn("data-os-uuid was not found for <os-county> element")
    }

    selectEl.addEventListener("change", (event) => {
      this.setAttribute("value", event.target.value);
    });
  }

  createOption(text, value) {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    return option;
  }
}
