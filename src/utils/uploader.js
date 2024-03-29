import { DirectUpload } from "@rails/activestorage";

export class Uploader {
  constructor(file, url, onProgress, onComplete) {
    this.file = file;
    this.url = url;
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.upload = new DirectUpload(this.file, this.url, this);
    this.xhr = null;
  }

  start() {
    this.upload.create(this.onComplete);
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  directUploadWillStoreFileWithXHR(request) {
    this.xhr = request;
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
