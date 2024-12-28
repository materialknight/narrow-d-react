// Reminder:

// The advice of "always register event handlers at the global scope, and never within a promise" is bullshit.

// To send a message to the content script, use chrome.tabs.sendMessage() in the sending file, and chrome.runtime.onMessage.addListener() in the content script.

// To send a message to the service worker, use chrome.runtime.sendMessage() in the sending file, and chrome.runtime.onMessage.addListener() in the service worker.

chrome.runtime.onInstalled.addListener(migrate)
chrome.commands.onCommand.addListener(focus_search_bar)
chrome.tabs.onUpdated.addListener(set_action_icon)
chrome.runtime.onMessage.addListener(respond)

function migrate({ reason, previousVersion }) {
   if (reason !== "update" || previousVersion !== "1.0.0")
   {
      return
   }

   // Migration:

   chrome.storage.local.get({ "sites": [] }).then(({ sites }) => {
      if (sites.length === 0)
      {
         return
      }

      const sites_anew = sites.map(site => {
         const { favIconUrl, hostname, checked } = site
         return { fav_icon_URL: favIconUrl, origin: `https://${hostname}`, checked }
      })

      return chrome.storage.local.set({
         "superlist": {
            lists: [{ list_name: "_unclassified", sites: sites_anew, inclusive: true, ascending_order: true, active: true }],
            ascending_order: true
         }
      }).then(() => {
         return chrome.storage.local.remove("sites")
      })
   }).catch(error => {
      console.error(error)
   })
}

function focus_search_bar(command, tab) {
   if (command === 'go_to_page_search_bar')
   {
      chrome.tabs
         .sendMessage(tab.id, command)
         .catch(error => {
            console.warn("You can't go to the search bar of the browser's settings because that page can't have a content script. Here is the error message, in case you want to see it:")
            console.error(error)
         })
   }
}

function set_action_icon(tabId, changeInfo, tab) {
   if (!changeInfo.url)
   {
      return
   }

   const site_hostname_is_current_hostname = site => {
      const site_hostname = new URL(site.origin).hostname
      return site_hostname === current_hostname
   }

   const current_hostname = new URL(changeInfo.url).hostname

   chrome.storage.local.get({
      "superlist": {
         lists: [{ list_name: "_unclassified", sites: [], inclusive: true, ascending_order: true, active: true }],
         ascending_order: true
      }
   }).then(({ superlist }) => {
      const site_is_listed = superlist.lists.some(list => list.sites.some(site_hostname_is_current_hostname))
      if (site_is_listed)
      {
         chrome.action.setIcon({ path: "/icons/liked_16.png", tabId })
      }
   })
}

function respond(message, sender, sendResponse) {

   switch (message.type)
   {
      case "UPDATE_CONTEXT_MENU": {
         chrome.contextMenus.removeAll().then(() => {
            for (const site of message.active_list)
            {
               const hostname = new URL(site.origin).hostname

               chrome.contextMenus.create({
                  contexts: ["selection"],
                  title: hostname,
                  id: hostname
               })
            }
         })
         break
      }
      default: console.error(`Unknown message type: ${message.type}`)
   }
}

// const migration_test_obj = [
//    {
//       "checked": false,
//       "favIconUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABX1BMVEX///9HR0tTU1chICZGRUpDQkdEQ0gVFBrOzs/My80eHSNRUFT+/v4YFx0WFRvw8PE7Oj/29vb8/PwuLTLl5eZLSk8aGR6Uk5be3t8kIyh0c3b5+fkzMjhzcnaEhIeIh4pWVVrNzM68vL3Av8H5+fo/PkNnZmqvr7HQ0NF3d3p9fH83NjtjYmYjIierq601NDmfnqGOjpHr6+vX1tcnJiykpKZcW1+Qj5LFxcbW1tdsbG+1tLbg4ODY2NmgoKI8PEGYmJpYV1xSUlYxMDVQT1MbGiA/P0Sbm53S0tM8O0CsrK5xcHRpaGx5eHzj4+SxsbPs7OxgYGTCwcM2NTpOTVKpqKu5ubvy8vLt7e1/f4L6+vtIR0ynp6mDg4ZCQUaurq9MS1D09PTIyMleXmKKio23t7lHRkqrqqzT09T9/f2ysrTNzc5iYWVvbnJpaW0sKzC7u70pKC56eX3CwsQmJitiaC63AAABV0lEQVRIx+3VRVMDQRCG4Xc3sAOEEEhwEtzd3d3d3d3h/xeTymbn1lVcIXOaPjzVffh6BvXLQxL8DeCzbfvc7/e5ZbZtb/v9jgCW4OIJUtxyHs4gTQC78JjugalMKBZBRg68GrACwVsRbEDo24BNuEsVwQ58KQ8UHcKzCAL78GnAMpT4RDANRAxYg3clgnG4Vx6Y2YOoDIbh2oAJeHgTQY2e6NSAUUhXIiiD1SwPZOXCiQzqYU55wNL9skUQ1kGYNKAPCpUIGnQQ8g0YgQIZVEGr8sCWnihPBC3V0GzAAXQGRFAbC4IBl9CjRFAHlcoDHyHoFUF+UC+LAS+QkyGCcsgMG3ADQ0oE7VChPBBbvUERxIJQasCVXr1uEaTEg5AAx9CvRNARD4ILjtahUQZd8SC4IKr7NYmgzQ2CCxZhQImgyHGcgHtfsKxZx4kknirLGkt+KP8Q/ABoHVFTkXMUNgAAAABJRU5ErkJggg==",
//       "hostname": "developer.mozilla.org"
//    },
//    {
//       "checked": false,
//       "favIconUrl": "data:image/vnd.microsoft.icon;base64,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",
//       "hostname": "en.wiktionary.org"
//    }
// ]
