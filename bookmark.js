/* Default scripts */

var e = null;

document.addEventListener("DOMContentLoaded", function(event) {
    e = document.getElementById("info");

    chrome.bookmarks.getTree(processFolders);
    setInitBookmarkState();
    document.getElementById("bookmark-button").onclick = bookmarkButtonHandler;
});


/** ====== BOOKMARK HANDLING FUNCTIONS ====== **/


/**
 * [Handler function] Processes all bookmark folders to table.
 * 
 * @param  {BookmarkTreeNode array} bookmarks
 */
function processFolders(bookmarks) {
    for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.children) {
            if (bookmark.title && bookmark.parentId !== "0") {
                appendToTable(bookmark);
            }

            processFolders(bookmark.children);
        }
    }
}

/**
 * [Handler function] Processes all bookmarks to bookmarks table.
 * 
 * @param {BookmarkTreeNode array} bookmarks
 */
function processBookmark(bookmarks) {
    for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
            if (bookmark.url === "chrome://bookmarks/") {
                continue;
            } else {
                appendToTable(bookmark);
            }
        } else if (bookmark.children) {
            processBookmark(bookmark.children);
        }
    }
}

/** 
 * Appends a bookmark to the bookmarks table. Each row in the table
 * is uniquely characterized by the ID of the row's respective bookmark.
 * 
 * @param {BookmarkTreeNode} [bookmark]
 */
function appendToTable(bookmark) {
    var bookmarksTable = document.getElementById("folders-table");
    var row = bookmarksTable.insertRow(-1);
    row.setAttribute("class", "clickable-row");
    row.setAttribute("id", bookmark.id);

    var cell = row.insertCell(0);
    cell.innerHTML = bookmark.title;
}

/**
 * Removes a bookmark from the bookmarks table. Table rows are
 * identified based on the ID of the row's respective bookmark.
 * 
 * @param  {BookmarkTreeNode} bookmark
 */
function removeFromTable(bookmark) {
    var row = document.getElementById(bookmark.id);
    row.parentNode.removeChild(row);
}

/**
 * Handles the behavior for the star icon button. If a bookmark
 * for the current page already exists, it removes the bookmark.
 * If no bookmark exists yet, it creates a bookmark for that page.
 */
function bookmarkButtonHandler() {
    chrome.tabs.getSelected(null, function(tab) {
        var query = { "url": tab.url };
        chrome.bookmarks.search(query, function(results) {
            if (results.length > 0) {
                destroyBookmark(results[0]);
            } else {
                createBookmark(tab);
            }
        });
    });
}

/**
 * Handles bookmark creation and appends bookmark to table. 
 * Updates star icon as appropriate.
 * 
 * @param  {Tab} tab -- an object representing the current tab
 */
function createBookmark(tab) {
    // FIXME -- Bookmarks are created w/ on default title and folder
    chrome.bookmarks.create({
        'title': tab.title,
        'url': tab.url
    }, function(bookmark) {
        appendToTable(bookmark);
        changeBookmarkedState(true);
    });
}

/**
 * Handles bookmark removal and removes bookmark from table.
 * Updates star icon as appropriate.
 * 
 * @param  {BookmarkTreeNode} bookmark
 */
function destroyBookmark(bookmark) {
    chrome.bookmarks.remove(bookmark.id, function() {
        removeFromTable(bookmark);
        changeBookmarkedState(false);
    });
}

/**
 * Initializes the star icon to the appropriate state: white, if
 * no bookmark exists for the current page; gold, otherwise
 */
function setInitBookmarkState() {
    chrome.tabs.getSelected(null, function(tab) {
        var query = { "url": tab.url };
        chrome.bookmarks.search(query, function(results) {
            changeBookmarkedState(results.length > 0);
        })
    })
}

/**
 * Changes the star icon between gold and white.
 * @param  {boolean} on -- true if a bookmark exists; false, otherwise
 */
function changeBookmarkedState(on) {
    var starIcon = document.getElementById("bookmark-button");
    starIcon.src = on ? "images/gold_star_x38.png" : "images/white_star_x38.png"
}

