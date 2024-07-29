const PanelMenu = imports.ui.panelMenu;
const GObject = imports.gi.GObject;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Logger = Me.imports.logger;

const iconsPath = `${Me.path}/icons/`;

const trendIconMap = [
    { id: 1, icon: Gio.icon_new_for_string(`${iconsPath}/arrow-down-solid.svg`) },
    { id: 2, icon: Gio.icon_new_for_string(`${iconsPath}/arrow-trend-down-solid.svg`) },
    //1
    { id: 3, icon: Gio.icon_new_for_string(`${iconsPath}/arrow-right-solid.svg`) },
    { id: 4, icon: Gio.icon_new_for_string(`${iconsPath}/arrow-trend-up-solid.svg`) },
    { id: 5, icon: Gio.icon_new_for_string(`${iconsPath}/arrow-up-solid.svg`) }
]

var MyIndicator = GObject.registerClass(
    {
        GTypeName: 'MyIndicator'
    },
    class MyIndicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, Me.metadata.name, false);

            this.patientIds = null;
            this.myPatientId = null;
            this.patientIds = null;
            this.glucoseMeasurement = 0;
            this.targetLow = 0;
            this.targetHigh = 0;

            this.widgetBoxLayout = new St.BoxLayout();

            let gicon = trendIconMap[0].icon;

            this.trendIcon = new St.Icon({ gicon: gicon, style_class: 'trend-icon', icon_size: 16 });

            this.label = new St.Label({
                text: 'Loading..'
            });


            this.widgetBoxLayout.add(this.label);
            this.widgetBoxLayout.add(this.trendIcon);

            this.add_child(this.widgetBoxLayout);
        }
        setTrendIcon(trendValue) {
            if (trendValue) {
                Logger.logMessage('icon:' + trendIconMap[trendValue - 1].icon);
                this.trendIcon.set_gicon(trendIconMap[trendValue - 1].icon)
            }
        }
        setGlucoseLevel(glucoseMeasurement) {
            this.glucoseMeasurement = glucoseMeasurement;
            this.label.set_text(this.glucoseMeasurement + ' ml/dL');
            this.setColoring()
        }
        createSettings() {
            let item = new PopupMenu.PopupSubMenuMenuItem('Settings', true);
            this.menu.addMenuItem(item);
            
            item.connect('button_press_event', () => {
                Logger.logMessage('Settings');
            });
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem);
        }
        setColoring() {
            if (this.glucoseMeasurement > this.targetHigh) {
                // Main.notify('Diabetes level is too High', this.glucoseMeasurement + ' ml/dL');
                this.widgetBoxLayout.style = `background-color: orange;`;
            } else if (this.glucoseMeasurement < this.targetLow) {
                // Main.notify('Diabetes level is too Low', this.glucoseMeasurement + ' ml/dL');
                this.widgetBoxLayout.style = `background-color: red;`;
            } else {
                this.widgetBoxLayout.style = `background-color: green;`;
            }
        }
        setTargetHigh(targetHigh) {
            this.targetHigh = targetHigh;
        }
        setTargetLow(targetLow) {
            this.targetLow = targetLow;
        }
    }
);
