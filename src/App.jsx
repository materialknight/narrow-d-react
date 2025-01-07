import { StrictMode, createContext, useContext, useState } from "react"
import { createRoot } from "react-dom/client"

import ListContainer from "./ListContainer.jsx"
import Tips from "./Tips.jsx"

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <App />
   </StrictMode>
)

function App() {
   const [listsPage, setListsPage] = useState(true)

   return listsPage
      ? <ListContainer setListsPage={setListsPage} />
      : <Tips setListsPage={setListsPage} />
}