let workspaceId, host;

const currentScript = document.currentScript;
if (currentScript) {
  const workspaceIdRegex = /[?&]workspace-id=([^&]+)/;
  const hostRegex = /[?&]host=([^&]+)/;
  workspaceId = getUrlParam(currentScript.src, workspaceIdRegex);
  host = getUrlParam(currentScript.src, hostRegex);
}

function getUrlParam(url, regex) {
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }
}

export { workspaceId, host };
