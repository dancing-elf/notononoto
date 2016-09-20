/**
 * @param serverDate date in server format
 * @returns {string} japanese-style date string
 */
export function formatDate(serverDate) {
    const [time, date] = serverDate.split(" ");
    const [hour, minutes, ] = time.split("-");
    const [day, month, year] = date.split("-");
    return `${hour}時${minutes}分 ${year}年${month}月${day}日`;
}

/**
 * @param original copied json object
 * @param changes new fields
 * @returns {*} copy of original json with necessary changes
 */
export function copy(original, changes) {
    return Object.assign({}, original, changes);
}