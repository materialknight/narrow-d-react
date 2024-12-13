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

   const [superlist, dispatch] = useReducer(reducer, null)
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
      <article id="list_container">
         <input type="search" autofocus spellcheck="false" />
         <button type="button" title="Search in marked sites">
            <img width="24" src="/icons/search_16dp300w.png" alt="" />
         </button>
         <button type="button" title="Create new list" onClick={() => create_list()}>
            <img width="24" src="/icons/playlist_add_16dp300w.png" alt="" />
         </button>
         <button onClick={() => setListsPage(prev => !prev)} >TIPS</button>
         <Lists superlist={superlist} dispatch={dispatch} />
      </article>
   )
}
