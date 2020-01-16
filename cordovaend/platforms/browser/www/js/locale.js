var userLocale = 'en';

function loadLocale() {
    navigator.globalization.getPreferredLanguage(
        function (language) {
            if (language.value.substring(0, 2) == 'en') {
                document.getElementById("loadingcontainer").innerHTML = "LELLLLLLLLLLLL";
            };
        },
        function () {}
    );
}