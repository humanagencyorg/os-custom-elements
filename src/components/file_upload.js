import { ALLOWED_FILE_TYPES } from "../utils/constants";
import { Uploader } from "../utils/uploader";
import { host, workspaceId } from "../utils/script_attributes";

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
    this.uploadCounter = 0;
    this.totalFiles = 0;
  }

  connectedCallback() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = "true";
    fileInput.accept = ALLOWED_FILE_TYPES;
    this.appendChild(fileInput);

    const handleUpload = (error, blob) => {
      this.uploadCounter++;
      const signedId = blob?.signed_id;

      if (error) {
        this.dispatchEvent(
          new CustomEvent("upload-error", { detail: { error } }),
        );
      } else {
        const signedIdInput = document.createElement("input");
        signedIdInput.type = "hidden";
        signedIdInput.value = signedId;

        this.appendChild(signedIdInput);
        if (this.uploadCounter === this.totalFiles) {
          console.log('WOW')
          this.dispatchEvent(new CustomEvent("upload-success"));
          this.uploadCounter = 0;
        }
      }
    };

    fileInput.addEventListener("change", async (event) => {
      this.dispatchEvent(new CustomEvent("upload-change"));
      this.removeSignedIdInputs();

      const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes
      const files = Array.from(event.target.files);

      this.totalFiles = files.length;
      this.uploadCounter = 0;

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
