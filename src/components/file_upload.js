import { ALLOWED_FILE_TYPES } from "../utils/constants";
import { Uploader } from "../utils/uploader";
import { host, workspaceId } from "../utils/script_attributes";

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const fileInputWrapper = document.createElement("div");
    this.appendChild(fileInputWrapper);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ALLOWED_FILE_TYPES;
    fileInputWrapper.appendChild(fileInput);

    const handleUpload = (error, blob, wrapper) => {
      const signedId = blob?.signed_id;

      if (error) {
        this.dispatchEvent(
          new CustomEvent("upload-error", { detail: { error } }),
        );
      } else {
        const signedIdInput = document.createElement("input");
        signedIdInput.type = "hidden";
        signedIdInput.value = signedId;

        wrapper.appendChild(signedIdInput);
        this.dispatchEvent(new CustomEvent("upload-success"));
      }
    };

    fileInput.addEventListener("change", async (event) => {
      this.dispatchEvent(new CustomEvent("upload-change"));
      this.removeSignedIdInputs(fileInputWrapper);

      const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes
      const file = event.target.files[0];

      if (file) {
        if (file.size > maxSizeInBytes) {
          const text =
            "File size exceeds the limit of 25MB. Please select a smaller file.";
          this.dispatchEvent(
            new CustomEvent("upload-error", { detail: { error: text } }),
          );
        } else {
          const requestHost = host || "https://app.formli.com";
          const uploader = new Uploader(
            file,
            `${requestHost}/rails/active_storage/direct_uploads?workspace_id=${workspaceId}`,
            () => {},
            (error, blob) => handleUpload(error, blob, fileInputWrapper),
          );

          uploader.start();
        }
      }
    });

    this.addEventListener("upload-reset", () => {
      this.removeSignedIdInputs(this);
      const fileInputs = this.querySelectorAll("input[type='file']");
      fileInputs.forEach((input, index) => {
        if (index === 0) {
          input.value = "";
        } else {
          input.closest("div").remove();
        }
      });
    });
  }

  removeSignedIdInputs(container) {
    const signedIdInputs = container.querySelectorAll("input[type='hidden']");
    signedIdInputs.forEach((input) => {
      input.remove();
    });
  }
}
