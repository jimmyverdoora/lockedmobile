// L: local, T: testing, S: staging, P: prod
var appScope = "P"; 

var currentVersion = "1.1.0"; // aggiornare sempre anche db e config.xml

var musicVol = 0.6;


// _____________________________ AUTOMATED __________________________________

var apiurl = "http://localhost:8080";
var isTesting = true;

if (appScope == "S") {
    apiurl = "http://142.93.102.210:8080";
} else if (appScope == "P") {
    apiurl = "http://lockedapi.advenagames.com:8080";
    isTesting = false;
};