import { ALLOWED_FILE_TYPES } from "../utils/constants";
import { Uploader } from "../utils/uploader";
import { host, workspaceId } from "../utils/script_attributes";

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = "true";
    fileInput.accept = ALLOWED_FILE_TYPES;
    this.appendChild(fileInput);

    const handleUpload = (error, blob) => {
      const signedId = blob?.signed_id;

      if (error) {
        this.dispatchEvent(
          new CustomEvent("upload-error", { detail: { error } }),
        );
      } else {
        this.dispatchEvent(new CustomEvent("upload-success"));
        const signedIdInput = document.createElement("input");
        signedIdInput.type = "hidden";
        signedIdInput.value = signedId;

        this.appendChild(signedIdInput);
      }
    };

    fileInput.addEventListener("change", async (event) => {
      this.dispatchEvent(new CustomEvent("upload-change"));
      this.removeSignedIdInputs();

      const files = Array.from(event.target.files);
      const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes

      files.forEach((file) => {
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
              handleUpload,
            );

            uploader.start();
          }
        }
      });
    });

    this.addEventListener("upload-reset", () => {
      this.removeSignedIdInputs();
      fileInput.value = "";
    });
  }

  removeSignedIdInputs() {
    const signedIdInputs = this.querySelectorAll("input[type='hidden']");
    signedIdInputs.forEach((input) => {
      this.removeChild(input);
    })
  }
}
