/**
 * A function that sets the default date and time to display in the WaypointModal form
 * Returns an array of size two containing two strings, todayDate, and timeNow.
 * Utilised to set the default date and time in the dateTime React Hook.
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
   * Function to format date and time from YYYY-MM-DDTHH:MM:SS+08:00,
   * to DD/MM/YYYY, HH:MMam(pm)
   * Used when: Fetch data from Python ---> Saved to a ReactJS Hook
   * @param {string} dateTime - The date and time (combined) in string format.
   * @returns {string}
   */
export function formatDateTime(dateTime) {
    let year = dateTime.slice(0, 4);
    let month = dateTime.slice(5, 7);
    let day = dateTime.slice(8, 10);
    let hour = dateTime.slice(11, 13);
    let minute = dateTime.slice(14, 16);
    let ampm = 'pm';
    // Afternoon, 'pm', subtract by 12 to get 12 hour time
    if (Number(hour) > 12) {
        hour = Number(hour) - 12;
        return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
    // 12 noon, indicate as 'pm'
    else if (Number(hour) === 12) {
        return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
    // Before 12 noon, indicate as 'am'
    else {
        ampm = 'am';
        return `${day}/${month}/${year}, ${hour}:${minute}${ampm}`;
    }
}

/**
 * A function that formats the date to DD Month(In Full), YYYY
 * Used when: When adding a waypoint in CreateTrip, formats the date saved in the Waypoints prop (YYYY-MM-DD) and
 * formatting the date from the cached trips (DD/MM/YYYY)
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
 * Used when: Converting the 24h time saved in the Waypoints prop/Cache and converting it to AM/PM format.
 * @param {string} time - The time in string format
 * @returns {string}
 */
export function timeFormatter(time) {
    var hours = time.slice(0, time.indexOf(':'));
    var minutes = time.slice(time.indexOf(':') + 1, time.indexOf(':') + 3);
    // To determine AM or PM
    if (Number(hours) > 12) {
        hours = String(Number(hours) - 12);
        var ampm = 'PM';
    }
    else if (Number(hours) === 12) {
        ampm = 'PM';
    }
    else {
        // Add a leading zero for hours below 12
        ampm = 'AM';
    }
    return `${hours}:${minutes} ${ampm}`;
}
/**
 * Function that takes the cached date and formats it to HTML date
 * Application: Used in Trip page.
 * @param {string} date 
 * @returns {string}
 */
export function toHTMLDate(date) {
    let day = date.slice(0, 2);
    let month = date.slice(3, 5);
    let year = date.slice(6, 10);
    return `${year}-${month}-${day}`
}

/**
 * Function that takes the cached time and formats it to HTML time
 *  * Application: Used in Trip page.
 * @param {string} time 
 * @returns {string}
 */
export function toHTMLTime(time) {
    var hour = time.slice(12, time.indexOf(':'));
    if (time.indexOf('p') !== -1) {
        // hour is greater than 12
        if (Number(hour) !== 12) {
            hour = Number(hour) + 12
        }
    }
    var minute = time.slice(time.indexOf(':') + 1, -2);
    return `${hour}:${minute}`;
}