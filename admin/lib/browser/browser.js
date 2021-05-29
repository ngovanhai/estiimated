class Browser {
    constructor() {
        this.detail = this.getBrowserNameAndVersion();
        this.listBrowsers = this.getListBrowsers();
        this.isValid = this.validateBrowser();
    }

    validateBrowser() {
        let isValid = this.listBrowsers.some(browser => browser.name === this.detail.name && browser.is_support && browser.minimum_version <= this.detail.version);
        return isValid;
    }

    getBrowserNameAndVersion() {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {
                name: "IE",
                version: Number(tem[1]) || 0
            }
        }


        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                tem.splice(0, 1);
                tem[0].replace('OPR', 'Opera');
                return {
                    name: tem[0],
                    version: !isNaN(tem[1]) ? Number(tem[1]) : tem[1]
                }
            }
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return {
            name: M[0],
            version: !isNaN(M[1]) ? Number(M[1]) : M[1]
        };
    }

    getListBrowsers() {
        return [
            {
                name: "IE",
                is_support: false
            },
            {
                name: "Edge",
                is_support: true,
                minimum_version: 75,
                upgrade_url: "https://www.whatismybrowser.com/guides/how-to-update-your-browser/edge"
            },
            {
                name: "Firefox",
                is_support: true,
                minimum_version: 67,
                upgrade_url: "https://support.mozilla.org/en-US/kb/update-firefox-latest-release"
            },
            {
                name: "Chrome",
                is_support: true,
                minimum_version: 63,
                upgrade_url: "https://support.google.com/chrome/answer/95414"
            },
            {
                name: "Safari",
                is_support: true,
                minimum_version: 11.1,
                upgrade_url: "https://support.apple.com/en-us/HT204416"
            },
            {
                name: "Opera",
                is_support: true,
                minimum_version: 50,
                upgrade_url: "https://help.opera.com/en/opera-tutorials/how-do-i-update-my-opera-browser/"
            },
            {
                name: "iOS Safari",
                is_support: true,
                minimum_version: 11,
                upgrade_url: "https://support.apple.com/en-ca/HT204204"
            },
            {
                name: "Opera Mini",
                is_support: false
            },
            {
                name: "Android Browser",
                is_support: true,
                minimum_version: 67,
                upgrade_url: "https://support.google.com/chrome/answer/95414"
            },
            {
                name: "Blackberry Browser",
                is_support: false
            },
            {
                name: "Opera Mobile",
                is_support: true,
                minimum_version: 46,
                upgrade_url: "https://www.opera.com/mobile/operabrowser"
            },
            {
                name: "Chrome for Android",
                is_support: true,
                minimum_version: 74,
                upgrade_url: "https://support.google.com/chrome/answer/95414"
            },
            {
                name: "Firefox for Android",
                is_support: false
            },
            {
                name: "IE Mobile",
                is_support: false
            },
            {
                name: "UC Browser for Android",
                is_support: false
            },
            {
                name: "Samsung Internet",
                is_support: true,
                minimum_version: 8.2,
                upgrade_url: "https://play.google.com/store/apps/details?id=com.sec.android.app.sbrowser"
            },
            {
                name: "QQ Browser",
                is_support: false
            },
            {
                name: "Baidu Browser",
                is_support: false
            },
            {
                name: "KaiOS Browser",
                is_support: false
            }
        ];
    }
}

window.browser = new Browser();
