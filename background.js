const sendCookie = (sendResponse) => {
  chrome.cookies.getAll(
    { domain: "linkedin.com" },
    function (cookies) {
      console.log(cookies);

      const extensionVersion = chrome.runtime.getManifest().version;
      if (Object.keys(cookies).length > 0) {
        sendResponse({ data: cookies, ver: extensionVersion });
      } else {
        sendResponse({ data: null });
      }
    }
  );
};


const sendExtensionInfo = (sendResponse) => {
  sendResponse({ data: true });
}

const refreshTabs = async () => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url && tab.url.includes('linkedin.com')) {
      chrome.tabs.reload(tab.id);
    }
  }
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    refreshTabs();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "getCookies") {
    sendCookie(sendResponse);
    return true;
  } else if (request.message === "getExtensionInfo") {
    sendExtensionInfo(sendResponse);
    return true;
  }
});
