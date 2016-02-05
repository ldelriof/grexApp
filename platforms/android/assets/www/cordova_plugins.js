cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.attendease.ibeacons/www/AttendeaseBeacons.js",
        "id": "com.attendease.ibeacons.AttendeaseBeacons",
        "clobbers": [
            "AttendeaseBeacons"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.attendease.ibeacons": "0.4.2",
    "cordova-plugin-whitelist": "1.2.1"
}
// BOTTOM OF METADATA
});