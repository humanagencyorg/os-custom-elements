import { ALLOWED_FILE_TYPES, ATTRIBUTES, CLASSNAMES } from "../utils/constants";
import { Uploader } from "../utils/uploader";

let workspaceId;

const currentScript = document.currentScript;
if (currentScript) {
  workspaceId = getWorkspaceId(currentScript.src);
}

function getWorkspaceId(url) {
  const regex = /[?&]workspace-id=([^&]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }
}

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const uuid = this.getAttribute(ATTRIBUTES.uuid);
    const fieldErrorEl = this._selectFieldEl("field-error", uuid);
    const uploadSuccessEl = this._selectFieldEl("upload-success", uuid);
    const resetButtonEl = this._selectFieldEl("reset", uuid);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ALLOWED_FILE_TYPES;
    this.appendChild(fileInput);

    const signedIdInput = document.createElement("input");
    signedIdInput.type = "hidden";
    this.appendChild(signedIdInput);

    const showFieldError = (text) => {
      if (fieldErrorEl) {
        this._showEl(fieldErrorEl);
        fieldErrorEl.innerText = text;
      } else {
        this._consoleWarn("field-error", uuid);
      }
    };

    const showSuccessEl = (el, attr) => {
      if (el) {
        this._showEl(el);
      } else {
        this._consoleWarn(attr, uuid);
      }
    };

    const resetElements = () => {
      this._resetEl(fieldErrorEl);
      this._hideEl(uploadSuccessEl);
      this._hideEl(resetButtonEl);
      signedIdInput.value = "";
    };

    const handleUpload = (error, blob) => {
      const signedId = blob?.signed_id;

      if (error) {
        showFieldError(error);
      } else {
        showSuccessEl(uploadSuccessEl, "upload-success");
        showSuccessEl(resetButtonEl, "reset");
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
            workspaceId,
            () => {},
            handleUpload,
          );

          uploader.start();
        }
      }
    });

    if (resetButtonEl) {
      resetButtonEl.addEventListener("click", (event) => {
        event.preventDefault();
        fileInput.value = "";
        resetElements();
      });
    }
  }

  _showEl(el) {
    if (el) {
      el.classList.remove(CLASSNAMES.hidden);
    }
  }

  _hideEl(el) {
    if (el) {
      el.classList.add(CLASSNAMES.hidden);
    }
  }

  _resetEl(el) {
    if (el) {
      el.classList.add(CLASSNAMES.hidden);
      el.innerText = "";
    }
  }

  _selectFieldEl(attr, uuid) {
    return document.querySelector(
      `[${ATTRIBUTES.element}="${attr}"][${ATTRIBUTES.for}="${uuid}"]`,
    );
  }

  _consoleWarn(attr, uuid) {
    console.warn(
      `${attr} element for data-os-uuid ${uuid} was not found`,
    );
  }
}
