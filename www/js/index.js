$(function() {
  document.addEventListener("deviceready", init, false);
});
var paramsObj = {};
var in_zone = false;
function init(){
  advertise();
  paramsObj = {request:true};
  logger("Params : " + JSON.stringify(paramsObj));
  bluetoothle.initialize(initializeSuccess, initializeError, paramsObj);
}

function initializeSuccess(e) {
  logger("Initialize Success : " + JSON.stringify(e));

  if (e.status == "enabled")
  {
    logger("Ok");
    paramsObj = {serviceUuids:[], allowDuplicates: false};
    // allowDuplicates true nos puede dejar leer un promedio de RSSI
    bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
  }
  else
  {
    logger("Unexpected Initialize Status");
  }
}

function initializeError(e) {
  logger("Initialize Error : " + JSON.stringify(e));
}

function startScanSuccess(e) {
  // logger("Start Scan Success : " + JSON.stringify(e));
  if (e.status == "scanResult" )
  { 
    var params = {
        "address": e.address,
        "serviceUuids": []
      }

    bluetoothle.services(servicesSuccess, startScanError, params);

    logger(e.name  +' '+e.rssi+' '+e.address+"<br><br><br>");
    // }
  }
  else if (e.status == "scanStarted")
  {
    logger("Scan Started");
  }
  else
  {
    logger("Unexpected Start Scan Status");
  }
}

function servicesSuccess(e) {
    logger(e.name  +' '+JSON.stringify(e.serviceUuids)+"<br><br><br>");
}

function startScanError(e) {
  logger("Start Scan Error : " + JSON.stringify(e));
}

function advertise() {
    var uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9';
    var identifier = 'advertisedBeacon';
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


function logger(message) {
  $(".log").prepend(message+"\r\n");
}
