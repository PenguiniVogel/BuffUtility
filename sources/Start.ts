// Start the extension

declare var storedSettings: ExtensionSettings.SettingsProperties;

SchemaHelper.init();
ExtensionSettings.load();
CurrencyHelper.initialize();

storedSettings = ExtensionSettings.getAll();
