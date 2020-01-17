var userLocale = 'en';

function loadLocale() {
    navigator.globalization.getPreferredLanguage(
        function (language) {
            if (language.value.substring(0, 2) == 'it') {
                userLocale = 'it';
                errorMsg = "<p class='errormsg'>Beh... :(<br/>Si e' verificato un errore di comunicazione con il nostro server. " +
                    "L'errore e' comunque gia' stato segnalato e probabilmente stiamo gia' lavorando per sistemarlo ;)</p>";
            };
        },
        function () {}
    );
    var tmpMsgTimer = setInterval(() => {
        for (key of Object.keys(SMESSAGES)) {
            document.getElementById(key).innerHTML = SMESSAGES[key][userLocale];
        };
        clearInterval(tmpMsgTimer);
    }, 500);
};