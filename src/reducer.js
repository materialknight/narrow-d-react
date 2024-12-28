export default function reducer(superlist, action) {
   const updated_superlist = { ...superlist }

   switch (action.type)
   {
      case "LOAD_SUPERLIST": {
         return action.superlist
      }
      case "ADD_SITE": {
         const { list_index, new_site } = action
         const updated_sublist = updated_superlist.lists[list_index]

         updated_sublist.sites.push(new_site)

         sort_obj_arr(
            updated_sublist.sites,
            "origin",
            updated_sublist.ascending_order
         )
         return updated_superlist
      }
      case "DELETE_SITE": {
         const { list_index, site_index } = action
         updated_superlist.lists[list_index].sites.splice(site_index, 1)
         return updated_superlist
      }

      case "CREATE_LIST": {
         const { list_name } = action
         const prev_active_list = updated_superlist.lists.find(list => list.active)

         if (prev_active_list)
         {
            prev_active_list.active = false
         }

         updated_superlist.lists.push({ list_name, sites: [], inclusive: true, ascending_order: true, active: true })

         sort_obj_arr(
            updated_superlist.lists,
            "list_name",
            updated_superlist.ascending_order
         )

         return updated_superlist
      }
      case "DELETE_LIST": {
         const { list_index } = action
         updated_superlist.lists.splice(list_index, 1)

         return updated_superlist
      }
      case "EDIT_LIST_NAME": {
         const { list_index, new_list_name } = action
         updated_superlist.lists[list_index].list_name = new_list_name

         sort_obj_arr(
            updated_superlist.lists,
            "list_name",
            updated_superlist.ascending_order
         )
         return updated_superlist
      }
      case "REVERSE_SUBLIST": {
         const { list_index } = action
         const reversed_sublist = updated_superlist.lists[list_index]

         reversed_sublist.ascending_order = !reversed_sublist.ascending_order
         reversed_sublist.sites.reverse()

         return updated_superlist
      }
      case "REVERSE_SUPERLIST": {
         updated_superlist.ascending_order = !updated_superlist.ascending_order
         updated_superlist.lists.reverse()

         return updated_superlist
      }
      case "CHECK_UNCHECK": {
         const { list_index, site_index } = action
         const site = updated_superlist.lists[list_index].sites[site_index]
         site.checked = !site.checked

         return updated_superlist
      }
      case "CHECK_UNCHECK_ALL": {
         const { list_index, change_ev } = action
         const check_all = change_ev.target.checked
         const sites = updated_superlist.lists[list_index].sites

         for (const site of sites)
         {
            site.checked = check_all
         }

         return updated_superlist
      }
      case "CHANGE_TAB": {
         const { list_name } = action

         for (const list of updated_superlist.lists)
         {
            list.active = list.list_name === list_name
         }

         return updated_superlist
      }
      case "TOGGLE_LIST_MODE": {
         const { list_index } = action
         const list = updated_superlist.lists[list_index]
         list.inclusive = !list.inclusive

         return updated_superlist
      }
      default: console.error(`Unknown action type: ${action.type}`)
   }
}

function sort_obj_arr(arr, obj_key, asc = true) {
   if (asc)
   {
      arr.sort((a, b) => {
         if (a[obj_key] < b[obj_key]) return -1
         if (a[obj_key] > b[obj_key]) return 1
         return 0
      })
   }
   else
   {
      arr.sort((a, b) => {
         if (a[obj_key] < b[obj_key]) return 1
         if (a[obj_key] > b[obj_key]) return -1
         return 0
      })
   }
}