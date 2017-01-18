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

function appendToTable(bookmark) {
    var bookmarksTable = document.getElementById("bookmarks-table");
    var row = bookmarksTable.insertRow(-1);
    row.setAttribute("class", "clickable-row");

    var cell = row.insertCell(0);
    cell.innerHTML = bookmark.title.trunc(29);
}

String.prototype.trunc = String.prototype.trunc ||
    function(n) {
        return (this.length > n) ? this.substr(0, n-1)
            + '&hellip;' : this;
    }

document.addEventListener("DOMContentLoaded", function(event) {
    chrome.bookmarks.getTree(processBookmark);
});