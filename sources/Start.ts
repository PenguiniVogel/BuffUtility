// Start the extension

declare var storedSettings: ExtensionSettings.SettingsProperties;

ExtensionSettings.load();
CurrencyHelper.initialize();

storedSettings = ExtensionSettings.getAll();
