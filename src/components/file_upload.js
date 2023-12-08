import { ALLOWED_FILE_TYPES } from "../utils/constants";
import { Uploader } from "../utils/uploader";
import workspaceId from "../utils/workspace_id";

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ALLOWED_FILE_TYPES;
    this.appendChild(fileInput);

    const signedIdInput = document.createElement("input");
    signedIdInput.type = "hidden";
    this.appendChild(signedIdInput);

    const handleUpload = (error, blob) => {
      const signedId = blob?.signed_id;

      if (error) {
        this.dispatchEvent(
          new CustomEvent("upload-error", { detail: { error } }),
        );
      } else {
        this.dispatchEvent(new CustomEvent("upload-success"));
        signedIdInput.value = signedId;
      }
    };

    fileInput.addEventListener("change", async (event) => {
      signedIdInput.value = "";
      this.dispatchEvent(new CustomEvent("upload-change"));

      const file = event.target.files[0];
      const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes

      if (file) {
        if (file.size > maxSizeInBytes) {
          const text =
            "File size exceeds the limit of 25MB. Please select a smaller file.";
          this.dispatchEvent(
            new CustomEvent("upload-error", { detail: { error: text } }),
          );
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
  }
}
