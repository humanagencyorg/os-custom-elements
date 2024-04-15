import { OSFileUpload } from "./components/file_upload.js";
import { OSCountry } from "./components/country.js";
import { OSSignature } from "./components/signature.js";

(function (window, undefined) {
  customElements.define("os-file-upload", OSFileUpload);
  customElements.define("os-country", OSCountry);
  customElements.define("os-signature", OSSignature);
})(window);
