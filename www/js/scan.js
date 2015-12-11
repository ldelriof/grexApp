$(function() {
  document.addEventListener("deviceready", init, false);
});
var paramsObj = {};
var in_zone = false;
function init(){
    advertise();
    monitor();
 //    ble.startScan([], function(device) {
 //        if(device.rssi < -70)
 //    	    logger(device.advertising.kCBAdvDataServiceUUIDs+' '+device.name+' '+device.rssi+'<br><br><br>');
	//     logger(JSON.stringify(device));
	// },  function(error) {
	//     logger(JSON.stringify(error));
	// });

}

function advertise() {
    var uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9';
    var identifier = 'grexBeacon';
    var minor = 2000;
    var major = 5;
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

    // The Delegate is optional
    var delegate = new cordova.plugins.locationManager.Delegate();

    // Event when advertising starts (there may be a short delay after the request)
    // The property 'region' provides details of the broadcasting Beacon
    delegate.peripheralManagerDidStartAdvertising = function(pluginResult) {
        console.log('peripheralManagerDidStartAdvertising: '+ JSON.stringify(pluginResult.region));
    };
    // Event when bluetooth transmission state changes 
    // If 'state' is not set to BluetoothManagerStatePoweredOn when advertising cannot start
    delegate.peripheralManagerDidUpdateState = function(pluginResult) {
        console.log('peripheralManagerDidUpdateState: '+ pluginResult.state);
    };

    cordova.plugins.locationManager.setDelegate(delegate);

    // Verify the platform supports transmitting as a beacon
    cordova.plugins.locationManager.isAdvertisingAvailable()
        .then(function(isSupported){

            if (isSupported) {
                cordova.plugins.locationManager.startAdvertising(beaconRegion)
                    .fail(conole.error)
                    .done();
            } else {
                console.log("Advertising not supported");
            }
        })
        .fail(console.error)
        .done();

}

function monitor() {


    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didDetermineStateForRegion = function (pluginResult) {

        // logger('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

        cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
            + JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        // console.log('didStartMonitoringForRegion:', pluginResult);

        // logger('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
    };

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        var howmany = 0,
            rssis = '',
            beacons = pluginResult.beacons;
        // logger(JSON.stringify(pluginResult.beacons) + '<br><br><br><br>')
        beacons.forEach(function(beacon) {

            rssis += beacon.rssi + ' ';

            if(beacon.rssi > -65 && beacon.rssi < 0) {
                howmany++
            }
        })
        logger(rssis+'<br>howmany = '+howmany+'<br><br>');
        rules(howmany);
        // logger('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));

    };




    var uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9';
    var identifier = 'grexBeacon';
    var minor = 2000;
    var major = 5;
    var beaconRegion
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

    cordova.plugins.locationManager.setDelegate(delegate);

    // required in iOS 8+
    cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
    // or cordova.plugins.locationManager.requestAlwaysAuthorization()

    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail(console.error)
        .done();


}

function logger(message) {
  $(".log").html(message+"\r\n");
}

function rules(howmany) {
    if(howmany > 0 && howmany < 2) {
        $("body").css({background : "green"})
    } else if (howmany > 1) {
        $("body").css({background : "yellow"})
    } else {
        $("body").css({background : "white"})
    }


}


