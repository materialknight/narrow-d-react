import { useReducer, useRef, useEffect, useState } from "react"
import Lists from "./Lists.jsx"
import reducer from "./reducer"
import { Search_Icon, Playlist_Add_Icon, Sort_By_Alpha_Icon, Settings_Icon, Close_Icon } from "./style/icons.jsx"

export default function ListContainer({ setListsPage }) {

   const create_list = () => {
      let list_name = prompt("What's the name of the new list?")

      if (!list_name)
      {
         return
      }

      list_name = list_name.trim()
      const duplicate_list_name = superlist.lists.some(list => list.list_name === list_name)

      if (duplicate_list_name)
      {
         alert(`There is already a list called "${list_name}"`)
         return
      }
      dispatch({ type: "CREATE_LIST", list_name })
   }

   const reverse_superlist = () => {
      dispatch({ type: "REVERSE_SUPERLIST" })
   }

   const change_tab = change_ev => {
      const list_name = change_ev.target.value
      dispatch({ type: "CHANGE_TAB", list_name })
   }

   const search_in_list = () => {

      const search_str = settings["exact_results"]
         ? `"${search_input.current.value}"`
         : `${search_input.current.value}`

      const disposition = settings["from_popup_to_new_tab"] ? "NEW_TAB" : "CURRENT_TAB"

      const list_index = superlist?.lists.findIndex(list => list.active)
      // If list_index is undefined, it's the 1st render and the superlist has not loaded yet.
      // If list_index is -1, there is no active list because the last one was deleted.
      // In either case, there's nothing to add to the search string, so I search and return.
      if (list_index === undefined || list_index === -1)
      {
         chrome.search.query({ text: search_str, disposition })
         return
      }

      let ticked_sites = superlist.lists[list_index].sites.filter(site => site.checked)

      if (ticked_sites.length === 0)
      {
         chrome.search.query({ text: search_str, disposition })
         return
      }

      const { inclusive } = superlist.lists[list_index]

      ticked_sites = ticked_sites.map(site => {
         const { hostname } = new URL(site.origin)
         return inclusive ? `site:${hostname}` : `-site:${hostname}`
      })
         .join(inclusive ? " | " : " ")

      chrome.search.query({
         text: search_str.concat(inclusive ? ` (${ticked_sites})` : ` ${ticked_sites}`),
         disposition
      })
      return
   }

   const update_context_menu = () => {
      const active_list = superlist.lists.find(list => list.active)

      if (active_list)
      {
         chrome.runtime.sendMessage({
            type: "UPDATE_CONTEXT_MENU",
            checked_sites: active_list.sites.filter(site => site.checked),
            inclusive: active_list.inclusive
         })
      }
   }

   const toggle_setting = (setting) => {
      setSettings(prev_settings => {
         const updated_settings = { ...prev_settings }
         updated_settings[setting] = !updated_settings[setting]

         chrome.storage.local.set({ "settings": updated_settings }).then(update_context_menu)

         return updated_settings
      })
   }

   const [superlist, dispatch] = useReducer(reducer, null)
   const search_input = useRef()
   const superlist_just_loaded = useRef(true)
   const [settings, setSettings] = useState(null)
   const settings_popover = useRef()

   useEffect(() => {
      if (superlist === null)
      {
         chrome.storage.local.get({
            "superlist": {
               lists: [{ list_name: "_unclassified", sites: [], inclusive: true, ascending_order: true, active: true }],
               ascending_order: true
            }
         }).then(({ superlist }) => dispatch({ type: "LOAD_SUPERLIST", superlist }))

         chrome.storage.local.get({
            "settings": {
               "exact_results": true,
               "from_popup_to_new_tab": false,
               "from_context_menu_to_new_tab": true
            }
         }).then(({ settings }) => setSettings(settings))

         chrome.tabs.query({ active: true, currentWindow: true })
            .then(tabs => chrome.tabs.sendMessage(tabs[0].id, "GET_SELECTED_TEXT"))
            .then(selected_text => {
               search_input.current.defaultValue = selected_text
               search_input.current.select()
            })
            .catch(() => {
               console.log(`NarrowD's popup failed to send the message 'GET_SELECTED_TEXT', because this tab doesn't have a content script to receive it. NarrowD injects its content script when you navigate into a page of scheme 'http' or 'https'; that means that either:\n\n- This tab's page is not of scheme 'http' or 'https', or\n\n- NarrowD has been updated (thereby removing the previous content script) but it has not injected the new content script because you have not navigated in this tab since then (try refreshing the page).`)
            })
      }
      else if (superlist_just_loaded.current)
      {
         superlist_just_loaded.current = false
         update_context_menu()
      }
      else
      {
         chrome.storage.local.set({ superlist }).then(update_context_menu)
      }
   }, [superlist])

   return (
      <article className="list_container">
         <input type="search" autofocus="true" spellcheck="false" ref={search_input} onKeyDown={key_down_ev => {
            if (key_down_ev.key === "Enter")
            {
               search_in_list()
            }
         }} />
         <button type="button" title="Search in marked sites" onClick={search_in_list}>
            <Search_Icon fill="dodgerblue" />
         </button>
         <button type="button" title="Settings" popovertarget="settings_popover">
            <Settings_Icon fill="darkorange" />
         </button>
         <button type="button" title="Create new list" onClick={create_list}>
            <Playlist_Add_Icon fill="forestgreen" />
         </button>
         <button type="button" title="Reverse tags" onClick={reverse_superlist}>
            <Sort_By_Alpha_Icon fill="darkslateblue" />
         </button>
         <button type="button" onClick={() => setListsPage(false)} >TIPS</button>
         <nav className="tabs">{superlist?.lists.map(({ list_name, active, inclusive }, list_index) => {

            const id = `tab_${list_index}`

            return (
               <>
                  <input type="radio" hidden id={id} name="active_tab" value={list_name} onChange={change_tab} checked={active} />
                  <label htmlFor={id} className={inclusive ? "inclusive-tab" : "exclusive-tab"}>{list_name}</label>
               </>
            )
         })}</nav>

         <Lists superlist={superlist} dispatch={dispatch} />

         <div popover="auto" id="settings_popover" ref={settings_popover}>
            <div className="popover_body">
               <label>
                  <input type="checkbox" checked={settings?.["exact_results"]}
                     onChange={() => toggle_setting("exact_results")}
                  />
                  Look for exact results.
               </label>
               <label>
                  <input type="checkbox" checked={settings?.["from_popup_to_new_tab"]}
                     onChange={() => toggle_setting("from_popup_to_new_tab")}
                  />
                  Open a new tab for the popup's search bar results.
               </label>
               <label>
                  <input type="checkbox" checked={settings?.["from_context_menu_to_new_tab"]}
                     onChange={() => toggle_setting("from_context_menu_to_new_tab")}
                  />
                  Open a new tab for the context menu search results.
               </label>
               <button type="button" className="close_btn" title="Close settings"
                  onClick={() => settings_popover.current.hidePopover()}
               >
                  <Close_Icon fill="dodgerblue" />
               </button>
            </div>
         </div>
      </article>
   )
}
