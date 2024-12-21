import { useReducer, useRef, useEffect } from "react"
import Lists from "./Lists.jsx"
import reducer from "./reducer"

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

   const change_tab = (change_ev) => {
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
         const ticked_sites = superlist.lists[list_index].sites
            .filter(site => site.checked)
            .map(site => `site:${new URL(site.origin).hostname}`)
            .join(" | ")

         chrome.search.query({ text: `${search_str} (${ticked_sites})` })
         return
      }
   }

   const [superlist, dispatch] = useReducer(reducer, null)
   const search_input = useRef()
   const superlist_just_loaded = useRef(true)

   useEffect(() => {
      if (superlist === null)
      {
         chrome.storage.local.get("superlist").then(({ superlist }) => {
            dispatch({ type: "LOAD_LISTS", superlist })
         })
      }
      else if (superlist_just_loaded.current)
      {
         superlist_just_loaded.current = false
      }
      else
      {
         chrome.storage.local.set({ superlist })
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
         <button>
            <img src="/icons/toggle_off.svg" alt="" />
         </button>
         <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#A96424"><path d="M288-260q-91.67 0-155.83-64.14Q68-388.28 68-479.91q0-91.63 64.17-155.86Q196.33-700 288-700h384q91.67 0 155.83 64.14Q892-571.72 892-480.09q0 91.63-64.17 155.86Q763.67-260 672-260H288Zm0-52h384q70 0 119-49t49-119q0-70-49-119t-119-49H288q-70 0-119 49t-49 119q0 70 49 119t119 49Zm-.05-58q45.82 0 77.93-32.07Q398-434.14 398-479.95q0-45.82-32.07-77.93Q333.86-590 288.05-590q-45.82 0-77.93 32.07Q178-525.86 178-480.05q0 45.82 32.07 77.93Q242.14-370 287.95-370ZM480-480Z" /></svg>
         </button>
         <button type="button" title="Search in marked sites" onClick={search_in_list}>
            <img width="24" src="/icons/search_16dp300w.png" alt="" />
         </button>
         <button type="button" title="Create new list" onClick={create_list}>
            <img width="24" src="/icons/playlist_add_16dp300w.png" alt="" />
         </button>
         <button type="button" title="Reverse tags" onClick={reverse_superlist}>
            <img width="24" src="/icons/sort_by_alpha_16dp300w.png" alt="" />
         </button>
         <button onClick={() => setListsPage(prev => !prev)} >TIPS</button>
         <nav className="tabs">{superlist?.lists.map(({ list_name, active }, list_index) => {
            const id = `tab_${list_index}`
            return (
               <>
                  <input type="radio" hidden id={id} name="active_tab" value={list_name} onChange={change_tab} checked={active} />
                  <label htmlFor={id}>{list_name}</label>
               </>
            )
         })}</nav>
         <Lists superlist={superlist} dispatch={dispatch} />
      </article>
   )
}
