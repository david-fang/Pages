/** 
 * Truncates long strings up to n characters.
 * @param {int} n -- number of characters admissible before
 *                   truncating
 */
String.prototype.trunc = String.prototype.trunc ||
    function(n) {
        return (this.length > n) ? this.substr(0, n-1)
            + '&hellip;' : this;
    }