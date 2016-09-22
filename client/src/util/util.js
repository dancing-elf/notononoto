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