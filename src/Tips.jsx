
export default function Tips() {
   return (
      <section>
         <a href="index.html">Go Back</a>
         <ol>
            <li>If you want NarrowD to use a different search engine, change your
               browser"s default search engine.</li>
            <li>If your search throws no results, try removing the quotation marks (in the results
               page).</li>
            <li><kbd>Ctrl + Shift + Space</kbd> opens NarrowD.</li>
            <li><kbd>Ctrl + Space</kbd> focuses the current site"s search bar,
               if any (it doesn"t work
               on
               every site, though) and gives it an orange outline while focused (this is disabled by default in
               Google
               Chrome, but you can enable it in "Manage extensions" &gt; "Keyboard shortcuts").
            </li>
            <li>If you search too many sites, the search engine will inform you that it ignored part of the generated
               string. If you don"t want that, uncheck some sites that produced poor results before repeating the search,
               so
               that no part of that string is ignored.</li>
         </ol>
         <img src="./icons/QR_BTC.jpeg" alt="Bitcoin_Quick_Response_code" />
         <button type="button" name="copy_qr_btn"
            title="Copy QR Code">3DgeHYTfif7Neg5eLVTNgxEPd2gSbq2Pzq<span>Copied!</span></button>
      </section>
   )
}