const sendDataToApp = (response) => {
  window.dispatchEvent(
    new CustomEvent("profileInfoReceived", { detail: response })
  );
};

const findLiAt = (cookies) => {
  return cookies.find((cookie) => cookie.name === "li_at");
};

window.addEventListener("getCookies", () => {
  console.log("Cookies event received");
  // Send a message to the background script
  chrome.runtime.sendMessage({ message: "getCookies" }, (response) => {
    if (response) {
      // Check if the "li_a" cookie exists
      console.log(response ,"this is the response");
      if (!findLiAt(response.data)) {
        sendDataToApp(null);
      } else if (findLiAt(response.data)) {
        sendDataToApp(response);
      } else {
        // "li_a" cookie not found, send a message to the background script to open the Sales Navigator page
        chrome.runtime.sendMessage(
          { message: "getProfileInfoWithSaleNavigator" },
          (response) => {
            sendDataToApp(response);
          }
        );
      }
    } else {
      console.error("No response received from the background script");
    }
  });
});


window.addEventListener("getExtension", () => {
    console.log("Extension event received");
  chrome.runtime.sendMessage({ message: "getExtensionInfo" }, (response) => {
    if (response) {
      window.dispatchEvent(
        new CustomEvent("extensionInfoReceived", { detail: response })
      );
    } else {
      console.error("No response received from the background script");
    }
  });
});

let lastMessage = null;
