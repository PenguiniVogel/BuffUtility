// Start the extension

declare var g: BuffTypes.g;
declare var storedSettings: ExtensionSettings.SettingsProperties;

SchemaHelper.init();
ExtensionSettings.load();
CurrencyHelper.initialize();

storedSettings = ExtensionSettings.getAll();
