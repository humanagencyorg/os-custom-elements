import { ALLOWED_FILE_TYPES, ATTRIBUTES, CLASSNAMES } from "../utils/constants";
import { Uploader } from "../utils/uploader";

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const uuid = this.getAttribute(ATTRIBUTES.uuid);
    const fieldErrorEl = document.querySelector(`[${ATTRIBUTES.for}="${uuid}"]`);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ALLOWED_FILE_TYPES;
    this.appendChild(fileInput);

    const signedIdInput = document.createElement("input");
    signedIdInput.type = "hidden";
    this.appendChild(signedIdInput);

    const showFieldError = (text) => {
      if (fieldErrorEl) {
        this._showElement(fieldErrorEl);
        fieldErrorEl.innerText = text;
      } else {
        console.warn(
          `field-error element for data-os-uuid ${uuid} was not found`,
        );
      }
    };

    const resetElements = () => {
      this._resetElement(fieldErrorEl);
      signedIdInput.value = "";
    };

    const handleUpload = (error, blob) => {
      const signedId = blob?.signed_id;

      if (error) {
        showFieldError(error);
      } else {
        signedIdInput.value = signedId;
      }
    };

    fileInput.addEventListener("change", async (event) => {
      resetElements();
      const file = event.target.files[0];
      const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes

      if (file) {
        if (file.size > maxSizeInBytes) {
          const fileSizeMsg =
            "File size exceeds the limit of 25MB. Please select a smaller file.";
          showFieldError(fileSizeMsg);
        } else {
          const uploader = new Uploader(
            file,
            // TODO: change the host
            "https://avala-3461.formliapp.com/rails/active_storage/direct_uploads",
            () => {},
            handleUpload,
          );

          uploader.start();
        }
      }
    });
  }

  _getElement(attr) {
    return document.querySelector(`[${ATTRIBUTES.element}="${attr}"]`);
  }

  _showElement(el) {
    if (el) {
      el.classList.remove(CLASSNAMES.hidden);
    }
  }

  _resetElement(el) {
    if (el) {
      el.classList.add(CLASSNAMES.hidden);
      el.innerText = "";
    }
  }
}
