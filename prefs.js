const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Logger = Me.imports.logger;
const LibreAPI = Me.imports.libreViewApi;
const T1D_INDICATOR_SCHEMA = 'andre-oliveira.dev.t1d-indicator';

//journalctl -o cat -f /usr/bin/gjs

// Define the prefs widget
const PrefsWidget = GObject.registerClass(
    class PrefsWidget extends Gtk.Grid {
        _init(params) {
            super._init(params);
            this.margin = 20;
            this.row_spacing = 10;
            this.column_spacing = 10;
            this.column_homogeneous = true;

            this.settings = ExtensionUtils.getSettings();
            let username = this.settings.get_string('username');
            let password = this.settings.get_string('password');

            // Option 1
            let emailLabel = new Gtk.Label({ label: "Email:" });
            this.emailEntry = new Gtk.Entry();

            // Option 2
            let passwordLabel = new Gtk.Label({ label: "Password:" });
            this.passWordEntry = new Gtk.Entry({
                visibility: false,
                input_purpose: Gtk.InputPurpose.PASSWORD
            });

            this.emailEntry.set_text(username);
            this.passWordEntry.set_text(password);

            const button = new Gtk.Button({ label: 'Save' });
            button.connect('clicked', () => {
                this.saveSettings();
            });

            // Attach controls to the grid
            this.attach(emailLabel, 0, 0, 1, 1);
            this.attach(this.emailEntry, 1, 0, 1, 1);
            this.attach(passwordLabel, 0, 1, 1, 1);
            this.attach(this.passWordEntry, 1, 1, 1, 1);
            this.attach(button, 0, 2, 1, 1);
            // this.attach(entry, 1, 2, 1, 1);
        }
        saveSettings() {
            Logger.logMessage('saving');
            this.settings.set_string('username', this.emailEntry.text);
            this.settings.set_string('password', this.passWordEntry.text);
            let username = this.settings.get_string('username');
            let password = this.settings.get_string('password');
            let isLogin = LibreAPI.login(username, password);
        }
    });

// Build the preferences window
function buildPrefsWidget() {
    let widget = new PrefsWidget();
    widget.show_all();
    return widget;
}


function init() {
    Logger.logMessage('Preferences window');
}