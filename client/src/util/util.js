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
 * Highlight code blocks on page.
 * At first, this method always reset 'called' attribute of highlight.js
 * because we work with SPA and initHighlighting can be invoked on many
 * different pages which looks same for initHighlighting.
 * At second, this method should be invoked only one time after target
 * blocks rendered. It can be tricky, but otherwise highlight.js tags
 * will be added multiple times.
 * It's looks like highlightjs is not best choice for reactjs because
 * it's work with DOM, but I don't see real alternative (Prism?).
 */
export function highlight() {
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
}

/**
 * @param markdown post's markdown
 * @return {string} html
 */
export function makeHtml(markdown) {
    return new showdown.Converter().makeHtml(markdown);
}
