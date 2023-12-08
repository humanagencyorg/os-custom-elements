let workspaceId;

const currentScript = document.currentScript;
if (currentScript) {
  workspaceId = getWorkspaceId(currentScript.src);
}

function getWorkspaceId(url) {
  const regex = /[?&]workspace-id=([^&]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }
}

export default workspaceId;
