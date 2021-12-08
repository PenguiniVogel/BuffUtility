const BUFF_UTILITY_SETTINGS = 'BuffUtility_Settings';
const BUFF_UTILITY_LOADED_EVENT = 'BuffUtility_Loaded';

function say(data: string): void {
    console.log(data);
}

CurrencyHelper.initialize();

setTimeout(() => window.dispatchEvent(new Event(BUFF_UTILITY_LOADED_EVENT)), 1000);
