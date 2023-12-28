import { OSFileUpload } from "./components/file_upload.js";
import { OSCountry } from "./components/country.js";

(function (window, undefined) {
  customElements.define("os-file-upload", OSFileUpload);
  customElements.define("os-country", OSCountry);
})(window);
