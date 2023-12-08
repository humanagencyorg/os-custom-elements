import { DirectUpload } from "@rails/activestorage";

export class Uploader {
  constructor(file, url, workspaceId, onProgress, onComplete) {
    const headers = { "Workspace-Id": workspaceId };
    this.file = file;
    this.url = url;
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.upload = new DirectUpload(this.file, this.url, this, headers);
  }

  start() {
    this.upload.create(this.onComplete);
  }

  directUploadWillStoreFileWithXHR(request) {
    request.upload.addEventListener(
      "progress",
      (event) => this.directUploadDidProgress(event),
    );
  }

  directUploadDidProgress(event) {
    if (this.onProgress) {
      const progress = Math.round(event.loaded / event.total * 100);
      this.onProgress(progress);
    }
  }
}
