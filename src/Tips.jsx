import { useRef, useState } from "react"

export default function Tips({ setListsPage }) {

   const qr_code = useRef()
   const timeout = useRef(null)
   const [msgHidden, setMsgHidden] = useState(true)

   const copy_qr_code = () => {

      navigator.clipboard.writeText(qr_code.current.innerText)
      setMsgHidden(false)

      if (timeout.current)
      {
         clearTimeout(timeout.current)
      }

      timeout.current = setTimeout(() => {
         setMsgHidden(true)
      }, 1500)
   }

   return (
      <section className="tips">
         <button type="button" onClick={() => setListsPage(true)}>Go Back</button>
         <ol>
            <li>If you want NarrowD to use a different search engine, change your
               browser's search engine.</li>
            <li><kbd>Ctrl+Shift+Space</kbd> opens NarrowD's popup.</li>
            <li><kbd>Ctrl+Space</kbd> focuses the current site's search bar, so you can type in it right away (it doesn't work on every site, though).</li>
            <li>You can change the above keyboard shortcuts in your browser settings, look for something like: "Manage extensions" &gt; "Keyboard shortcuts".</li>
            <li>Try selecting some text in the current page, and then open NarrowD's popup. The text selected will be automatically pasted into the popup's search bar.</li>
            <li>While your active list has at least 1 check-marked site, if you select some text in the current page and right-click it, you'll see NarrowD's option in the context menu. Try it.</li>
            <li>You may tip me with any amount of Bitcoin, if you want:</li>
         </ol>
         <img src="./icons/QR_BTC.jpeg" alt="Bitcoin_Quick_Response_code" />
         <button type="button" name="copy_qr_btn" onClick={copy_qr_code} title="Copy QR Code">
            <span ref={qr_code}>3DgeHYTfif7Neg5eLVTNgxEPd2gSbq2Pzq</span>
            <span className="feedback" hidden={msgHidden}>Copied!</span>
         </button>
      </section>
   )
}