const EMPTY = '';

window.mmf = {
    findElementByAttribute: function (element, attribute) {
        return document.querySelector(element + '[' + attribute + ']');
    },
    findAllBySelector: function (selector) {
        return document.querySelectorAll(selector);
    },
    log: function (message) {
        console.log(message)
    },
}

function m() {
    if (!window.mmf) {
        return {};
    }
    return window.mmf;
}

function onloadCallback () {
    initAllGrecaptcha('_grecaptcha');
}

function grecaptchaTokens() {
    var tokens = getAllGrecaptchaTokens('_grecaptcha');
    console.log(tokens);
}

function initAllGrecaptcha(suffix) {
    var metaElement = m().findElementByAttribute('meta', 'site-key');
    if (!metaElement) {
        return;
    }
    var siteKey = metaElement.getAttribute('site-key');
    if (!siteKey) {
        return;
    }
    var divElements = m().findAllBySelector('div[id$="' + suffix + '"]');
    for (var index = 0; index < divElements.length; index++) {
        var divElement = divElements[index];
        initGrecaptcha(divElement, siteKey);
    }
}

function initGrecaptcha(element, siteKey) {
    if (!grecaptcha || !element) {
        return;
    }

    var widget = grecaptcha.render(element, {
        'sitekey': siteKey
    });

    var serializedWidget = JSON.stringify(widget);
    var el = document.getElementById(element.id);

    el.setAttribute('widget-id', serializedWidget);
}

function getAllGrecaptchaTokens(suffix) {
    var tokens = [];
    var widgets = m().findAllBySelector('div[id$="' + suffix + '"]');
    for (var index = 0; index < widgets.length; index++) {
        var widgetId = widgets[index].getAttribute('widget-id');
        var token = getGrecaptchaToken(widgetId);
        tokens.push(token);
    }
    return tokens;
}

function getGrecaptchaToken(widgetId) {
    if (!grecaptcha || widgetId == null || widgetId == '') {
        return EMPTY;
    }

    var token = grecaptcha.getResponse(widgetId);
    grecaptcha.reset(widgetId);
    return token;
}

