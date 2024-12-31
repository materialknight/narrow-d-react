import { useReducer, useRef, useEffect } from "react"
import Lists from "./Lists.jsx"
import reducer from "./reducer"
import { Search_Icon, Playlist_Add_Icon, Sort_By_Alpha_Icon } from "./style/icons.jsx"

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

      const search_str = `"${search_input.current.value}"`
      const list_index = superlist?.lists.findIndex(list => list.active)
      // If list_index is undefined, it's the 1st render and the superlist has not loaded yet.
      // If list_index is -1, there is no active list because the last one was deleted.
      // In either case, there's nothing to add to the search string, so I search and return.
      if (list_index === undefined || list_index === -1)
      {
         chrome.search.query({ text: search_str })
         return
      }
      else
      {
         const { inclusive } = superlist.lists[list_index]

         const ticked_sites = superlist.lists[list_index].sites
            .filter(site => site.checked)
            .map(site => {
               const { hostname } = new URL(site.origin)
               return inclusive ? `site:${hostname}` : `-site:${hostname}`
            })
            .join(inclusive ? " | " : " ")

         chrome.search.query({ text: search_str.concat(inclusive ? ` (${ticked_sites})` : ` ${ticked_sites}`) })
         return
      }
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

   const [superlist, dispatch] = useReducer(reducer, null)
   const search_input = useRef()
   const superlist_just_loaded = useRef(true)

   useEffect(() => {
      if (superlist === null)
      {
         chrome.storage.local.get({
            "superlist": {
               lists: [{ list_name: "_unclassified", sites: [], inclusive: true, ascending_order: true, active: true }],
               ascending_order: true
            }
         }).then(({ superlist }) => {
            dispatch({ type: "LOAD_SUPERLIST", superlist })
         })

         chrome.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
               chrome.tabs.sendMessage(tabs[0].id, "GET_SELECTED_TEXT")
                  .then(selected_text => {
                     search_input.current.defaultValue = selected_text
                     search_input.current.select()
                  })
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
         <button type="button" title="Create new list" onClick={create_list}>
            <Playlist_Add_Icon fill="forestgreen" />
         </button>
         <button type="button" title="Reverse tags" onClick={reverse_superlist}>
            <Sort_By_Alpha_Icon fill="darkslateblue" />
         </button>
         <button onClick={() => setListsPage(prev => !prev)} >TIPS</button>
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
      </article>
   )
}
