# NarrowD

## The main feature - WEB SEARCH FILTER

**(Useful for people who have a favorite set of sites to look for documentation, news, tutorials, articles or general information, or for people who want to ignore sites with poor content that appear often among the first search results)**

You can add the site you're currently seeing to a list in this browser extension. You can have many lists, but the extension's popup can only display one list at a time, this is the "active list". A list can be inclusive (green) or exclusive (red); you can toggle the active list between those 2 modes at any time.

In the extension's popup, when you click the search button after entering some text in the search bar, the extension will do a web search with your browser's search engine. You'll get different results depending on the active list's mode (inclusive or exclusive) and its check-marked sites (every site listed has a checkbox that you can mark or unmark at any time), like this:

If the active list is inclusive (green), the search results will try to match the exact text you typed, and only from the check-marked sites in the active list. For example:

Imagine your active list is inclusive and has "documentation-site-1.com", "documentation-site-2.com" and "documentation-site-3.com", the first 2 are check-marked, and you look for the word "manifest" in the extension's search bar.

In that case, the search results will only include exact matches for the word "manifest" from the 2 check-marked sites ("documentation-site-1.com" and "documentation-site-2.com"), meaning your results will be about the browser extension file that must be named "manifest.json" (which is likely what you want), and not about the definition of "manifest" nor about any movie, song or literary work named "manifest".

The example above shows that this feature might help you write less when you search a technical term that looks like a normal word (like "manifest") because, normally, in those cases, you have to provide extra context for the search engine to understand what you're looking for (by writing "extension manifest json" instead of just "manifest", for example), but this extension allows you to narrow down the context to a closed site list beforehand.

On the other hand, if your active list is exclusive (red), the search results will try to match the exact text you typed, but excluding all check-marked sites in the active list from the results. For example:

Imagine your active list is exclusive and has "news-site-1.com", "news-site-2.com" and "news-site-3.com", the first 2 are check-marked, and you look for some news event.

In that case, there will be no results from the first 2 sites ("news-site-1.com" and "news-site-2.com").

Also, if the site you're currently in is already in some list, the extension's icon will become green.

## Secondary feature 1 - CONTEXT MENUS

**(Useful when you need to consult the same site over and over while reading something else in the browser, for example: When you need to consult an online dictionary over and over while you're reading a difficult text, or when you want to consult the verses of an online Bible over and over while you're reading a text that frequently cites from The Bible)**

When you select text, the check-marked sites of the active list will appear in the context menu, then:

If you click a site in the context menu and your active list is inclusive, the extension will do a web search looking for an exact match of the selected text, but only in the clicked site.

On the other hand, if your active list is exclusive, the extension will do a web search looking for an exact match of the selected text, excluding the clicked site from the results.

## Secondary feature 2 - COMMANDS (For accessibility. You can change the default mappings in your browser settings):

**NOTE**: If the default keyboard shortcuts don't work, or if you want to change them, try setting the keyboard shortcuts manually in your browser settings; the location of this setting is different for each browser but it's something like: `Manage extensions > Keyboard shortcuts`.

### "Go to a search bar in the current page":

Default keyboard shortcut: `Ctrl + Space`

This command tries to find a text input in the current web page (which is likely the search bar) and then focus it, so you can start typing in the search bar right away. If there are several text inputs, you can loop through them by repeating the command. This command won't work in all pages because I can't anticipate every possible way someone might have implemented a search bar, but it will work for many sites.

### "Activate the extension":

Default keyboard shortcut: `Ctrl + Shift + Space`

Opens the extension's popup, just like clicking the extension's icon.
