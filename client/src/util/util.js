import hljs from "highlight.js";
import showdown from "showdown";

/**
 * @param serverDate date in server format
 * @returns {string} japanese-style date string
 */
export function formatDate(serverDate) {
    const [time, date] = serverDate.split(" ");
    const [hour, minutes, ] = time.split("-");
    const [day, month, year] = date.split("-");
    return `${year}/${month}/${day} ${hour}:${minutes}`;
}

/**
 * @param original copied json object
 * @param changes new fields
 * @returns {*} copy of original json with necessary changes
 */
export function copy(original, changes) {
    return Object.assign({}, original, changes);
}

/**
 * Highlight note highlighted code blocks on page
 */
export function highlight() {
    const nodes = document.querySelectorAll("code:not(.hljs)");
    for (let i = 0; i < nodes.length; ++i) {
        hljs.highlightBlock(nodes[i]);
    }
}

/**
 * @param markdown post's markdown
 * @return {string} html
 */
export function makeHtml(markdown) {
    return new showdown.Converter().makeHtml(markdown);
}
