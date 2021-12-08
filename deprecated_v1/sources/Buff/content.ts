///<reference path="BuffUtility.ts"/>

/**
 * Copyright 2021 Felix Vogel
 * BuffUtility is not affiliated with buff.163.com or NetEase
 */
/** */

// Removes the indexedDB that was added with 1.0.5
// Encapsulated so the whole script doesnt break down just in case.
(() => {
    try {
        indexedDB.deleteDatabase('buff_utility_db');
    } catch {
        // ignore lol who cares
    }
})();

// Initialize BuffUtility
BuffUtility.init();

// pasting disclaimer
setTimeout(() => {
    console.log('%cHold Up!', 'font-size: 48px; color: #f00;');
    console.log('%cDont paste anything here, there is a 99% chance they are trying to scam you.', 'font-size: 24px;');
}, 1000);
