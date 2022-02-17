/**
 * A function that sets the default date and time to display in the WaypointModal form
 * Returns an array of size two containing two strings, todayDate, and timeNow.
 * @returns {Array}
 */
export default function todayDateAndTime() {
    const today = new Date();
    switch(String(today.getDate()).length) {
        case 1:
            var day = '0' + today.getDate();
            break;
        default:
            day = today.getDate();
    }
    switch(String(today.getMonth()).length) {
        case 1:
            var month = '0' + (1 + today.getMonth());
            break;
        default:
            month = 1 + today.getMonth();
    }    
    switch(String(today.getHours()).length) {
        case 1:
            var hours = '0' + today.getHours();
            break;
        default:
            hours = today.getHours();
    }
    switch(String(today.getMinutes()).length) {
        case 1:
            var minutes = '0' + today.getMinutes();
            break;
        default:
            minutes = today.getMinutes();
    }
    const todayDate = today.getFullYear() + '-' + month + '-' + day;
    const timeNow = hours + ':' + minutes;
    
    return [todayDate, timeNow];
}

/**
   * Function to format date and time from YYYY-MM-DD HH:MM:SS,
   * to DD/MM/YYYY, HH:MM(AM/PM)
   * @param {string} dateTime - The date and time (combined) in string format.
   * @returns {string}
   */
export function formatDateTime(dateTime) {
    let year = dateTime.slice(0, 4);
    let month = dateTime.slice(5, 7);
    let day = dateTime.slice(8, 10);
    let hour = dateTime.slice(11, 13);
    let minute = dateTime.slice(14, 16);
    if (Number(hour) > 12) {
        var ampm = 'pm';
        hour = Number(hour) - 12;
        return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
    else if (Number(hour) === 12) {
        ampm = 'pm';
        return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
    ampm = 'am';
    return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
}

/**
 * A function that formats the date to DD Month(In Full), YYYY
 * @param {string} date - The date in string format.
 * @returns {string}
 */
export function dateFormatter(date) {
    const monthDict = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }
    if ((date.indexOf('-')) !== -1) {
        var year = date.slice(0, 4);
        var month = date.slice(5, date.indexOf('-', 5));
        var day = date.slice(date.indexOf('-', 5) + 1);
    }
    else {
        day = date.slice(0, date.indexOf('/'));
        month = date.slice(date.indexOf('/') + 1, date.indexOf('/', 3))
        year = date.slice(-4)
    }
    return `${day} ${monthDict[month]} ${year}`;
}

/**
 * A function that takes the time (24h) in string format and converts it to 12 hour time.
 * @param {string} time - The time in string format
 * @returns {string}
 */
export function timeFormatter(time) {
    if (time.length === 5) {
        var hours = time.slice(0, time.indexOf(':'));
        var minutes = time.slice(time.indexOf(':') + 1);
        // To determine AM or PM
        if (Number(time.slice(0, 2)) < 12) {
            var ampm = 'AM';
        }
        else if (Number(time.slice(0, 2) > 12)) {
            hours = Number(hours) - 12;
            ampm = 'PM';
        }
        else {
            ampm = 'PM';
        }
    }
    else {
        hours = time.slice(0, time.indexOf(':'));
        minutes = time.slice(time.indexOf(':') + 1, time.indexOf(':') + 3);
        ampm = time.slice(-2).toUpperCase();
    }
    return `${hours}:${minutes} ${ampm}`;
}