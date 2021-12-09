const BUFF_UTILITY_SETTINGS = 'BuffUtility_Settings';
const BUFF_UTILITY_LOADED_EVENT = 'BuffUtility_Loaded';

const SYMBOL_YUAN = '¥';
const SYMBOL_ARROW_UP = '▲';
const SYMBOL_ARROW_DOWN = '▼';

ExtensionSettings.load();
CurrencyHelper.initialize();

// setTimeout(() => window.dispatchEvent(new Event(BUFF_UTILITY_LOADED_EVENT)), 1000);
