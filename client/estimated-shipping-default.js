if (typeof window.OtEstimated == 'undefined' || !window.OtEstimated) {
    var OtEstimatedMainClass = "ot-estimated-shipping";
    var timeBegin = new Date().getTime();
    class OtEstimatedStaticMethods {
        // Because we defined this is a static methods,
        // so all params we will need passing to it
        static loadJquery({
            wantedVersion
        }) {
            wantedVersion = wantedVersion || "1.9.1";
            return new Promise((resolve) => {
                if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < parseFloat(wantedVersion))) {
                    OtEstimatedStaticMethods.getScript({
                        source: `//ajax.googleapis.com/ajax/libs/jquery/${wantedVersion}/jquery.min.js`
                    }).then(() => {
                        let jQueryNoConflict = jQuery.noConflict(true);
                        resolve(jQueryNoConflict);
                    })
                } else {
                    resolve(jQuery);
                }
            });
        }
        static getVersion({
            url
        }) {
            var version = OtEstimatedStaticMethods.getParameterByName({
                name: "v",
                url: url
            });
            return version ? version : new Date().getTime();
        }
        static getJsonFile({
            url
        }) {
            return new Promise((resolve) => {
                fetch(url)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        resolve(data);
                    });
            });
        }
        static getParameterByName({
            name,
            url
        }) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
        static logTime(logState) {
            var timeEnd = new Date().getTime();
            var diff = timeEnd - timeBegin;
            logState = logState.replace("{diff}", diff);
        }
        static getScript({
            source
        }) {
            return new Promise((resolve) => {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = source;
                s.onload = s.onreadystatechange = function (_, isAbort) {
                    if (isAbort || !s.readyState || /loaded|complete/.test(s.readyState)) {
                        s.onload = s.onreadystatechange = null;
                        s = undefined;

                        if (!isAbort) {
                            resolve();
                        }
                    }
                };
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            });
        }
    }

    class OtEstimated {
        // Define global variable
        // All variable and function inside this need to start with a underscore "_"
        // so we can easily recognize them
        constructor() {
            // Root api
            this._rootLink = OtEstimatedRootLink;
            this._rootShopifyApi = this._rootLink + "/client/services/_shopify.php";
            this._ip2LocationApi = this._rootLink + "/client/services/Ip2Location.php";
            this._rootAssetFolder = this._rootLink + "/assets";
            // Current Script Url
            var me = null;
            var scripts = document.getElementsByTagName("script")
            for (var i = 0; i < scripts.length; ++i) {
                if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').indexOf("estimated-shipping/client/estimated-shipping.js") > -1) {
                    me = scripts[i].getAttribute('src');
                }
            }
            this._scriptUrl = me;
            // Current version
            this._v = 0;
            // Curremt viewing url
            this._currentUrl = window.location.href.split("/");
            // Shop name
            this._shop = Shopify.shop;
            // Information about current user who is viewing this page
            this._userInfo = null;
            // CurrentViewing product
            this._product = meta && meta.product ? meta.product : {};
            // Bind jquery into this variable after check
            this._jQuery = null;
            // Bind all data from json
            this._data = null;
            // General settings Of Estimated Shipping
            this._generalSettings = null;
            // All Shipping Methods
            // Selectors
            this._selectors = {
                mainClass: OtEstimatedMainClass,
                mainTextClass: OtEstimatedMainClass + '-main-text',
                startDayTextClass: OtEstimatedMainClass + '-start-day',
                endDayTextClass: OtEstimatedMainClass + '-end-day',
                shippingMethodClass: OtEstimatedMainClass + '-shipping-methods',
                shippingMethodSelectBoxClass: OtEstimatedMainClass + '-shipping-methods-select-box',
                shippingMethodSelectItemClass: OtEstimatedMainClass + '-shipping-methods-select-item',

                countryFlagImageClass: OtEstimatedMainClass + '-country-flag-image',
                itemMethodShipping: OtEstimatedMainClass + '-item-shipping-method'
            }
            // Init app
            this._init();
        }

        _init() {
            this._getVersion()
                .then(() => {
                    return this._getJsonFile()
                })
                .then(() => {
                    return this._loadJQuery();
                })
                .then(() => {
                    return this._validateCondition();
                })
                .then(() => {
                    return this._localizeMoment();
                })
                .then(() => {
                    return this._getUserInfoByIp();
                })
                .then(() => {
                    this._switchToOptionalLayout();
                    this._createParentClass();
                    this._applyCss();
                    this._initLayout();
                })
                .catch(() => { });
        }

        _getVersion() {
            return new Promise(resolve => {
                this._v = OtEstimatedStaticMethods.getVersion({
                    url: this._scriptUrl
                });
                resolve();
            });
        }

        _getJsonFile() {
            return new Promise((resolve) => {
                let url = `${this._rootLink}/client/Store/${this._shop}/data.json?v=${this._v}`;
                OtEstimatedStaticMethods.getJsonFile({
                    url
                }).then((data) => {
                    this._data = data.app;
                    this._generalSettings = data.app.settings;
                    if (data.app.settings.enableDebugger == "1") {
                        debugger;
                    }
                    OtEstimatedStaticMethods.logTime(`JSON data loaded after : {diff} milliseconds`);
                    resolve();
                });
            });
        }

        _loadJQuery() {
            return new Promise(resolve => {
                OtEstimatedStaticMethods.loadJquery({
                    wantedVersion: this._generalSettings.jquery_version
                }).then((jQuery) => {
                    this._jQuery = jQuery;
                    resolve();
                })
            });
        }

        _validateCondition() {
            return new Promise((resolve, reject) => {
                if (this._generalSettings.enable_app == 1 && this._generalSettings.show_on_pages.split(',').some(e => this._currentUrl.indexOf(e) > -1)) {
                    this._validateProducts()
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject({
                                message: "Product is out of stock."
                            });
                        });
                } else {
                    reject({
                        message: "App are disable or page is not available."
                    });
                }
            });
        }

        _validateProducts() {
            return new Promise((resolve, reject) => {
                let currentUrl = window.location.href;
                let fullUrlParts = document.location.href.split("variant=");
                let variantID = fullUrlParts["1"];

                if (this._generalSettings.disable_when_product_is_out_of_stock == 1) {
                    this._getProductById({
                        productId: this._product.id
                    }).then(() => {
                        if (this._product && Array.isArray(this._product.variants)) {
                            if (typeof variantID != "undefined") {
                                if (this._product.variants.some(variant => variant.inventory_quantity < 1 && variantID == variant.id)) {
                                    reject();
                                }
                            } else {
                                variantID = this._product.variants[0]['id'];
                                if (this._product.variants.some(variant => variant.inventory_quantity < 1 && variantID == variant.id)) {
                                    reject();
                                }
                            }
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        }
        _switchToOptionalLayout() {
            var customLayout = this._jQuery(`.${this._selectors.mainClass}`).attr('data-layout');
            if (typeof customLayout !== typeof undefined && customLayout !== false) {
                this._generalSettings.layout = customLayout;
            }
        }
        _initLayout() {
            switch (this._generalSettings.layout) {
                case "1":
                    window.OtEstimatedDate = new OtEstimatedDate({
                        _app: this,
                        generalSettings: this._generalSettings,
                        shippingMethods: this._data.shippingMethods,
                        settings: this._data.estimatedDate.settings,
                        specificRules: this._data.estimatedDate.specificRules,
                        specificRuleTargets: this._data.estimatedDate.specificRuleTargets
                    });
                    break;
                case "2":
                    window.OtEstimatedZipcode = new OtEstimatedZipcode({
                        _app: this,
                        ...this._data.zipcode
                    });
                    break;
                case "3":
                    window.OtEstimatedCountry = new OtEstimatedCountry({
                        _app: this,
                        ...this._data.country
                    });
                    break;
                default:
                    break;
            }
        }
        _localizeMoment() {
            return new Promise((resolve => {
                if (this._generalSettings.date_locale === 'en') {
                    resolve();
                } else {
                    OtEstimatedStaticMethods.getScript({
                        source: `${this._rootAssetFolder}/js/moment/locales/${this._generalSettings.date_locale}.js`
                    })
                        .then(() => {
                            OtEstimatedStaticMethods.logTime('Localized after : {diff} milliseconds');
                            resolve();
                        })
                }
            }));
        }
        _createParentClass() {
            if (this._jQuery(`.${this._selectors.mainClass}`).length == 0) {
                let {
                    custom_position,
                    position
                } = this._generalSettings;

                let appendTo = custom_position || position;

                this._jQuery(appendTo).append(`
                        <!-- Start OmegaTheme Estimated Shipping For Shopify -->
                        <div class='${this._selectors.mainClass}'></div>
                        <!-- End OmegaTheme Estimated Shipping For Shopify -->
                    `);
            }
        }
        _applyCss() {
            let htmlcss = "";
            if (Shopify.shop != "pallet-bedz-company.myshopify.com" && Shopify.shop != "project-nursery.myshopify.com") {
                htmlcss += `<link href='${this._rootLink}/assets/lib/font-awesome/css/font-awesome.min.css?v=${this._v}' rel='stylesheet'>`;
            }
            htmlcss += ` 
            <link href='${this._rootLink}/assets/css/estimated-shipping.css?v=${this._v}' rel='stylesheet' type='text/css'>
            <link href='${this._rootLink}/assets/flags/flags.css?v=${this._v}' rel='stylesheet' type='text/css'>
            <style>
                [class^="${this._selectors.mainClass}"] {
                    font-size : ${this._generalSettings.text_size}px;
                    color     : ${this._generalSettings.text_color};

                }
                [class^="${this._selectors.mainClass}-basic-layout"] {
                    border :2px solid ${this._generalSettings.border_color};
                    border-radius     : 5px;
                    background-color :  ${this._generalSettings.background_color};
                    padding : 10px;
                    margin-top : 10px;
                }
                [class^="ot-estimated-shipping-shipping-methods-select-item"] {
                    min-height: 0px !important;
                }
                .ot-estimated-shipping-shipping-methods-select-item:checked + label:before {
                    background-color:${this._generalSettings.border_color};
                }
                ${this._generalSettings.choose_layout == 'card' ? `.ot-estimated-shipping-basic-layout {
                    display:none;
                }` : `.ot-estimated-shipping-basic-layout {
                    display:;
                }` }
                ${this._generalSettings.custom_css}
            </style>
        `
            this._jQuery('body').append(htmlcss);
        }

        _calculateStartAndEndDay({
            minimumDays,
            estimatedDays
        }) {
            var self = this;
            var workingDays = this._generalSettings.week_working_days !== '' ? JSON.parse(this._generalSettings.week_working_days) : [];
            var specialDayOffs = (this._generalSettings.specific_day_off && this._generalSettings.specific_day_off != '' && this._generalSettings.specific_day_off != null) ? JSON.parse(this._generalSettings.specific_day_off) : [];
            // Begin calculate start day 
            var startDay = calculateStartDay(minimumDays, specialDayOffs, workingDays);
            // Begin calculate end day
            var endDay = calculateEndDay(startDay, estimatedDays, specialDayOffs, workingDays);
            window.workingDays = workingDays;
            window.startDay = startDay;
            return {
                startDay: startDay,
                endDay: endDay
            };

            function calculateStartDay(minimumDays, specialDayOffs, workingDays) {
                var startDay = self._createDate();
                var isCutOff = checkCutOff(startDay, workingDays);
                if (isCutOff) {
                    minimumDays++;
                }
                for (var i = 0; i < minimumDays; i++) {
                    startDay = increaseDateTimeByDays(startDay, 1);
                    var compareDay = handleLocalDateTime(startDay);
                    if (specialDayOffs.indexOf(compareDay) > -1) {
                        minimumDays++;
                    } else {
                        var today = startDay.getDay();
                        var weekDay = workingDays.find(e => e.day == today);
                        if (weekDay.enable != 1) {
                            minimumDays++;
                        }
                    }
                }
                return startDay;

                function checkCutOff(startDay, workingDays) {
                    var today = startDay.getDay();
                    var currentHour = startDay.getHours();
                    var currentMinute = startDay.getMinutes();
                    var weekDay = workingDays.find(e => e.day == today);
                    var condition = weekDay.cut_off_after.split(":");
                    var conditionHour = Number(condition[0]);
                    var conditionMinute = Number(condition[1]);
                    if (weekDay.enable != 1 || currentHour > conditionHour || (currentHour == conditionHour && currentMinute >= conditionMinute)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            function calculateEndDay(startDay, estimatedDays, specialDayOffs, workingDays) {
                var endDay = startDay;
                for (var i = 0; i < estimatedDays; i++) {
                    endDay = increaseDateTimeByDays(endDay, 1);
                    var compareDay = handleLocalDateTime(endDay);
                    if (specialDayOffs.indexOf(compareDay) > -1) {
                        estimatedDays++;
                    } else {
                        var today = endDay.getDay();
                        var weekDay = workingDays.find(e => e.day == today);
                        if (weekDay.enable != 1) {
                            estimatedDays++;
                        }
                    }
                }
                return endDay;
            }

            function increaseDateTimeByDays(currentDay, time) {
                var d = new Date(currentDay);
                d.setDate(d.getDate() + Number(time));
                d = new Date(d);
                return d;
            }

            function handleLocalDateTime(time) {
                var day = time.getDate();
                var month = time.getMonth();
                var year = time.getFullYear();
                if (day < 10) {
                    day = '0' + day;
                }
                month = month + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                return `${year}-${month}-${day}`;
            }
        }
        _generateMainEstimatedText({
            rawEstimatedText,
            startDay,
            endDay,
            icon,

        }) {
            var self = this;
            if (self._generalSettings.textCountDownFormat != "" && self._generalSettings.textCountDownFormat != null) {
                var otCountDown = setInterval(function () {
                    appendCountDownTime(self._generalSettings, window.workingDays);
                }, 1000);
            }
            icon = icon ? icon : self._generalSettings.estimated_icon ? self._generalSettings.estimated_icon : "<i class='fa fa-check'></i>";
            if (icon.includes("{country_code}") && self._userInfo && self._userInfo.country_code) {
                icon = icon.replace("{country_code}", self._userInfo.country_code.toLowerCase());
            }

            var dateFormat = self._generalSettings.date_format;
            var estimatedText = rawEstimatedText.replace('{date}', `<span class="${self._selectors.startDayTextClass}">${moment(startDay).format(dateFormat)}</span>`);
            estimatedText = estimatedText.replace('{date+1}', `<span class="${self._selectors.endDayTextClass}">${moment(endDay).format(dateFormat)}</span>`);
            if (self._generalSettings.textCountDownFormat != "" && self._generalSettings.textCountDownFormat != null) {
                var today = (new Date()).getDay();
                var weekDay = workingDays.find(e => e.day == today);
                if (weekDay.enable != "0") {
                    self._generalSettings.textCountDownFormat = self._generalSettings.textCountDownFormat.replace('{TimeCountDown}', `<span class="otCountDown"></span>`);
                    estimatedText = ` ${self._generalSettings.textCountDownFormat}   ${estimatedText}`;
                }
            }
            estimatedText = `${icon}    ${estimatedText}`;
            estimatedText = `<p class="${self._selectors.mainTextClass}">${estimatedText}</p>`;
            self._bindEstimatedTextAsHiddenInput({
                rawEstimatedText,
                startDay,
                endDay
            });
            return estimatedText;
            function appendCountDownTime(generalSettings, workingDays) {
                var startDay = self._createDate();
                var today = startDay.getDay();
                var currentHour = startDay.getHours();
                var currentMinute = startDay.getMinutes();
                var currentSecond = startDay.getSeconds();
                var weekDay = workingDays.find(e => e.day == today);
                if (weekDay.enable != "0") {
                    let caculatorTime = diff(currentHour + ":" + currentMinute + ":" + currentSecond, weekDay.cut_off_after + ":" + "59");
                    if (generalSettings.typeTimeCountdown == 1) {
                        var html = `
                        <span class="ot-seckill-time-div" id="seckill_time">
                            <span id="h_val" class="seckill-time-num h">${caculatorTime['hours']} ${generalSettings.hours}</span>
                            <span class="seckill-time-colon"></span>
                            <span id="m_val" class="seckill-time-num m">${caculatorTime['minutes']} ${generalSettings.minutes}</span>
                            <span class="seckill-time-colon"></span>
                            <span  id="s_val" class="seckill-time-num s">${caculatorTime['seconds']} ${generalSettings.seconds}</span>
                        </span> 
                        `;
                    } else if (generalSettings.typeTimeCountdown == 2) {
                        var html = `
                        <span class="ot-seckill-time-div" id="seckill_time">
                            <span id="h_val" class="seckill-time-num h">${caculatorTime['hours']}</span>
                            <span class="seckill-time-colon">:</span>
                            <span id="m_val" class="seckill-time-num m">${caculatorTime['minutes']}</span>
                            <span class="seckill-time-colon">:</span>
                            <span  id="s_val" class="seckill-time-num s">${caculatorTime['seconds']}</span>
                        </span> 
                        `;
                    } else {
                        var html = `
                        <span class="ot-seckill-time-div" id="seckill_time">
                            <span id="h_val" class="seckill-time-num h">${caculatorTime['hours']}</span>
                            <span class="seckill-time-colon">:</span>
                            <span id="m_val" class="seckill-time-num m">${caculatorTime['minutes']}</span> 
                        </span> 
                        `;
                    }

                    if (self._jQuery(".ot-seckill-time-div").length > 0) {
                        self._jQuery(".otCountDown").empty();
                        self._jQuery(".otCountDown").append(html);
                    } else {
                        self._jQuery(".otCountDown").append(html);
                    }
                }

            }

            function diff(start, end) {
                start = start.split(":");
                end = end.split(":");
                var startDate = new Date(0, 0, 0, start[0], start[1], start[2]);
                var endDate = new Date(0, 0, 0, end[0], end[1], end[2]);
                var diff = endDate.getTime() - startDate.getTime();
                var hours = Math.floor(diff / 1000 / 60 / 60);
                diff -= hours * 1000 * 60 * 60;
                var minutes = Math.floor(diff / 1000 / 60);
                diff -= minutes * 1000 * 60;
                var seconds = Math.floor(diff / 1000);
                // If using time pickers with 24 hours format, add the below line get exact hours
                if (hours < 0) hours = hours + 24;
                if (hours < 10) hours = "0" + hours;
                if (minutes < 10) minutes = "0" + minutes;
                if (seconds < 10) seconds = "0" + seconds;

                let result = [];
                result['hours'] = hours;
                result['minutes'] = minutes;
                result['seconds'] = seconds;
                return result;
            }
        }
        _bindEstimatedTextAsHiddenInput({
            rawEstimatedText,
            startDay,
            endDay
        }) {
            if (this._jQuery(".otExistRule").length > 0) {
                this._jQuery(".otExistRule").remove();
            }
            // Each time we generate estimated text
            // We will check to bind a hidden input to product's submit form
            // So the shop owner can see it when customer complete order which have estimated
            if (this._currentUrl.indexOf('products') > -1 && this._generalSettings.show_on_line_item == 1 && rawEstimatedText) {
                // Get Date Format
                var dateFormat = this._generalSettings.date_format;
                var startWithStartDate = false;
                var startWithEndDate = false;

                var raw = [];
                // We will split the raw estimated text into an array which has two elements
                // The first element is the property of the propduct in cart
                // The second element is the value of that property in cart
                if (rawEstimatedText.includes('{date}')) {
                    // Split by a fixed characters {date}
                    raw = rawEstimatedText.split('{date}');
                    startWithStartDate = true;
                } else if (rawEstimatedText.includes('{date+1}')) {
                    // Split by a fixed characters {date+1}
                    raw = rawEstimatedText.split('{date+1}');
                    startWithEndDate = true;
                }
                //debugger;
                if (typeof window.typePropertiesLableInput == "undefined") window.typePropertiesLableInput = "Estimated Shipping";
                if (raw.length > 0) {
                    // The first item after split will be field name in property of product in cart
                    var fieldName = raw[0].trim().replace(/:\s*$/, "");
                    if (raw.length >= 1) {
                        // The last item after split will be field value in property of product in cart
                        var fieldValue;
                        if (startWithStartDate) {
                            // If we have {date} in the rawEstimatedText, we will start with it
                            fieldValue = moment(startDay).format(dateFormat) + ' ' + raw[1].replace('{date+1}', moment(endDay).format(dateFormat));
                        } else if (startWithEndDate) {
                            // Else, we dont have {date} in the rawEstimatedText, so we will start with the end date
                            fieldValue = moment(endDay).format(dateFormat) + ' ' + raw[1];
                        }
                    }
                    fieldName = fieldName.replace(/"/g, "'");
                    if (fieldName == "") {
                        if (typeof this._generalSettings.labelCheckout != "undefined" && this._generalSettings.labelCheckout != "") {
                            var fieldName = this._generalSettings.labelCheckout;
                        } else {
                            var fieldName = "Estimated between";
                        }
                    }
                    // Toggle an hidden input to form  
                    if (typeof window.propertiesLableInput == "undefined") window.propertiesLableInput = "";
                    if (this._jQuery(`form[action="/cart/add"] input[name="properties[${fieldName}]"]`).length) {
                        this._jQuery(`form[action="/cart/add"] input[name="properties[${fieldName}]"]`).remove();
                    }
                    if (this._jQuery(".otEstimatedShipping").length > 0) {
                        this._jQuery(".otEstimatedShipping").remove();
                    }

                    this._jQuery('form[action^="/cart/add"]').prepend(`
                        <input type="hidden" class="otExistRule"  name="properties[${fieldName}]" value="${fieldValue}">
                    `);
                    if (this._generalSettings.showNameMethodInPropertites == 1) {
                        this._jQuery('form[action^="/cart/add"]').prepend(`
                            <input type="hidden" class="otEstimatedShipping" name="properties[${window.typePropertiesLableInput}]" value="${window.propertiesLableInput}">
                        `);
                    }
                } else {
                    if (typeof this._generalSettings.labelCheckout != "undefined" && this._generalSettings.labelCheckout != "") {
                        var fieldName = this._generalSettings.labelCheckout;
                    } else {
                        var fieldName = "Estimated between";
                    }
                    this._jQuery('form[action^="/cart/add"]').prepend(`
                        <input type="hidden" class="otExistRule"  name="properties[${fieldName}]" value="${rawEstimatedText}">
                    `);
                    if (this._generalSettings.showNameMethodInPropertites == 1) {
                        this._jQuery('form[action^="/cart/add"]').prepend(`
                            <input type="hidden" class="otEstimatedShipping" name="properties[${window.typePropertiesLableInput}]" value="${window.propertiesLableInput}">
                        `);
                    }
                }
            }
        }



        _displayShippingMethods(shippingMethods, app, currentMethod, settings) {
            var jQuery = this._jQuery;
            if (settings.choose_layout == "select") {
                if (
                    shippingMethods.length > 1 &&
                    jQuery(`.${this._selectors.shippingMethodClass}`).length == 0
                ) {
                    var selectMethods = `<div class="${this._selectors.shippingMethodClass}">`;
                    selectMethods += `<select class="${this._selectors.shippingMethodSelectBoxClass}">`;
                    window.propertiesLableInput = shippingMethods[0]["name"] + " - ";
                    window.typePropertiesLableInput = "Method shipping";
                    for (var method of shippingMethods) {
                        selectMethods += `<option class="${this._selectors.shippingMethodSelectItemClass}" value="${method.id}">${method.name}</option>`;
                    }
                    selectMethods += `</select>`;
                    selectMethods += `</div>`;
                    jQuery(`.${this._selectors.mainClass}`).append(selectMethods);

                    jQuery(`.${this._selectors.shippingMethodSelectBoxClass}`).on(
                        "change",
                        function (e) {
                            jQuery(document).trigger(
                                "OtEstimated_OnShippingMethodHasChanged",
                                [
                                    {
                                        methodId: jQuery(this).val(),
                                    },
                                ]
                            );
                        }
                    );
                }
            }
            if (settings.choose_layout == "card") {

                if (
                    shippingMethods.length > 0 &&
                    jQuery(`.${this._selectors.shippingMethodClass}`).length == 0
                ) {

                    var selectMethods = `<div class="${this._selectors.shippingMethodClass}">`;
                    selectMethods += `<div class="${this._selectors.shippingMethodSelectBoxClass}">`;
                    selectMethods += `<h4 style="color:black">Shipping method</h4>`;
                    window.propertiesLableInput = shippingMethods[0]["name"] + " - ";
                    window.typePropertiesLableInput = "Method shipping";
                    for (var method of shippingMethods) {
                        var estimatedText = "";
                        let calculatedDay = app._calculateStartAndEndDay({
                            minimumDays: method.minimum_days,
                            estimatedDays: method.estimated_days,
                        });
                        let startDay = calculatedDay.startDay;
                        let endDay = calculatedDay.endDay;
                        var dateFormat = this._generalSettings.date_format;

                        estimatedText = method.estimated_text.replace(
                            "{date}",
                            `<span class="">${moment(startDay).format(dateFormat)}</span>`
                        );
                        estimatedText = estimatedText.replace(
                            "{date+1}",
                            `<span class="">${moment(endDay).format(dateFormat)}</span>`
                        );
                        selectMethods += `<div class="${this._selectors.itemMethodShipping} ${this._selectors.itemMethodShipping}-${method.id}" ><input type="radio" id="${method.id}" name="check_shipping_method" value="${method.id}"   class="ot-estimated-shipping-item-radio ${this._selectors.shippingMethodSelectItemClass}">
                        <label for=${method.id}></label>
                        <div class="ot-estimated-shipping-title-shipping">${method.icon} ${method.name}</div>
                        <div class="ot-estimated-shipping-text-shipping">${estimatedText}</div>
                        <div class="ot-estimated-shipping-privacy-text">${method.privacy_text}</div>
                       </div>`;

                    }
                    selectMethods += `</div>`;
                    selectMethods += `</div>`;



                    jQuery(`.${this._selectors.mainClass}`).append(selectMethods);
                    const getClass = jQuery(
                        `.${this._selectors.shippingMethodSelectItemClass}`
                    );
                    getClass[0].checked = true;
                    let divParent = jQuery(
                        "input[name=check_shipping_method]:checked"
                    ).parent();
                    divParent = divParent[0].children;
                    for (let j = 1; j < divParent.length; j++) {
                        divParent[j].style.color = `${this._generalSettings.text_color}`;
                    }
                    jQuery("input[name=check_shipping_method]:checked")
                        .parent()
                        .css("border", `2px solid ${settings.border_color}`);
                    jQuery("input[name=check_shipping_method]:checked")
                        .parent()
                        .css("background-color", `${settings.background_color}`);

                    jQuery(document).on(
                        "click",
                        `.${this._selectors.shippingMethodSelectItemClass}`,
                        () => {
                            var idSelected = jQuery(
                                "input[name=check_shipping_method]:checked"
                            ).val();

                            jQuery("input[name=check_shipping_method]:checked")
                                .parent()
                                .css("border", `2px solid ${settings.border_color} `);
                            jQuery("input[name=check_shipping_method]:checked")
                                .parent()
                                .css("background-color", `${settings.background_color}`);
                            let divParent = jQuery(
                                "input[name=check_shipping_method]:checked"
                            ).parent();
                            divParent = divParent[0].children;

                            for (let i = 1; i < divParent.length; i++) {
                                divParent[
                                    i
                                ].style.color = `${this._generalSettings.text_color}`;
                            }
                            var methodUnChecked = jQuery("input[name=check_shipping_method]");

                            for (let i in methodUnChecked) {
                                if (methodUnChecked[i].checked == false) {
                                    methodUnChecked[
                                        i
                                    ].parentElement.style.border = `0px solid #f6f6f6`;
                                    methodUnChecked[
                                        i
                                    ].parentElement.style.backgroundColor = `white`;
                                    let divParentUnchecked = methodUnChecked[i].parentElement;
                                    divParentUnchecked = divParentUnchecked.children;
                                    for (let j = 1; j < divParentUnchecked.length; j++) {
                                        divParentUnchecked[j].style.color = `black`;
                                    }
                                }
                            }
                            jQuery(document).trigger(
                                "OtEstimated_OnShippingMethodHasChanged",
                                [
                                    {
                                        methodId: idSelected,
                                    },
                                ]
                            );
                        }
                    );

                    jQuery(`.${this._selectors.shippingMethodSelectItemClass}`).on(
                        "change",
                        function (e) {
                            jQuery(document).trigger(
                                "OtEstimated_OnShippingMethodHasChanged",
                                [
                                    {
                                        methodId: jQuery(this).val(),
                                    },
                                ]
                            );
                        }
                    );
                }
                jQuery('.ot-estimated-shipping-item-shipping-method').on('click', function () {
                    this.children[0].checked = true;

                    let idSelected = jQuery(
                        "input[name=check_shipping_method]:checked"
                    ).val();

                    jQuery("input[name=check_shipping_method]:checked")
                        .parent()
                        .css("border", `2px solid ${settings.border_color} `);
                    jQuery("input[name=check_shipping_method]:checked")
                        .parent()
                        .css("background-color", `${settings.background_color}`);
                    let divParent = jQuery(
                        "input[name=check_shipping_method]:checked"
                    ).parent();
                    divParent = divParent[0].children;
                    for (let i = 1; i < divParent.length; i++) {
                        divParent[
                            i
                        ].style.color = `${settings.text_color}`;
                    }
                    var methodUnChecked = jQuery("input[name=check_shipping_method]");
                    for (let i in methodUnChecked) {
                        if (methodUnChecked[i].checked == false) {
                            methodUnChecked[
                                i
                            ].parentElement.style.border = `0px solid #f6f6f6`;
                            methodUnChecked[
                                i
                            ].parentElement.style.backgroundColor = `white`;
                            let divParentUnchecked = methodUnChecked[i].parentElement;
                            divParentUnchecked = divParentUnchecked.children;
                            for (let j = 1; j < divParentUnchecked.length; j++) {
                                divParentUnchecked[j].style.color = `black`;
                            }
                        }
                    }
                    jQuery(document).trigger(
                        "OtEstimated_OnShippingMethodHasChanged",
                        [
                            {
                                methodId: idSelected,
                            },
                        ]
                    );
                })
                jQuery(`.${this._selectors.shippingMethodSelectItemClass}`).on(
                    "change",
                    function (e) {
                        jQuery(document).trigger(
                            "OtEstimated_OnShippingMethodHasChanged",
                            [
                                {
                                    methodId: jQuery(this).val(),
                                },
                            ]
                        );
                    }
                );

            }
        }

        _getCollectionsByProductId() {
            return new Promise((resolve, reject) => {
                this._jQuery.ajax({
                    url: `${this._rootShopifyApi}`,
                    type: 'GET',
                    data: {
                        shop: this._shop,
                        action: 'getCollectionsByProductId',
                        productId: this._product.id
                    },
                    dataType: 'json'
                }).done(result => {
                    if (!(this._jQuery.isEmptyObject(result))) {
                        resolve(result)
                    } else {
                        resolve(null)
                    }
                });
            });
        }

        _getProductById() {
            return new Promise((resolve, reject) => {
                this._jQuery.ajax({
                    url: `${this._rootShopifyApi}`,
                    type: 'GET',
                    data: {
                        shop: this._shop,
                        action: 'getProductById',
                        productId: this._product.id
                    },
                    dataType: 'json'
                }).done(result => {
                    if (!(this._jQuery.isEmptyObject(result))) {
                        this._product = result.product;
                        resolve(result);
                    } else {
                        resolve(null);
                    }
                });
            });
        }

        _getUserInfoByIp(forceGet) {
            return new Promise((resolve) => {
                if (forceGet || (this._generalSettings.get_user_info && Number(this._generalSettings.get_user_info) === 1)) {
                    this._jQuery.ajax({
                        url: `${this._ip2LocationApi}`,
                        type: 'GET',
                        data: {
                            action: 'getInfo',
                            shop: Shopify.shop,
                        },
                        dataType: 'json'
                    }).done(result => {
                        OtEstimatedStaticMethods.logTime("Get user info after: {diff} milliseconds");
                        this._userInfo = result;
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        }

        _createDate(d) {
            let timezone = ((rawTimezone) => {
                if (!rawTimezone) return new Date().getTimezoneOffset();
                const timeGMT = rawTimezone.substring(
                    rawTimezone.lastIndexOf("(") + 1,
                    rawTimezone.lastIndexOf(")")
                );
                const timeGMTSplit = timeGMT.split("");
                let hour = Number(timeGMTSplit[3] + timeGMTSplit[4] + timeGMTSplit[5]) * -1;
                let minute = Number(timeGMTSplit[7] + timeGMTSplit[8]);
                if (minute === 30) minute = 0.5;
                const timezone = hour + minute;
                const timezoneToMinute = timezone * 60;
                return timezoneToMinute;
            })(this._generalSettings.date_timezone_offset);

            let localTimezone = new Date().getTimezoneOffset();
            let diff = timezone - localTimezone;
            let date = d ? new Date(d) : new Date();
            let momentDate = moment(date).utcOffset(-diff)._d;
            return momentDate;
        }
    }

    class OtEstimatedDate {
        constructor({
            _app,
            shippingMethods,
            settings,
            specificRules,
            specificRuleTargets,
            generalSettings
        }) {
            this._app = _app;
            this.shippingMethods = shippingMethods;
            this.settings = settings;
            this.specificRules = specificRules;
            this.specificRuleTargets = specificRuleTargets;
            this.availableRules = [];
            this.specificTargets = [];
            this.availableShippingMethods = [];
            this.currentMethod = null;
            this.error = null;
            this.generalSettings = generalSettings;
            // Specific selectors for estimated date
            this.selectors = {
                mainClass: OtEstimatedMainClass,
                basicLayoutClass: OtEstimatedMainClass + '-basic-layout',
                shippingPrivacyClass: OtEstimatedMainClass + '-basic-shipping-privacy',
                shippingPrivacyTextClass: OtEstimatedMainClass + '-basic-shipping-privacy-text',
                shippingPrivacyMoreClass: OtEstimatedMainClass + '-basic-shipping-privacy-more',
                shippingPrivacyMorePopupClass: OtEstimatedMainClass + '-basic-shipping-privacy-more-popup',
                productCustomTextClass: OtEstimatedMainClass + '-product-custom-text'
            }

            this.init();
        }
        init() {
            this.findSpecificTargets()
                .then(() => {
                    return this.findAvailableRules();
                })
                .then(() => {
                    return this.findAvailableShippingMethods();
                })
                .then(() => {
                    if (this.availableShippingMethods.length) {
                        this.setCurrentShippingMethod(0);
                        this._app._displayShippingMethods(
                            this.availableShippingMethods,
                            this._app,
                            this.currentMethod,
                            this.generalSettings
                        );
                        this.displayEstimatedTime(this.generalSettings);
                        this.bindTrigger();
                    }
                })
                .catch(error => {
                    this.error = error.message;
                });
        }
        findSpecificTargets() {
            return new Promise((resolve) => {
                let allTargets = this.specificRuleTargets;

                let product = this._app._product;
                let productId = product.id;
                let productVendor = product.vendor;

                this._app._getCollectionsByProductId()
                    .then(productCollections => {
                        productCollections = productCollections || [];
                        this.specificTargets = allTargets.filter(target => {
                            return Number(target.value) === productId || productCollections.indexOf(Number(target.value)) > -1 || target.value === productVendor;
                        });
                        resolve();
                    });
            });
        }
        findAvailableRules() {
            return new Promise((resolve) => {
                if (this.specificTargets.length) {
                    this.availableRules = this.specificRules.filter(rule => {
                        return this.specificTargets.some(target => Number(target.rule_id) === Number(rule.id));
                    });
                }
                resolve();
            });
        }
        findAvailableShippingMethods() {
            return new Promise((resolve) => {
                //debugger;
                if (this.availableRules.length) {
                    let availableMethods = [];
                    if (this.specificRuleTargets.length > 0) {
                        var self = this;
                        var sortAvailableRulesC = [];
                        var sortAvailableRulesP = [];
                        var sortAvailableRulesV = [];
                        this.availableRules.forEach(function (element, index) {
                            self.specificRuleTargets.forEach(function (specificRule, indexspecificRule) {
                                if (element.id === specificRule.rule_id) {
                                    element.type = specificRule.type;
                                    if (specificRule.type === "product") {
                                        sortAvailableRulesP.push(element);
                                    } else if (specificRule.type === "collection") {
                                        sortAvailableRulesC.push(element);
                                    } else if (specificRule.type === "vendor") {
                                        sortAvailableRulesV.push(element);
                                    }
                                }
                            })
                        })
                        this.availableRules = [];
                        this.availableRules = sortAvailableRulesP.concat(sortAvailableRulesC, sortAvailableRulesV);

                    }
                    this.shippingMethods.forEach(method => {
                        let rule = [];
                        this.availableRules.forEach(function (element) {
                            if (rule.length == 0) {
                                if (Number(method.id) === Number(element.shipping_method_id)) {
                                    rule = element;
                                }
                            }
                        })
                        // let rule = this.availableRules.find(rule => Number(method.id) === Number(rule.shipping_method_id));
                        if (rule.length != 0) {
                            availableMethods.push({
                                id: method.id,
                                position: method.position,
                                icon: method.icon,
                                name: method.name,
                                privacy_text: method.privacy_text,
                                rule_id: rule.id,
                                enable: Number(rule.enable) === 1,
                                estimated_days: Number(rule.estimated_days),
                                minimum_days: Number(rule.minimum_days),
                                estimated_text: rule.estimated_text,
                                custom_text: rule.custom_text
                            });
                        }
                    });
                    this.availableShippingMethods = availableMethods;
                } else if (Number(this.settings.only_show_specific_targets) === 0) {
                    this.availableShippingMethods = this.shippingMethods.filter(method => Number(method.is_private) === 0);
                } else {
                    this.availableShippingMethods = [];
                }
                resolve();
            });
        }
        setCurrentShippingMethod(index) {
            let method = this.availableShippingMethods[index];
            this.currentMethod = JSON.parse(JSON.stringify(method));
        }
        displayEstimatedTime() {
            var jQuery = this._app._jQuery;
            // Push all info to one array: listHtml
            var listHtml = [];

            // Calculate and Generate estimated day
            // -- Calculate
            var calculatedDay = this._app._calculateStartAndEndDay({
                minimumDays: this.currentMethod.minimum_days,
                estimatedDays: this.currentMethod.estimated_days,
            });
            var startDay = calculatedDay.startDay;
            var endDay = calculatedDay.endDay;
            // -- Generate
            var mainText = this._app._generateMainEstimatedText({
                rawEstimatedText: this.currentMethod.estimated_text,
                icon: this.currentMethod.icon,
                startDay,
                endDay
            });
            listHtml.push(mainText);

            // Shipping privacy
            var privacyText = this.currentMethod.privacy_text;
            if (privacyText != '') {
                privacyText = privacyText.replace('{date}', this.currentMethod.estimated_days);
                var shippingPrivacy = '';
                shippingPrivacy += `<div class="${this.selectors.shippingPrivacyClass}">`;
                shippingPrivacy += `<p class="${this.selectors.shippingPrivacyTextClass}">`;
                shippingPrivacy += `<span>${privacyText}</span>`;
                if (this.settings.privacy_page_url != '') {
                    shippingPrivacy += `
                        <a class="shipping-privacy-href" href="${this.settings.privacy_page_url}" target="_blank">
                            <span>${this.settings.privacy_page_text}</span>
                        </a>
                    `
                } else {
                    shippingPrivacy += `
                        <span>${this.settings.privacy_page_text}</span>
                    `
                }
                if (this.settings.privacy_more) {
                    shippingPrivacy += `
                        <span class="${this.selectors.shippingPrivacyMoreClass}">
                            <i class="fas fa-info-circle" aria-hidden="true"></i>
                            <span class="${this.selectors.shippingPrivacyMorePopupClass}" style="display: none;">
                                ${this.settings.privacy_more}
                            </span>
                        <span>
                    `;
                }
                shippingPrivacy += "</p>";
                shippingPrivacy += "</div>";
                listHtml.push(shippingPrivacy);
            }

            // Custom text for specific product
            if (this.currentMethod.custom_text) {
                listHtml.push(`<p class="${this.selectors.productCustomTextClass}">${this.currentMethod.custom_text}</p>`);
            }

            // Display
            if (jQuery(`.${this.selectors.basicLayoutClass}`).length == 0) {
                jQuery(`.${this.selectors.mainClass}`).append(`<div class="${this.selectors.basicLayoutClass}"></div>`);
            }
            jQuery(`.${this.selectors.basicLayoutClass}`).empty();
            listHtml.forEach(info => jQuery(`.${this.selectors.basicLayoutClass}`).append(info));
            jQuery(`.${this.selectors.shippingPrivacyMoreClass}`).on("click", () => {
                jQuery(`.${this.selectors.shippingPrivacyMoreClass} .${this.selectors.shippingPrivacyMorePopupClass}`).toggle();
            });
            OtEstimatedStaticMethods.logTime(`App run after : {diff} milliseconds`);
        }
        bindTrigger() {
            var jQuery = this._app._jQuery;
            var self = this;
            jQuery(document).on("OtEstimated_OnShippingMethodHasChanged", (e, context) => {
                let methodId = context.methodId;
                this.availableShippingMethods.forEach((method, index) => {
                    if (method.id == methodId) {
                        this.setCurrentShippingMethod(index);
                        this.displayEstimatedTime();
                        if (jQuery(".otEstimatedShipping").length > 0) jQuery(".otEstimatedShipping").remove();
                        window.propertiesLableInput = method.name + " - ";
                        window.typePropertiesLableInput = "Method shipping";
                        if (self.generalSettings.showNameMethodInPropertites == 1) {
                            jQuery('form[action^="/cart/add"]').prepend(` <input type="hidden" class="otEstimatedShipping" name="properties[${window.typePropertiesLableInput}]" value="${window.propertiesLableInput}"> `);
                        }

                    }
                });
            });
        }
    }

    class OtEstimatedZipcode {
        constructor({
            _app,
            settings
        }) {
            this._app = _app;
            this.settings = settings;
            this.listZipcodes = [];
            this.specificProducts = [];
            this.specificCollections = [];
            this.specificVendors = [];
            this.specificZipcodes = [];
            this.availableZipcodes = [];
            this.isUseSpecificZipcodes = false;
            this.currentZipcode = null;
            this.userZipcode = null;
            this.selectors = {
                mainClass: OtEstimatedMainClass,
                zipcodeLayoutClass: OtEstimatedMainClass + '-zipcode-layout',
                zipcodeAvailableClass: OtEstimatedMainClass + '-zipcode-available',
                zipcodeNotAvailableClass: OtEstimatedMainClass + '-zipcode-not-available',
                codAvailableClass: OtEstimatedMainClass + '-zipcode-cod-available',
                codNotAvailableClass: OtEstimatedMainClass + '-zipcode-cod-not-available',
                extraCostClass: OtEstimatedMainClass + '-zipcode-extra-cost',
                zipcodeCourierClass: OtEstimatedMainClass + '-zipcode-courier',
                customTextClass: OtEstimatedMainClass + '-zipcode-custom-text',
                zipcodeInputClass: OtEstimatedMainClass + '-zipcode-input',
                zipcodeNoticeClass: OtEstimatedMainClass + '-zipcode-notice-text',
                zipcodeSubmitBtnClass: OtEstimatedMainClass + '-zipcode-submit-btn',
                zipcodeShowInputZipcodeFormBtnClass: OtEstimatedMainClass + '-zipcode-show-input-zipcode-form',
                addToCartButton: "form[action^='/cart/add'] button"
            }

            this.init();
        }
        init() {
            if (this.settings.requireAddToCart == 1) { jQuery(this.selectors.addToCartButton).attr("disabled", true); }
            if (this.settings.get_customer_zipcode === "0") {
                this.displayInputZipcodeForm();
            }
            this.getDataZipcode().then(() => {
                this.findAvailableZipcodes()
                    .then(() => {
                        return this.getUserZipcode();
                    }).then(() => {
                        if (this.userZipcode) {
                            // then check if user zipcode is in list specific zipcode, show info. else show input.
                            this.findZipcodeSettingsBySpecificZipcode(this.userZipcode);
                            // If zipcode of user match with any zipcode settings, apply setting and display
                            if (this.currentZipcode) {
                                if (this.settings.requireAddToCart == 1) {
                                    jQuery(this.selectors.addToCartButton).attr("disabled", false);
                                }
                                this.displayZipcodeInfo();
                            } else {
                                // Else show input zipcode form to user
                                if (this.settings.requireAddToCart == 1) {
                                    jQuery(this.selectors.addToCartButton).attr("disabled", true);
                                }
                                this.displayInputZipcodeForm();
                            }
                        }
                    });
            })
        }
        getDataZipcode() {
            return new Promise(resolve => {
                var self = this;
                let url = `${this._app._rootLink}/client/Store/${this._app._shop}/dataZipcode.json?v=${this._app._v}`;
                OtEstimatedStaticMethods.getJsonFile({
                    url
                }).then((data) => {
                    self.listZipcodes = data.app.zipcode.listZipcodes;
                    self.specificProducts = data.app.zipcode.specificProducts;
                    self.specificCollections = data.app.zipcode.specificCollections;
                    self.specificVendors = data.app.zipcode.specificVendors;
                    resolve();
                });
            });
        }
        findAvailableZipcodes() {
            return new Promise((resolve, reject) => {
                this.findSpecificZipcodes()
                    .then(() => {
                        if (this.isUseSpecificZipcodes) {
                            if (this.specificZipcodes.length) {
                                this.availableZipcodes = this.specificZipcodes.map(specificZipcode => {
                                    let rawZipcodes = this.listZipcodes.find(c => c.id == specificZipcode.zipcode_id);
                                    rawZipcodes.estimated_days = specificZipcode.estimated_days;
                                    rawZipcodes.minimum_days = specificZipcode.minimum_days;
                                    rawZipcodes.custom_text = specificZipcode.custom_text;
                                    return rawZipcodes;
                                });
                            }
                        } else {
                            this.availableZipcodes = this.listZipcodes;
                        }
                        if (this.availableZipcodes.length > 0) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
            });
        }
        getUserZipcode() {
            return new Promise(resolve => {
                if (this.settings.get_customer_zipcode != 1) {
                    resolve();
                } else {
                    if (!this._app._userInfo || this._app._userInfo == null) {
                        this._app._getUserInfoByIp(true)
                            .then(() => {
                                this.userZipcode = this._app._userInfo.zip_code;
                                resolve();
                            })
                    } else {
                        this.userZipcode = this._app._userInfo.zip_code;
                        resolve();
                    }
                }
            });
        }
        findSpecificZipcodes() {
            return new Promise(resolve => {
                var product = this._app._product;
                var productId = product.id;
                var productVendor = product.vendor;
                switch (this.settings.for_all_product) {
                    case "0":
                        // Specific products
                        this.isUseSpecificZipcodes = true;
                        this.specificZipcodes = this.specificProducts.filter(e => e.product_id == productId);
                        resolve();
                        break;
                    case "2":
                        // Specific vendors
                        this.isUseSpecificZipcodes = true;
                        this.specificZipcodes = this.specificVendors.filter(e => e.name == productVendor);
                        resolve();
                        break;
                    case "3":
                        // Specific collections
                        this.isUseSpecificZipcodes = true;
                        this._app._getCollectionsByProductId().then(listCollections => {
                            if (listCollections && Array.isArray(listCollections)) {
                                this.specificZipcodes = this.specificCollections.filter(specificCollection => listCollections.some(collectionId => collectionId === Number(specificCollection.collection_id)));
                                resolve();
                            } else {
                                resolve();
                            }
                        })
                        break;
                    default:
                        // Default: all products
                        this.isUseSpecificZipcodes = false;
                        resolve()
                        break;
                }
            });
        }

        displayInputZipcodeForm() {
            var jQuery = this._app._jQuery;
            if (jQuery(`.${this.selectors.zipcodeLayoutClass}`).length == 0) {
                jQuery(`.${this.selectors.mainClass}`).append(`<div class="${this.selectors.zipcodeLayoutClass}"></div>`);
            }
            jQuery(`.${this.selectors.zipcodeLayoutClass}`).empty();
            jQuery(`.${this.selectors.zipcodeLayoutClass}`).append(`
                ${this.settings.input_label}
                <br>
                <input style="display:inline-block;" type="text" class="${this.selectors.zipcodeInputClass}" placeholder="${this.settings.input_placeholder}">
                <p class="${this.selectors.zipcodeSubmitBtnClass}"
                    style="
                        background-color: ${this.settings.submit_button_background_color};
                        cursor: pointer;
                        padding: 5px 10px;
                        color: #fff;
                        border: none;
                        display: inline;
                        margin: 0 0 0 5px;
                    "
                >
                    ${this.settings.submit_button}
                </p>
            `);
            jQuery(`body .${this.selectors.mainClass} .${this.selectors.zipcodeLayoutClass} .${this.selectors.zipcodeSubmitBtnClass}`)
                .on("click", () => {
                    let inputVal = jQuery(`.${this.selectors.mainClass} .${this.selectors.zipcodeLayoutClass} .${this.selectors.zipcodeInputClass}`).val();
                    if (inputVal) {
                        this.findZipcodeSettingsBySpecificZipcode(inputVal);
                        if (this.currentZipcode) {
                            // Display detail info about inputed zipcode
                            if (this.settings.requireAddToCart == 1) {
                                jQuery(this.selectors.addToCartButton).attr("disabled", false);
                            }
                            this.displayZipcodeInfo();
                        } else {
                            // Display notice
                            if (this.settings.requireAddToCart == 1) {
                                jQuery(this.selectors.addToCartButton).attr("disabled", true);
                            }

                            if (jQuery(`.${this.selectors.zipcodeNoticeClass}`).length == 0) {
                                jQuery(`.${this.selectors.zipcodeLayoutClass}`).append(`
                                    <p class='${this.selectors.zipcodeNoticeClass}'></p>
                                `);
                            }
                            jQuery(`.${this.selectors.zipcodeNoticeClass}`).empty();
                            jQuery(`.${this.selectors.zipcodeNoticeClass}`).html(`${this.settings.zipcode_not_available_text} ${inputVal}`);
                        }
                    }
                });
        }
        findZipcodeSettingsBySpecificZipcode(specificZipcode) {
            this.userZipcode = specificZipcode;
            this.currentZipcode = this.availableZipcodes.find(setting => {
                let zipcodeListString = setting.zipcode_list.replace(/\n/g, '');
                let listZipcodes = zipcodeListString.split(',');
                return listZipcodes.some(zipcode => {
                    zipcode = zipcode.trim();
                    // Check zipcode is in range of type startzip - end zip
                    if (zipcode.includes('-')) {
                        var startZip = zipcode.split('-')[0].trim();
                        var endZip = zipcode.split('-')[1].trim();
                        if (!isNaN(startZip) && !isNaN(endZip) && Number(startZip) <= Number(specificZipcode) && Number(specificZipcode) <= Number(endZip)) {
                            setting['user_zipcode'] = specificZipcode;
                            return true;
                        }
                    }
                    // else check typeof zipcode is Number
                    else if (!isNaN(zipcode) && !isNaN(specificZipcode)) {
                        if (zipcode == specificZipcode) {
                            setting['user_zipcode'] = specificZipcode;
                            return true;
                        } else {
                            return false
                        }
                    }
                    // else check typeof zipcode is string
                    // There are 2 cases
                    // First and priority: two string are equals
                    // Second: zipcode starting with user input
                    else if (typeof zipcode == "string" && typeof specificZipcode == "string") {
                        if (zipcode.toLowerCase() == specificZipcode.toLowerCase()) {
                            setting['user_zipcode'] = specificZipcode;
                            return true;
                        } else if (specificZipcode.toLowerCase().startsWith(zipcode.toLowerCase())) {
                            setting["user_zipcode"] = specificZipcode;
                            return true;
                        } else {
                            return false
                        }
                    } else {
                        return false;
                    }
                });
            });
        }
        displayZipcodeInfo() {
            var zipcodeSetting = this.currentZipcode;
            var jQuery = this._app._jQuery;
            var listInfo = [];
            // Generate text available if zipcode available
            if (zipcodeSetting.zipcode_available == 1) {
                listInfo.push(`
                    <p class="${this.selectors.zipcodeAvailableClass}">
                        <i class="fa fa-check"></i> 
                        ${this.settings.zipcode_available_text} ${zipcodeSetting.user_zipcode} 
                        <span class='${this.selectors.zipcodeShowInputZipcodeFormBtnClass}' style='cursor: pointer;'>
                            <i class="fas fa-sync-alt" aria-hidden="true"></i>
                        </span>
                    </p>
                `);
            }
            // Generate text not available if zipcode not available
            else {
                listInfo.push(`
                    <p class="${this.selectors.zipcodeNotAvailableClass}">
                        <i class="fa fa-times"></i> 
                        ${this.settings.zipcode_not_available_text} ${zipcodeSetting.user_zipcode} 
                        <span class='${this.selectors.zipcodeShowInputZipcodeFormBtnClass}' style='cursor: pointer;'>
                            <i class="fas fa-sync-alt" aria-hidden="true"></i>
                        </span>
                    </p>
                `);
            }
            // Generate estimated time
            if (zipcodeSetting.show_estimated_date == 1) {
                var calculatedDay = this._app._calculateStartAndEndDay({
                    minimumDays: zipcodeSetting.minimum_days,
                    estimatedDays: zipcodeSetting.estimated_days
                });
                var startDay = calculatedDay.startDay;
                var endDay = calculatedDay.endDay;
                // Main text date
                var mainText = this._app._generateMainEstimatedText({
                    rawEstimatedText: this.settings.estimated_text,
                    startDay,
                    endDay
                });
                listInfo.push(mainText);
            }

            // Generate COD infomation
            if (zipcodeSetting.show_cash_delivery == 1) {
                // Generate COD available
                if (zipcodeSetting.cash_delivery_available == 1) {
                    listInfo.push(`<p class="${this.selectors.codAvailableClass}"><i class="fa fa-check"></i> ${this.settings.cash_available_text}</p>`);
                } else {
                    listInfo.push(`<p class="${this.selectors.codNotAvailableClass}"><i class="fa fa-times"></i> ${this.settings.cash_not_available_text}</p>`);
                }
            }

            // Generate extra cost
            if (zipcodeSetting.show_extra_cost == 1) {
                listInfo.push(`<p class="${this.selectors.extraCostClass}"><i class="fa fa-check"></i> ${this.settings.extra_cost_text}${zipcodeSetting.extra_cost}</p>`);
            }

            // Generate courier
            if (zipcodeSetting.show_courier == 1) {
                listInfo.push(`
                    <p>
                        <i class="fa fa-check"></i> 
                        <a href="${zipcodeSetting.courier_url}" target="_blank"></a>
                        ${this.settings.shipping_via}${zipcodeSetting.courier_name}
                    </p>
                `);
            }

            // Generate custom text
            if (zipcodeSetting.show_custom_text == 1) {
                listInfo.push(`<p class="${this.selectors.customTextClass}">${zipcodeSetting.custom_text}</p>`);
            }

            // Display generated infos
            if (jQuery(`.${this.selectors.zipcodeLayoutClass}`).length == 0) {
                jQuery(`.${this.selectors.mainClass}`).append(`<div class="${this.selectors.zipcodeLayoutClass}"></div>`);
            }
            jQuery(`.${this.selectors.zipcodeLayoutClass}`).empty();
            listInfo.forEach(info => jQuery(`.${this.selectors.zipcodeLayoutClass}`).append(info));

            // Bind event when user click on refresh icon
            jQuery(`body .${this.selectors.mainClass} .${this.selectors.zipcodeLayoutClass} .${this.selectors.zipcodeShowInputZipcodeFormBtnClass}`)
                .on("click", () => {
                    this.displayInputZipcodeForm();
                });
        }
    }

    class OtEstimatedCountry {
        constructor({
            _app,
            listCountries,
            specificProducts,
            specificCollections
        }) {
            this._app = _app;
            this.listCountries = listCountries.map(country => {
                if (typeof country.provinces == "string") {
                    country.provinces = JSON.parse(country.provinces);
                }
                return country;
            });
            this.specificProducts = specificProducts;
            this.specificCollections = specificCollections;

            this.collectionIdsOfCurrentProduct = [];
            this.availableCountries = [];

            this.userCountryCode = "other_countries";
            this.userCountry = null;
            this.userCountryProvince = null;

            this.selectors = {
                mainClass: OtEstimatedMainClass,
                countryLayoutClass: OtEstimatedMainClass + '-country-layout',
                countryTextClass: OtEstimatedMainClass + '-country-delivery',
                courierTextClass: OtEstimatedMainClass + '-country-courier',
                customInfoClass: OtEstimatedMainClass + '-country-custom-info',
                showSelectBoxBtnClass: OtEstimatedMainClass + '-country-show-select-box-btn',
                selectBoxClass: OtEstimatedMainClass + '-country-select-box',
                selectCountryClass: OtEstimatedMainClass + '-country-select-box-country',
                selectProvinceClass: OtEstimatedMainClass + '-country-select-box-province'
            }

            this.init();
        }
        init() {
            this._app._getCollectionsByProductId().then(collectionIds => {
                if (collectionIds && Array.isArray(collectionIds)) {
                    this.collectionIdsOfCurrentProduct = collectionIds;
                }
                this.findAvailableCountries();
                if (this.availableCountries.length) {
                    this.getUserCountryCode().then(() => {
                        this.findUserCountry();
                        this.displayCountryInfo();
                    });
                }
            });
        }

        findAvailableCountries() {
			let product = this._app._product;
			let productId = product.id;
			let listSpecificRules = [];
			let listSpecificProductRules = [];
            let listSpecificCollectionRules = [];

            if (Array.isArray(this.specificProducts)) {
                listSpecificProductRules = this.specificProducts.filter(specificProduct => specificProduct.product_id == productId);
            }

            if (Array.isArray(this.specificCollections)){
                listSpecificCollectionRules = this.specificCollections.filter(specificCollection =>
                    this.collectionIdsOfCurrentProduct.some(
                        collectionId => specificCollection.collection_id == collectionId
                    )
                );
            }

			if (listSpecificProductRules.length > 0) {
				listSpecificRules = listSpecificProductRules;
			} else if (listSpecificCollectionRules.length > 0) {
				listSpecificRules = listSpecificCollectionRules;
			}

			if (listSpecificRules.length) {
				this.availableCountries = listSpecificRules.map(rule => {
					let country = this.listCountries.find(country => country.id == rule.country_id);
					country.minimum_days = rule.minimum_days;
					country.estimated_days = rule.estimated_days;
					country.custom_text = rule.custom_text;
					return country;
				});
                this.availableCountries.sort((country1, country2) => Number(country1.Ordering) - Number(country2.Ordering));
			} else {
				this.availableCountries = this.listCountries;
			}
		}

        getUserCountryCode() {
            return new Promise(resolve => {
                if (this._app._generalSettings.get_user_info == 1) {
                    if (!this._app._userInfo || this._app._userInfo == null) {
                        this._app._getUserInfoByIp(true)
                            .then(() => {
                                this.userCountryCode = this._app._userInfo.country_code;
                                resolve();
                            })
                    } else {
                        this.userCountryCode = this._app._userInfo.country_code;
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        }

        findUserCountry() {
            // Find user country code match with settings  
            if (this._app._generalSettings.get_user_info == "0") {
                this.userCountry = this.availableCountries[0];
            } else {
                let country = this.listCountries.find(e => e.code.toUpperCase() == this.userCountryCode.toUpperCase());
                if (country) {
                    this.userCountry = country;
                } else {
                    this.userCountry = this.availableCountries[0];
                }
            }
        }

        displayCountryInfo() {
            var jQuery = this._app._jQuery;
            let displayCountry = this.userCountry;
            let displayProvince = this.userCountryProvince;
            var minimumDays = displayProvince && displayProvince.hasOwnProperty('use_custom_day') && displayProvince.use_custom_day ? displayProvince.minimum_days : displayCountry.minimum_days;
            var estimatedDays = displayProvince && displayProvince.hasOwnProperty('use_custom_day') && displayProvince.use_custom_day ? displayProvince.estimated_days : displayCountry.estimated_days;
            //---- Calculate start day and end day
            var calculatedDay = this._app._calculateStartAndEndDay({
                minimumDays,
                estimatedDays
            });
            var startDay = calculatedDay.startDay;
            var endDay = calculatedDay.endDay;

            // ---- Gen list info will be display
            var listInfo = [];
            // Show country 
            if (displayProvince && displayProvince != null) {
                var deliveryTo = `<p class="${this.selectors.countryTextClass}">${displayCountry.delivery_label}${`${displayProvince.name}, `}${displayCountry.name}`;
                if (jQuery(`.${this.selectors.selectBoxClass}`).length == 0) {
                    deliveryTo += ` <i class="fas fa-sync-alt ${this.selectors.showSelectBoxBtnClass}"></i></p>`;
                } else {
                    deliveryTo += '</p>';
                }
                listInfo.push(deliveryTo);
                window.typePropertiesLableInput = "Delivery to";
                window.propertiesLableInput = `${`${displayProvince.name}, `}${displayCountry.name}` + " - ";
            } else {
                var deliveryTo = `<p class="${this.selectors.countryTextClass}">${displayCountry.delivery_label}${displayCountry.name}`;
                if (jQuery(`.${this.selectors.selectBoxClass}`).length == 0) {
                    deliveryTo += ` <i class="fas fa-sync-alt ${this.selectors.showSelectBoxBtnClass}"></i></p>`;
                } else {
                    deliveryTo += '</p>';
                }
                listInfo.push(deliveryTo);
                window.typePropertiesLableInput = "Delivery to";
                window.propertiesLableInput = `${displayCountry.name}` + " - ";
            }
            // Show Estimated date
            if (typeof displayCountry.custom_text != "undefined" && displayCountry.custom_text != "") {
                displayCountry.estimated_text = displayCountry.custom_text;
            }
            var mainText = this._app._generateMainEstimatedText({
                rawEstimatedText: displayCountry.estimated_text,
                startDay,
                endDay
            });
            listInfo.push(mainText);
            // displayCountry.estimated_text;

            // Show courier
            if (displayCountry.display_courier_info == '1') {
                var courier = displayCountry.courier_url != '' ? `<a target="_blank" href="${displayCountry.courier_url}">${displayCountry.courier_name}</a>` : displayCountry.courier_name;
                var shippingVia = '<p class="' + this.selectors.courierTextClass + '"><i class="fa fa-check"></i> ' + displayCountry.courier_label + courier + '</p>';
                listInfo.push(shippingVia);
            }

            // Show custom info
            if (displayProvince && displayProvince.hasOwnProperty('custom_info') && displayProvince.custom_info != '') {
                var customProvinceInfo = `<p class="${this.selectors.customInfoClass}">${displayProvince.custom_info}</p>`;
                listInfo.push(customProvinceInfo);
            } else if (displayCountry.custom_info && displayCountry.custom_info != '') {
                var customCountryInfo = `<p class="${this.selectors.customInfoClass}">${displayCountry.custom_info}</p>`;
                listInfo.push(customCountryInfo);
            }

            // Display
            if (jQuery(`.${this.selectors.countryLayoutClass}`).length == 0) {
                jQuery(`.${this.selectors.mainClass}`).append(`<div class="${this.selectors.countryLayoutClass}"></div>`);
            }
            jQuery(`.${this.selectors.countryLayoutClass}`).empty();
            listInfo.forEach(info => jQuery(`.${this.selectors.countryLayoutClass}`).append(info));

            jQuery(`.${this.selectors.mainClass} .${this.selectors.countryLayoutClass} .${this.selectors.showSelectBoxBtnClass}`)
                .on("click", () => {
                    this.displaySelectCountry();
                });
        }

        displaySelectCountry() {
            var jQuery = this._app._jQuery;
            // Remove the button
            jQuery(`.${this.selectors.mainClass} .${this.selectors.countryLayoutClass} .${this.selectors.showSelectBoxBtnClass}`).remove();

            // Append select box
            if (!jQuery(`.${this.selectors.mainClass} .${this.selectors.countryLayoutClass} .${this.selectors.selectBoxClass}`)[0]) {
                jQuery(`.${this.selectors.mainClass}`).prepend(`
                    <div class="${this.selectors.selectBoxClass}">
                        <select class="${this.selectors.selectCountryClass}"></select>
                    </div>
                `);
                this.availableCountries.forEach(country => {
                    jQuery(`.${this.selectors.selectCountryClass}`).append(`
                        <option value="${country.code}">${country.name}</option>
                    `);
                });
            }

            // Call this function will automatic check current country has province or not
            // If has, we will append a new select province box
            this.selectCountryChange();
        }

        selectCountryChange() {
            var jQuery = this._app._jQuery;
            var currentCode = jQuery(`.${this.selectors.selectCountryClass}`).val();
            var currentCountry = this.listCountries.find(e => e.code == currentCode);
            this.userCountry = currentCountry;

            jQuery(`.${this.selectors.selectProvinceClass}`).remove();
            if (currentCountry.provinces.length > 0 && currentCountry.show_sub_regions == 1) {
                if (!jQuery(`.${this.selectors.selectBoxClass} .${this.selectors.selectProvinceClass}`)[0]) {
                    jQuery(`.${this.selectors.selectBoxClass}`).append(`
                        <select class="${this.selectors.selectProvinceClass}">
                            <option value="">---</option>
                        </select>
                    `);
                    currentCountry.provinces.forEach(province => {
                        if (!province.hasOwnProperty('enable_shipping') || province.enable_shipping == 1) {
                            jQuery(`.${this.selectors.selectProvinceClass}`).append(`
                                <option value="${province.code}">${province.name}</option>
                            `)
                        }
                    });
                }
            } else {
                this.userCountryProvince = null;
            }
            this.displayCountryInfo();
            this.bindTrigger();
        }

        bindTrigger() {
            jQuery(`.${this.selectors.mainClass} .${this.selectors.selectBoxClass} .${this.selectors.selectCountryClass}`)
                .on("change", () => {
                    // Bind this function when user select another country
                    // We will rerender
                    this.selectCountryChange();
                });

            jQuery(`.${this.selectors.mainClass} .${this.selectors.selectBoxClass} .${this.selectors.selectProvinceClass}`).on('change', () => {
                if (this.userCountry && this.userCountry.provinces.length > 0) {
                    var currentProvinceCode = jQuery(`.${this.selectors.selectProvinceClass}`).val();
                    if (currentProvinceCode) {
                        this.userCountryProvince = this.userCountry.provinces[this.userCountry.provinces.findIndex(e => e.code == currentProvinceCode)];
                        this.displayCountryInfo();
                    } else {
                        this.userCountryProvince = null;
                        this.displayCountryInfo();
                    }
                }
            })
        }
    }

    window.OtEstimated = new OtEstimated();
}
function apiGetInfoEst(productID, countryCode) {
    return new Promise((resolve) => {
        $.ajax({
            url: `${OtEstimatedRootLink}/client/services/EstimatedDate.php`,
            type: 'GET',
            dataType: 'json',
            data: {
                action: 'getEstProductByCountry',
                shop: Shopify.shop,
                productID: productID,
                countryCode: countryCode
            }
        }).done((response) => {
            resolve(response);
        })
    });
}

