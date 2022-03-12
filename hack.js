/*
hack.js by Blackburd
This script will weaken, grow and hack one server as specified by a command line argument. 
Useage:
run hack.js target -t (num of threads)
*/

var serverName = args[0];
tprint("Hacking server " + serverName);
if (serverName == "") {
    serverName = "joesguns";
}

var moneyThresh = getServerMaxMoney(serverName) * 0.75;
var securityThresh = getServerMinSecurityLevel(serverName) + 5;
var numInstances = Math.floor(getServerMaxRam(serverName) / getScriptRam("hack.script"));

while (true) {

    if (hasRootAccess(serverName)) {
        if (getServerSecurityLevel(serverName) > securityThresh) {

//            weaken(serverName,numInstances);
            weaken(serverName);
        } else if (getServerMoneyAvailable(serverName) < moneyThresh) {
//            grow(serverName,numInstances);
            grow(serverName);
        } else {
//            hack(serverName,numInstances);
            hack(serverName);
        }
    }
}
