const St = imports.gi.St;
const Lang = imports.lang;

const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Utils = Me.imports.utils;
const LibreAPI = Me.imports.libreViewApi;
const MyIndicator = Me.imports.indicator.MyIndicator;
const Logger = Me.imports.logger;

const T1D_INDICATOR_SCHEMA = 'andre-oliveira.dev.t1d-indicator';

const Mainloop = imports.mainloop;

let isLogin = false;
let indicator;
let patientIds = null;
let myPatientId = null;
let glucoseMeasurement = 0;
let trendValue = 3;
let targetHigh = 0;
let targetLow = 0;
let settings = ExtensionUtils.getSettings();


function init() {
    indicator = new MyIndicator();
            
    this.indicator.menu.addAction(_('Settings'),
            () => ExtensionUtils.openPrefs());

    Logger.logMessage('starting');
    login();
    if (isLogin) {
        refresh();
    } else {
        Logger.logMessage('Exit');
    }

}

function enable() {
    Main.panel.addToStatusArea(this.uuid, indicator);
}

function disable() {
    menu.destroy();
}

function refresh() {
    this.patientIds = LibreAPI.getPatientIds();
    getGlucoseReadingForPatient();
    Logger.logMessage('Glucose value in ml:' + glucoseMeasurement);
    Logger.logMessage('trend arrow:' + trendValue);
    updateUI();
    this._removeTimeout();
    this._timeout = Mainloop.timeout_add_seconds(60, Lang.bind(this, refresh));
    Logger.logMessage('Waiting 60 secs');
}

function _removeTimeout() {
    if (this._timeout) {
        Mainloop.source_remove(this._timeout);
        this._timeout = null;
    }
}

function updateUI() {
    indicator.setGlucoseLevel(glucoseMeasurement);
    indicator.setTrendIcon(trendValue);
}

function login() {
    let username = settings.get_string('username');
    let password = settings.get_string('password');
    isLogin = LibreAPI.login(username, password);
}

function getGlucoseReadingForPatient() {
    if (this.patientIds.data && this.patientIds.data.length > 0) {
        Logger.logMessage('More than one patient ID, grabbing the first');
        let firstPatientData = this.patientIds.data[0];
        myPatientId = this.patientIds.data[0].patientId;
        glucoseMeasurement = firstPatientData.glucoseMeasurement.ValueInMgPerDl;
        trendValue = firstPatientData.glucoseMeasurement.TrendArrow;
        if (targetHigh === 0 || targetLow ===0) {
            targetLow = firstPatientData.targetLow;
            targetHigh = firstPatientData.targetHigh;
            indicator.setTargetHigh(targetHigh);
            indicator.setTargetLow(targetLow);
        }
    } else {
        Logger.logMessage('No patient data');
    }

}

function loadConfig() {
    this._settings = ExtensionUtils.getSettings(T1D_INDICATOR_SCHEMA);
}