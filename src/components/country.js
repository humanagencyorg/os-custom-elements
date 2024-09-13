import { host, workspaceId } from "../utils/script_attributes";

export class OSCountry extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const defaultValue = this.getAttribute("value");
    const dataFieldUuid = this.getAttribute("data-os-uuid");
    const firstOptions = this.getAttribute("data-os-firstoptions");
    const selectEl = document.createElement("select");
    this.appendChild(selectEl);

    const emptyOption = this.createOption("", "");
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
            const data = await response.json();
            const countries = data.data;

            if (firstOptions) {
              const firstOptionsValues = firstOptions.split(",");
              // Move countries to the top of the list
              countries.sort((a, b) => {
                const aIndex = firstOptionsValues.indexOf(a.code);
                const bIndex = firstOptionsValues.indexOf(b.code);
                
                if (aIndex !== -1 && bIndex !== -1) {
                  return aIndex - bIndex;
                } else if (aIndex !== -1) {
                  return -1;
                } else if (bIndex !== -1) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }

            countries.forEach((country) => {
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
          this.dispatchEvent(
            new CustomEvent("country-error", { detail: { error }}),
          );
        });
    } else {
      console.warn("data-os-uuid was not found for <os-county> element");
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

customElements.define("os-country", OSCountry);
