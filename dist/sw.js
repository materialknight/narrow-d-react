//* FUNCTIONS:
// TODO : USE STRICT MODE
const GET_storage = () => {
   return chrome.storage.local
      .get('sites')
      .then(response => {
         sites = response.sites ?? []
      })
}

const HANDLE_command = (command, tab) => {
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

const HANDLE_tab_update = (tabId, changeInfo, tab) => {

   if (changeInfo.url !== undefined)
   {

      let new_Hostname = changeInfo.url
      new_Hostname = new URL(new_Hostname)
      new_Hostname = new_Hostname.hostname

      const current_Site_Is_Already_Liked = sites.some(site => site.hostname === new_Hostname)

      if (current_Site_Is_Already_Liked)
      {
         chrome.action.setIcon({ path: './icons/liked_16.png', tabId })
         // URL_state = 'liked'
      } else
      {
         chrome.action.setIcon({ path: './icons/unliked_16.png', tabId }) // ?WATCH this was unliked_48.png
         // URL_state = 'unliked'
      }
   }
   // else if (URL_state === 'liked') {

   //    chrome.action.setIcon({ path: './liked_16.png', tabId })

   // }
}

//* GLOBAL VARIABLE + ACTION:

let sites = null
GET_storage().then(() => {
   chrome.commands.onCommand.addListener(HANDLE_command)
   chrome.storage.onChanged.addListener(GET_storage)
   chrome.tabs.onUpdated.addListener(HANDLE_tab_update)
})

// let URL_state = 'unliked'

//* EVENT LISTENERS:


