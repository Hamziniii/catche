// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.local.set({
//         sessions: {
//             example: [
//                 "https://google.com",
//                 "https://youtube.com"
//             ]
//         }
//     })
// })

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
//         chrome.scripting.insertCSS({
//             target: { tabId: tabId },
//             files: ["./style.css"]
//         })
//             .then(() => {console.log("INJECTED THE FOREGROUND STYLES.")})
//             .catch(err => console.log(err))

//         chrome.scripting.executeScript({
//             target: { tabId: tabId },
//             files: ["./foreground.js"]
//         })
//             .then(() => {console.log("INJECTED THE FOREGROUND SCRIPT.")})
//             .catch(err => console.log(err))
//     }
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender)
    sendResponse(['potato!', request])
})