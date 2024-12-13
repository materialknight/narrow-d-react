import { useState, useEffect, useReducer, useRef } from "react"

export default function List({ superlist, dispatch }) {

   const add_site = (list_index, list_name) => {

      chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {

         const { favIconUrl, url, id } = tabs[0]
         const { origin } = new URL(url)

         if (superlist.lists[list_index].sites.some(site => site.origin === origin))
         {
            alert(`The site "${origin}" is already in the "${list_name}" list!`)
            return
         }

         return fetch(favIconUrl).then(fav_icon => fav_icon.blob()).then(fav_icon_blob => {

            let fav_icon_reader = new FileReader()

            fav_icon_reader.onload = () => {
               const new_site = { fav_icon_URL: fav_icon_reader.result, origin, checked: true }

               chrome.action.setIcon({ path: "/icons/liked_16.png", tabId: id })
               dispatch({ type: "ADD_SITE", list_index, new_site })
            }

            fav_icon_reader.readAsDataURL(fav_icon_blob)
         })
      })
   }

   const delete_site = (list_index, site_index) => {

      chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
         chrome.action.setIcon({ path: '/icons/unliked_16.png', tabId: tabs[0].id })
      })

      dispatch({ type: "DELETE_SITE", list_index, site_index })
   }

   const all_checked = sites => sites.every(site => site.checked)

   const delete_list = (list_index, list_name) => {
      const list_is_not_empty = superlist.lists[list_index].sites.length > 0

      if (list_is_not_empty)
      {
         const confirmed_deletion = confirm(`The "${list_name}" list is not empty. Are you sure you want to delete it?`)
         if (!confirmed_deletion)
         {
            return
         }
      }

      chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
         const { url, id } = tabs[0]
         const { origin } = new URL(url)
         const current_site_in_list_to_be_deleted = superlist.lists[list_index].sites
            .some(list => list.origin === origin)

         if (current_site_in_list_to_be_deleted)
         {
            chrome.action.setIcon({ path: '/icons/unliked_16.png', tabId: id })
         }

         dispatch({ type: "DELETE_LIST", list_index })
      })
   }

   const edit_list_name = (list_index, current_list_name) => {
      let new_list_name = prompt(`What's the new name of the list "${current_list_name}"?`)

      if (!new_list_name)
      {
         return
      }
      new_list_name = new_list_name.trim()

      if (superlist.lists.some(list => list.list_name === list_name))
      {
         dispatch({ type: "EDIT_LIST_NAME", list_index, new_list_name })
      }
   }

   const reverse_sites = (list_index) => {
      dispatch({ type: "REVERSE_SUBLIST", list_index })
   }

   return (
      <>{superlist?.lists.map(({ list_name, sites }, list_index) => {

         return (
            <article className="list" key={list_index}>
               <input type="checkbox" checked={all_checked(sites)} />

               <header>{list_name}</header>

               <button type="button" title="Add site to list" onClick={() => add_site(list_index, list_name)}>
                  <img width="24" src="/icons/add_16dp300w.png" alt="" />
               </button>
               <button type="button" title="Edit list name" onClick={() => edit_list_name(list_index, list_name)}>
                  <img width="24" src="/icons/edit_16dp300w.png" alt="" />
               </button>
               <button type="button" title="Delete list" onClick={() => delete_list(list_index, list_name)}>
                  <img width="24" src="/icons/delete_16dp300w.png" alt="" />
               </button>
               <button type="button" title="Reverse sites order" onClick={() => reverse_sites(list_index)}>
                  <img width="24" src="/icons/sort_by_alpha_16dp300w.png" alt="" />
               </button>

               <ol>{sites.map((site, site_index) => {

                  const { fav_icon_URL, origin, checked } = site
                  const { hostname } = new URL(origin)
                  // const shorter_hostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname
                  return (
                     <li key={site_index}>
                        <input type="checkbox" checked={checked} />
                        <img width="24" height="24" src={fav_icon_URL} alt="" className="favicon" />
                        <a href={origin} target="_blank">{hostname}</a>
                        <button type="button" title="Delete from list" onClick={() => delete_site(list_index, site_index)}>
                           <img width="24" src="/icons/delete_16dp300w.png" alt="" />
                        </button>
                        <button type="button" title="Move" className="move_btn">
                           <img width="24" src="/icons/move_item_16dp300w.png" alt="" />
                        </button>
                     </li>
                  )
               })}</ol>
            </article>
         )
      })}</>
   )
}