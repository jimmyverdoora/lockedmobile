// L: local, T: testing, S: staging, P: prod
var appScope = "L"; 

var currentVersion = "1.0.0"; // aggiornare sempre anche db e config.xml

var musicVol = 0.7;


// _____________________________ AUTOMATED __________________________________

var apiurl = "http://localhost:8080";
var isTesting = true;

if (appScope == "T") {
    apiurl = "http://46.141.101.76:8080";   
} else if (appScope == "S") {
    apiurl = "http://142.93.102.210:8080";
} else if (appScope == "P") {
    apiurl = "http://lockedapi.advenagames.com:8080";
    isTesting = false;
};

var errorMsg = "<p class='errormsg'>Well... :(<br/>An error occurred during the comunication with our server. If you see this, the error has already been reported and we are probably working to fix it ;)</p>";