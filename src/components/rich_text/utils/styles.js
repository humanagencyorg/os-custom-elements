export const defaultStyles = `
<style>
  .rich-text-container > * {
    box-sizing: border-box;
  }
  .rich-text-input {
    border: 1px solid #ccc;
    padding: 2px 8px;
    outline: none;
  }
  .hovering-toolbar {
    padding: 4px;
    position: absolute;
    z-index: 1;
    top: -10000px;
    left: -10000px;
    display: flex;
    align-items: center;
    opacity: 0;
    background-color: #fff;
    border-radius: 4px;
    transition: opacity 0.5s;
    box-shadow: 0 0 5px #ddd;
  }
  .hovering-toolbar-button {
    cursor: pointer;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin: 0 3px;
    border-radius: 4px;
  }
  .hovering-toolbar-button:hover {
    background-color: #f5f5f5;
  }
  .hovering-toolbar-button-active {
    background-color: #d3e3fd;
  }
  .hovering-toolbar-button-active:hover {
    background-color: #d3e3fd;
  }
  .hovering-toolbar-icon {
    width: 20px;
    height: 20px;
  }
  .hovering-heading-menu {
    display: block;
    position: absolute;
    top: 40px;
    margin: 0;
    width: 130px;
    z-index: 1;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 5px #ddd;
  }
  .hovering-heading-menu-item {
    padding: 8px 16px;
    font-weight: 500;
    color: #333;
    background-color: #fff;
    cursor: pointer;
  }
  .hovering-heading-menu-item-active {
    background-color: #f5f5f5;
  }
  .hovering-heading-menu-item:first-child {
    border-radius: 4px 4px 0 0;
  }
  .hovering-heading-menu-item:last-child {
    border-radius: 0 0 4px 4px;
  }
  .hovering-heading-menu-item:hover {
    background-color: #f5f5f5;
  }
  .hovering-link-modal {
    position: absolute;
    display: flex;
    align-items: center;
    z-index: 2;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 5px #ddd;
    color: #444;
    padding: 6px 10px;
    white-space: nowrap;
    top: 40px;
    left: 60px;
  }
  .hovering-link-modal > * {
    box-sizing: border-box;
  }
  .hovering-link-modal-input {
    border: 1px solid #ccc;
    font-size: 13px;
    height: 26px;
    margin: 0;
    margin-right: 5px;
    padding: 3px 5px;
    width: 170px;
  }
  .os-hidden {
    display: none;
  }
</style>
`;
