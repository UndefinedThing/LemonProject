/**
 * Calls a funcion to calculate difference with actual time.
 * @param time
 * @type number A function that accepts only one argument. The fromDate method take a number in agrument that represents the number of seconds from the UNIX time start at 1 January 1970.
 * @returns A string "RESPONSE" which is the string to display to user
 */
export const fromDate = (time: number) => {
    let MINUTE = 60,
        HOUR = 3600,
        DAY = 43200,
        NORMALIZE = 1000,

        client_time = Math.round(Date.now() / NORMALIZE),
        rounded_time,
        elapsed_time,
        RESPONSE = 'Last message ';

    if (client_time < time) {
        client_time = time;
    }
    elapsed_time = (client_time - time);

    if (elapsed_time === 0) {
        RESPONSE += ' just a second ago';
    } else if ((elapsed_time > 0) && (elapsed_time < MINUTE)) {
        RESPONSE += (elapsed_time === 1) ? 'one second ago' : (elapsed_time + ' seconds ago');
    } else if ((elapsed_time >= MINUTE) && (elapsed_time < HOUR)) {
        rounded_time = Math.floor(elapsed_time / MINUTE);
        RESPONSE += (rounded_time === 1) ? 'one minute ago' : (rounded_time + ' minutes ago');
    } else if ((elapsed_time >= HOUR) && (elapsed_time < DAY)) {
        rounded_time = Math.floor(elapsed_time / HOUR);
        RESPONSE += (rounded_time === 1) ? 'one hour ago' : (rounded_time + ' hours ago');
    } else if ((elapsed_time >= DAY)) {
        rounded_time = new Date(time * NORMALIZE);
        RESPONSE += 'on ' + rounded_time.toLocaleDateString('en-US');
    }
    return RESPONSE;
}