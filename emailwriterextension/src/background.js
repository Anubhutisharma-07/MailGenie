// Service Worker for Manifest V3
chrome.runtime.onInstalled.addListener(() => {
    console.log("MailGenie Service Worker Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateEmail") {
        // Implementation pending Epic 5 execution
        sendResponse({ status: "Received generate email request" });
    }
    return true; // Keep channel open for async response
});
