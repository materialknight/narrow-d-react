# NarrowD

## Installation

You can install NarrowD from the [Chrome Web Store](https://chromewebstore.google.com/detail/narrowd/lldlnefpmdemkflnodmcpfabibaccogh).

## The main feature - WEB SEARCH FILTER

**Useful if you have a favorite set of sites to look for documentation, news, tutorials, articles, recipes, etc., or if you want to ignore sites with bad content that appear among the first search results.**

You can create site lists to filter NarrowD's web search results. How so?

You can add the site you're currently in to a list in NarrowD (if you do, NarrowD's icon will become green). You may create many lists, but the popup will only show one at a time, this is the "active list". A list can be in 1 of 2 modes: inclusive (green) or exclusive (red) (you can change the mode at any time).

When you do a web search in NarrowD, you'll get different results depending on the active list's mode (inclusive or exclusive) and its check-marked sites (every site listed has a checkbox that you can mark or unmark at any time), like this:

If the active list is inclusive (green), the results will try to match the exact text you typed, and only from the check-marked sites in the active list. For example:

Imagine that your active list is inclusive and has "documentation-site-1.com", "documentation-site-2.com" and "documentation-site-3.com", the first 2 are check-marked, and you look for the word "manifest".

In that case, the search results will only include exact matches for the word "manifest" from the 2 check-marked sites ("documentation-site-1.com" and "documentation-site-2.com"), meaning your results will be about the browser extension file that must be named "manifest.json" (which is likely what you want), and not about the definition of "manifest" nor about any movie, song or literary work named "manifest".

This feature saves you some typing when you're looking for a technical term that looks like a normal word (like "manifest") because, normally, in those cases, you have to provide some context for the search engine to understand what you're looking for (by writing "extension manifest json" instead of just "manifest", for example), but NarrowD allows you to narrow down the context to a closed site list beforehand.

On the other hand, if your active list is exclusive (red), the results will try to match the exact text you typed, but excluding all check-marked sites in the active list from the results. For example:

Imagine your active list is exclusive and has "news-site-1.com", "news-site-2.com" and "news-site-3.com", the first 2 are check-marked, and you look for some news event.

In that case, there will be no results from the first 2 sites ("news-site-1.com" and "news-site-2.com").

**NOTE**: If your query exceeds 32 words, your search engine might inform you that it only acknowledged the first 32, and ignored the rest. In that case, the number of words you type plus the number of check-marked sites of your active list should not exceed 32 (each site counts as 1 word).

## Secondary feature 1 - CONTEXT MENUS

**Useful if you're reading something in the browser but need to consult another site over and over. For example: When you're reading a difficult text and need to consult an online dictionary over and over, or when you're reading something that frequently references The Bible or cites from it, so you need to consult an online Bible over and over.**

In the current page, if you select some text and right-click it, the context menu will have the check-marked sites of your active list, such that:

If you click "dictionary-site.com" in the context menu and your active list is inclusive, NarrowD will do a web search looking for an exact match of the selected text, but only in "dictionary-site.com".

Or, if your active list is exclusive, NarrowD will do a web search looking for an exact match of the selected text, excluding "dictionary-site.com" from the results.

## Secondary feature 2 - COMMANDS

**For accessibility.**

**NOTE**: If the default keyboard shortcuts don't work, or if you want to change them, try setting the keyboard shortcuts manually in your browser settings; the location of this setting is different for each browser but it's something like: `Manage extensions > Keyboard shortcuts`.

### "Go to a search bar in the current page":

Default keyboard shortcut: `Ctrl + Space`

This command tries to find and focus a text input (the search bar, hopefully) in the current web page, so you can start typing in it right away. If there are several text inputs, you can loop through them by repeating the keyboard shortcut.

This command won't work in all sites, but it will work in many.

### "Activate the extension":

Default keyboard shortcut: `Ctrl + Shift + Space`

Opens the extension's popup, just like clicking the extension's icon.

## Secondary feature 3 - AUTOMATIC COPY-AND-PASTE.

If you select some text in the current page, and then you open the extension's popup in any way (with the above command or by clicking the extension's icon), the text selected will be copied and pasted into the popup's search bar.
