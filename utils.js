const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Logger = Me.imports.logger;
const Gio = imports.gi.Gio;

function getSettings() {
    let schemaDir = Me.dir.get_child('schemas').get_path();
    let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir, Gio.SettingsSchemaSource.get_default(), false);
    let schema = schemaSource.lookup(T1D_INDICATOR_SCHEMA, false);
    
    return new Gio.Settings({ settings_schema: schema });
}