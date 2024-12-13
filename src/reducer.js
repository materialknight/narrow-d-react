//TODO: Simplify reducer by reducing repetition.

export default function reducer(superlist, action) {
   switch (action.type)
   {
      case "LOAD_LISTS": {
         return action.superlist ?? {
            lists: [{ list_name: "_unclassified", sites: [], inclusive: true, ascending_order: true }],
            active_lists: ["_unclassified"],
            ascending_order: true
         }
      }
      case "ADD_SITE": {
         const updated_superlist = { ...superlist }
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
         const updated_superlist = { ...superlist }
         const { list_index, site_index } = action

         updated_superlist.lists[list_index].sites.splice(site_index, 1)
         return updated_superlist
      }

      case "CREATE_LIST": {
         const updated_superlist = { ...superlist }
         const { list_name } = action

         updated_superlist.lists.push({ list_name, sites: [], inclusive: true, ascending_order: true })
         updated_superlist.active_lists = [list_name]

         sort_obj_arr(
            updated_superlist.lists,
            "list_name",
            updated_superlist.ascending_order
         )

         return updated_superlist
      }
      case "DELETE_LIST": {
         const updated_superlist = { ...superlist }
         const { list_index } = action

         updated_superlist.lists.splice(list_index, 1)

         //TODO: HOW TO CHANGE THE ACTIVE LIST.
         console.log(updated_superlist)

         return updated_superlist
      }
      case "EDIT_LIST_NAME": {
         const updated_superlist = { ...superlist }
         const { list_index, new_list_name } = action

         updated_superlist.lists[list_index].list_name = new_list_name
         return updated_superlist
      }
      case "REVERSE_SUBLIST": {
         const updated_superlist = { ...superlist }
         const { list_index } = action

         updated_superlist.lists[list_index].sites.reverse()
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