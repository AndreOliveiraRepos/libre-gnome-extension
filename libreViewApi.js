const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Logger = Me.imports.logger;
const Soup = imports.gi.Soup;
// const TextEncoder = imports.gi.TextEncoder

const soupSyncSession = new Soup.SessionSync();

const apiUrl = 'https://api-de.libreview.io';

let headers = {
    "product": "llu.android",
    "version": "4.7",
    "Accept": "application/json",
    "cache-control": "no-cache",
    "connection": "Keep-Alive",
    "content-type": "application/json"
}
let jwtToken;
let patientIds;

function login(username, password) {
    logMessage('Trying to login');
    try {
        let url = apiUrl + '/llu/auth/login'
        let message = new Soup.Message({
            method: 'POST',
            uri: new Soup.URI(url)
        });
        let body = `{"email": "${username}", "password": "${password}"}`;
        message.set_request('application/json', 2, body);
        message.request_headers.append('product', 'llu.android');
        message.request_headers.append('version', '4.7');
        message.request_headers.append('Accept', 'application/json');
        message.request_headers.append('cache-control', 'no-cache');
        message.request_headers.append('connection', 'Keep-Alive');
        message.request_headers.append('content-type', 'application/json');
        message.request_headers.set_content_type("application/json", null);
        message.request_headers.append('User-Agent', 'Mozilla/5.0 (Android 14; Mobile; rv:68.0) Gecko/68.0 Firefox/128.0');

        let responseCode = soupSyncSession.send_message(message);
        if (responseCode == 200) {
            logMessage('Successfull login');
            let response = JSON.parse(message['response-body'].data);
            logMessage(JSON.stringify(response.data));
            if (response.data.authTicket.token) {
                jwtToken = response.data.authTicket.token;
                return true;
            }
        } else {
            logMessage('Login failed!');
            logMessage('Response code: ' + responseCode);
            logMessage('msg: ' + JSON.stringify(message));
        }

    } catch (e) {
        logMessage('Exception thrown - Login failed!');
        logMessage('Exception: ' + e);
    }
    return false;
}


function getPatientIds() {
    logMessage('Getting patientId');
    let url = apiUrl + '/llu/connections'
    let message = Soup.Message.new('GET', url);
    message.request_headers.append('product', 'llu.android');
    message.request_headers.append('version', '4.7');
    message.request_headers.append('Accept', 'application/json');
    message.request_headers.append('cache-control', 'no-cache');
    message.request_headers.append('connection', 'Keep-Alive');
    message.request_headers.append('content-type', 'application/json');
    message.request_headers.set_content_type("application/json", null);
    message.request_headers.append('User-Agent', 'Mozilla/5.0 (Android 14; Mobile; rv:68.0) Gecko/68.0 Firefox/128.0');

    message.request_headers.append(
        'Authorization',
        `Bearer ${jwtToken}`
    )
    let responseCode = soupSyncSession.send_message(message);

    if (responseCode == 200) {
        try {
            patientIds = JSON.parse(message['response-body'].data);
            logMessage(JSON.stringify(patientIds));
        } catch (error) {
            logMessage(error);
        }
    } else {
        logMessage('Login failed!');
        logMessage('msg: ' + JSON.stringify(message));
    }
    return patientIds;
}


function logMessage(message) {
    Logger.logMessage('[API]' + message);
}