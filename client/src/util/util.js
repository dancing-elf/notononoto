
function formatDate(serverDate) {
    const [time, date] = serverDate.split(" ");
    const [hour, minutes, ] = time.split("-");
    const [day, month, year] = date.split("-");
    return `${hour}時${minutes}分 ${year}年${month}月${day}日`;
}

export {formatDate};