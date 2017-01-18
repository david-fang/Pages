function processBookmark(bookmarks) {
    for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];

        // if (bookmark.url) {
        //     if (bookmark.url === "chrome://bookmarks/") {
        //         continue;
        //     } else {
        //         appendToTable(bookmark);
        //     }
        // } else if (bookmark.children) {
        //     processBookmark(bookmark.children);
        // }
        // 

        if (bookmark.children) {

            if (bookmark.title && bookmark.parentId !== "0") {
                appendToTable(bookmark);
            }

            processBookmark(bookmark.children);
        }
    }
}

function getTabUrl() {
    chrome.tabs.getSelected(null, function(tab) {
        return tab.url;
    });
}

function getTabTitle() {
    chrome.tabs.getSelected(null, function(tab) {
        return tab.title;
    })
}

function appendToTable(bookmark) {
    var bookmarksTable = document.getElementById("bookmarks-table");
    var row = bookmarksTable.insertRow(-1);
    row.setAttribute("class", "clickable-row");

    var cell = row.insertCell(0);
    cell.innerHTML = bookmark.title.trunc(29);
}

function bookmarkPage() {
    var curUrl = chrome.tabs.getSelected(null, function(tab) {
        return tab.url;
    });

    var defaultTitle = getTabTitle();

    var h = document.getElementById("info");
    h.innerHTML = curUrl;


    chrome.bookmarks.create({'title': defaultTitle, 'url': curUrl});
}

String.prototype.trunc = String.prototype.trunc ||
    function(n) {
        return (this.length > n) ? this.substr(0, n-1)
            + '&hellip;' : this;
    }

document.addEventListener("DOMContentLoaded", function(event) {
    chrome.bookmarks.getTree(processBookmark);
    document.getElementById("bookmark-button").onclick = bookmarkPage;
});

