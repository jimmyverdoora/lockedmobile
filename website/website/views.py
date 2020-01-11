from django.shortcuts import render


def homePageView(request):
    context = {}
    try:
        r = requests.get('http://lockedapi.advenagames.com:8080/version')
        if r.status_code != 200:
            raise Exception()
        context = r.json()
    except Exception:
        context["version"] = "???"
        context["linkAndroid"] = "#"
        context["linkIos"] = "#"
    return render(request, "homepage.html", context=context)