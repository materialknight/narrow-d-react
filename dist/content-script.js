"use strict"

//! A content script is somewhat isolated from the rest of the extension, and can only use these chrome APIs:

// dom
// i18n
// storage
// runtime.connect()
// runtime.getManifest()
// runtime.getURL()
// runtime.id
// runtime.onConnect
// runtime.onMessage
// runtime.sendMessage()

//! Notice that, among other things, you can't use:

// search
// commands
// tabs

//! If you want the content script to do something in response to a keyboard command, you must:

// - In manifest.json, define the command:

// {
//    ...
//    "commands": {
//       "do_something": {
//          "suggested_key": {
//             "default": "Ctrl+Space",
//             "windows": "Ctrl+Space",
//             "linux": "Ctrl+Space"
//          },
//          "description": "Does something"
//       }
//    }
//    ...
// }

// - In the service worker, listen for keyboard commands with:

// chrome.commands.onCommand.addListener((command, tab) => {
//    ...
//    chrome.tabs.sendMessage(tab.id, command)
//    ...
// })

// In the handler above, chrome.tabs.sendMessage(tab.id, command) sends a message to the content script of the tab identified by tab.id. The popup's JS and the service worker MUST use chrome.tabs.sendMessage() to send a message to the content script.

// -In the content script, have a listener to handle the message:

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//    if (message === "do_something") console.log(message) // "do_something"
// })

//! Automatic searchs are apparently against Google's policies...

let text_input_index = 0

// If you discover a page is not loaded yet when the line below runs, move the line into the chrome.runtime.onMessage.addListener handler.
const text_inputs = Array.from(document.querySelectorAll("[type=search], [type=text], textarea"))

for (const input of text_inputs)
{
   input.addEventListener("blur", () => input.classList.remove("focused_input"))
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

   switch (message)
   {
      case "go_to_page_search_bar": {
         if (text_inputs.length === 0)
         {
            alert("Narrow D could not find a text input on this page.")
            return
         }

         const focused_input = text_inputs[text_input_index]

         focused_input.classList.add("focused_input")
         focused_input.focus()
         focused_input.select()

         text_input_index = text_input_index === text_inputs.length - 1 ? 0 : text_input_index + 1
         break
      }
      case "GET_SELECTED_TEXT": {
         sendResponse(window.getSelection().toString())
         break
      }
      default: console.error(`Unexpected message: ${message}`)
   }

})
