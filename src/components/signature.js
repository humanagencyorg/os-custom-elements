import SignaturePad from "signature_pad";

export class OSSignature extends HTMLElement {
  static defaultStylesAdded = false;

  constructor() {
    super();
    this.defaultStyles = `
      <style>
        .signature-pad {
          background-color: #fff;
          border: 1px solid #ccc;
          flex-flow: column;
          width: 100%;
          max-width: 700px;
          height: 100%;
          max-height: 440px;
          padding: 16px;
          display: flex;
          position: fixed;
          top: 50%;
          bottom: 50%;
          left: 50%;
          right: 50%;
          transform: translate(-50%, -50%);
          box-shadow:
            0 1px 4px rgba(0, 0, 0, 0.27),
            inset 0 0 40px rgba(0, 0, 0, 0.08);
        }

        .signature-trigger {
          height: 60px;
          width: 150px;
          border: 1px solid #ccc;
          cursor: pointer;

          svg {
            max-width: 100%;
            max-height: 100%;
          }
        }

        .signature-pad-body {
          border: 1px solid #f4f4f4;
          flex: 1;
          display: flex;
          position: relative;
        }

        .signature-pad-body canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.02);
        }

        .signature-pad-footer {
          justify-content: space-between;
          margin-top: 8px;
          display: flex;
        }
      </style>
    `;
  }

  connectedCallback() {
    // Add default styles if they haven't been added yet
    if (!OSSignature.defaultStylesAdded) {
      document.head.insertAdjacentHTML(
        "afterbegin",
        this.defaultStyles,
      );

      OSSignature.defaultStylesAdded = true;
    }

    const triggerEl = document.createElement("div");
    triggerEl.classList.add("signature-trigger");
    this.appendChild(triggerEl);

    const padWrapper = document.createElement("div");
    const padBody = document.createElement("div");
    const padFooter = document.createElement("div");
    const canvas = document.createElement("canvas");
    const clearButton = document.createElement("button");
    const saveButton = document.createElement("button");

    padWrapper.classList.add("signature-pad");
    padWrapper.style.visibility = "hidden";
    padWrapper.style.zIndex = -1;
    padBody.classList.add("signature-pad-body");
    padFooter.classList.add("signature-pad-footer");
    clearButton.classList.add("signature-pad-clear-button");
    saveButton.classList.add("signature-pad-save-button");

    padWrapper.appendChild(padBody);
    padWrapper.appendChild(padFooter);
    padBody.appendChild(canvas);
    clearButton.textContent = "Clear";
    saveButton.textContent = "Save";
    padFooter.appendChild(clearButton);
    padFooter.appendChild(saveButton);

    this.appendChild(triggerEl);
    this.appendChild(padWrapper);

    const signaturePad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
    });

    function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      signaturePad.fromData(signaturePad.toData());
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function clear() {
      signaturePad.clear();
    }

    function close() {
      clear();
      padWrapper.style.zIndex = -1;
      padWrapper.style.visibility = "hidden";
    }

    clearButton.addEventListener("click", clear);

    saveButton.addEventListener("click", () => {
      const svg = signaturePad.toSVG();
      triggerEl.innerHTML = svg;
      close();
    });

    triggerEl.addEventListener("click", () => {
      padWrapper.style.zIndex = 100;
      padWrapper.style.visibility = "visible";
    });
  }
}
