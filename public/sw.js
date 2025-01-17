// Reminder:

// The advice of "always register event handlers at the global scope, and never within a promise" is bullshit.

// To send a message to the content script, use chrome.tabs.sendMessage() in the sending file, and chrome.runtime.onMessage.addListener() in the content script.

// To send a message to the service worker, use chrome.runtime.sendMessage() in the sending file, and chrome.runtime.onMessage.addListener() in the service worker.

chrome.runtime.onInstalled.addListener(migrate)
chrome.commands.onCommand.addListener(focus_search_bar)
chrome.tabs.onUpdated.addListener(set_action_icon)
chrome.runtime.onMessage.addListener(respond)
chrome.contextMenus.onClicked.addListener(search_in_site)

function search_in_site(info, tab) {

   chrome.tabs.sendMessage(tab.id, "GET_SELECTED_TEXT")
      .then(selected_text => {
         const [list_type, hostname] = info.menuItemId.split("-")

         const search_str = list_type === "inclusive"
            ? `"${selected_text}" site:${hostname}`
            : `"${selected_text}" -site:${hostname}`

         return chrome.storage.local.get({
            "settings": {
               "exact_results": true,
               "from_popup_to_new_tab": false,
               "from_context_menu_to_new_tab": true
            }
         }).then(({ settings }) => {
            const disposition = settings["from_context_menu_to_new_tab"] ? "NEW_TAB" : "CURRENT_TAB"
            return chrome.search.query({ text: search_str, disposition })
         })
      }).catch(() => {
         console.log(`NarrowD's service worker failed to send the message 'GET_SELECTED_TEXT', because this tab doesn't have a content script to receive it. NarrowD injects its content script when you navigate into a page of scheme 'http' or 'https'; that means that either:\n\n- This tab's page is not of scheme 'http' or 'https', or\n\n- NarrowD has been updated (thereby removing the previous content script) but it has not injected the new content script because you have not navigated in this tab since then (try refreshing the page).`)
      })
}

function migrate({ reason, previousVersion }) {
   if (reason !== "update" || previousVersion !== "1.0.0")
   {
      return
   }

   // Migration from version 1.0.0:

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
         .catch(() => {
            console.log(`NarrowD's service worker failed to send the message '${command}', because this tab doesn't have a content script to receive it. NarrowD injects its content script when you navigate into a page of scheme 'http' or 'https'; that means that either:\n\n- This tab's page is not of scheme 'http' or 'https', or\n\n- NarrowD has been updated (thereby removing the previous content script) but it has not injected the new content script because you have not navigated in this tab since then (try refreshing the page).`)
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
            for (const site of message.checked_sites)
            {
               const hostname = new URL(site.origin).hostname

               chrome.contextMenus.create({
                  contexts: ["selection"],
                  title: (message.inclusive ? "in " : "not in ").concat(hostname),
                  id: (message.inclusive ? "inclusive-" : "exclusive-").concat(hostname)
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
//       "favIconUrl": "",
//       "hostname": "developer.mozilla.org"
//    },
//    {
//       "checked": false,
//       "favIconUrl": "",
//       "hostname": "en.wiktionary.org"
//    }
// ]
