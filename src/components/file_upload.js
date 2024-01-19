import { ALLOWED_FILE_TYPES } from "../utils/constants";
import { Uploader } from "../utils/uploader";
import { host, workspaceId } from "../utils/script_attributes";

export class OSFileUpload extends HTMLElement {
  constructor() {
    super();
    this.uploadCounter = 0;
    this.totalFiles = 0;
    this.uploaders = [];
    this.completedUploadIds = [];
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
        // Abort all ongoing uploads
        this.uploaders.forEach((uploader) => uploader.abort());
        this.uploaders = [];
        this.completedUploadIds = [];

        uploadReset();
      } else {
        const signedIdInput = document.createElement("input");
        signedIdInput.type = "hidden";
        signedIdInput.value = signedId;
        this.completedUploadIds.push(signedId);

        this.appendChild(signedIdInput);
        // Remove the completed uploader from the list
        this.uploaders = this.uploaders.filter((u) => u.file.name !== blob.filename);
        if (this.uploadCounter === this.totalFiles) {
          this.dispatchEvent(new CustomEvent("upload-success", { detail: { completedUploadIds: this.completedUploadIds }}));
          this.uploadCounter = 0;
        }
      }
    };

    fileInput.addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("upload-change"));
      this.removeSignedIdInputs();

      const files = Array.from(event.target.files);

      this.totalFiles = files.length;
      this.uploadCounter = 0;
      this.uploaders = [];
      this.completedUploadIds = [];

      if (this.filesHaveCorrectSize(files)) {
        files.forEach((file) => {
          const requestHost = host || "https://app.formli.com";
          const uploader = new Uploader(
            file,
            `${requestHost}/rails/active_storage/direct_uploads?workspace_id=${workspaceId}`,
            () => {},
            handleUpload,
          );
          this.uploaders.push(uploader);
          uploader.start();
        });
      } else {
        const text =
          "File size exceeds the limit of 25MB. Please select a smaller file.";
        this.dispatchEvent(
          new CustomEvent("upload-error", { detail: { error: text } }),
        );
        uploadReset();
      }
    });

    const uploadReset = () => {
      this.removeSignedIdInputs();
      fileInput.value = "";
    };

    this.addEventListener("upload-reset", uploadReset);
  }

  removeSignedIdInputs() {
    const signedIdInputs = this.querySelectorAll("input[type='hidden']");
    signedIdInputs.forEach((input) => {
      this.removeChild(input);
    });
  }

  filesHaveCorrectSize(files) {
    const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes
    return files.every((file) => file.size <= maxSizeInBytes);
  }
}
