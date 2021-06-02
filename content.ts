/**
 * Author: Felix Vogel
 */

function removeIndexedDB() {
    try {
        indexedDB.deleteDatabase('buff_utility_db');
    } catch {
        // ignore lol who cares
    }
}

removeIndexedDB();

/**
 * Initialize BuffUtility
 */
BuffUtility.init();

// pasting disclaimer
setTimeout(() => {
    console.log('%cHold Up!', 'font-size: 48px; color: #f00;');
    console.log('%cDont paste anything here, there is a 99% chance they are trying to scam you.', 'font-size: 24px;');
}, 1000);
