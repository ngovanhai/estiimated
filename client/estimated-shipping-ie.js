//debugger;
"use strict"; 
function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

if (typeof window.OtEstimated == 'undefined' || !window.OtEstimated) {
  var OtEstimatedMainClass = "ot-estimated-shipping";
  var timeBegin = new Date().getTime();

  var OtEstimatedStaticMethods =
  /*#__PURE__*/
  function () {
    function OtEstimatedStaticMethods() {
      _classCallCheck(this, OtEstimatedStaticMethods);
    }

    _createClass(OtEstimatedStaticMethods, null, [{
      key: "loadJquery",
      // Because we defined this is a static methods,
      // so all params we will need passing to it
      value: function loadJquery(_ref) {
        var wantedVersion = _ref.wantedVersion;
        wantedVersion = wantedVersion || "1.9.1";
        return new Promise(function (resolve) {
          if (typeof jQuery === 'undefined' || parseFloat(jQuery.fn.jquery) < parseFloat(wantedVersion)) {
            OtEstimatedStaticMethods.getScript({
              source: "//ajax.googleapis.com/ajax/libs/jquery/".concat(wantedVersion, "/jquery.min.js")
            }).then(function () {
              var jQueryNoConflict = jQuery.noConflict(true);
              resolve(jQueryNoConflict);
            });
          } else {
            resolve(jQuery);
          }
        });
      }
    }, {
      key: "getVersion",
      value: function getVersion(_ref2) {
        var url = _ref2.url;
        var version = OtEstimatedStaticMethods.getParameterByName({
          name: "v",
          url: url
        });
        
        return version ? version : new Date().getTime();
      }
    }, {
      key: "getJsonFile",
      value: function getJsonFile(_ref3) {
        var url = _ref3.url;
        return new Promise(function (resolve) {
          fetch(url).then(function (response) {
            return response.json();
          }).then(function (data) {
            resolve(data);
          });
        });
      }
    }, {
      key: "getParameterByName",
      value: function getParameterByName(_ref4) {
        var name = _ref4.name,
            url = _ref4.url;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url); 
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
    }, {
      key: "logTime",
      value: function logTime(logState) {
        var timeEnd = new Date().getTime();
        var diff = timeEnd - timeBegin;
        logState = logState.replace("{diff}", diff);
      }
    }, {
      key: "getScript",
      value: function getScript(_ref5) {
        var source = _ref5.source;
        return new Promise(function (resolve) {
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
    }]);

    return OtEstimatedStaticMethods;
  }();

  var OtEstimated =
  /*#__PURE__*/
  function () {
    // Define global variable
    // All variable and function inside this need to start with a underscore "_"
    // so we can easily recognize them
    function OtEstimated() {
      _classCallCheck(this, OtEstimated);

      // Root api
      this._rootLink = OtEstimatedRootLink;
      this._rootShopifyApi = this._rootLink + "/client/services/_shopify.php";
      this._ip2LocationApi = this._rootLink + "/client/services/Ip2Location.php";
      this._rootAssetFolder = this._rootLink + "/assets"; // Current Script Url
      var me = null;
      var scripts = document.getElementsByTagName("script") 
      for (var i = 0; i < scripts.length; ++i) { 
          if(scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').indexOf("estimated-shipping/client/estimated-shipping.js") > -1){
            me = scripts[i].getAttribute('src');
          }
      }  
      this._scriptUrl = me; 
    //   this._scriptUrl = document.currentScript.src; // Current version

      this._v = 0; // Curremt viewing url

      this._currentUrl = window.location.href.split("/"); // Shop name

      this._shop = Shopify.shop; // Information about current user who is viewing this page

      this._userInfo = null; // CurrentViewing product

      this._product = meta && meta.product ? meta.product : {}; // Bind jquery into this variable after check

      this._jQuery = null; // Bind all data from json

      this._data = null; // General settings Of Estimated Shipping

      this._generalSettings = null; // All Shipping Methods
      // Selectors

      this._selectors = {
        mainClass: OtEstimatedMainClass,
        mainTextClass: OtEstimatedMainClass + '-main-text',
        startDayTextClass: OtEstimatedMainClass + '-start-day',
        endDayTextClass: OtEstimatedMainClass + '-end-day',
        shippingMethodClass: OtEstimatedMainClass + '-shipping-methods',
        shippingMethodSelectBoxClass: OtEstimatedMainClass + '-shipping-methods-select-box',
        shippingMethodSelectItemClass: OtEstimatedMainClass + '-shipping-methods-select-item',
        countryFlagImageClass: OtEstimatedMainClass + '-country-flag-image'
      }; // Init app

      this._init();
    }

    _createClass(OtEstimated, [{
      key: "_init",
      value: function _init() {
        var _this = this;

        this._getVersion().then(function () {
          return _this._getJsonFile();
        }).then(function () {
          return _this._loadJQuery();
        }).then(function () {
          return _this._validateCondition();
        }).then(function () {
          return _this._localizeMoment();
        }).then(function () {
          return _this._getUserInfoByIp();
        }).then(function () {
          _this._switchToOptionalLayout();

          _this._createParentClass();

          _this._applyCss();

          _this._initLayout();
        }).catch(function () {});
      }
    }, {
      key: "_getVersion",
      value: function _getVersion() {
        var _this2 = this;

        return new Promise(function (resolve) {
          _this2._v = OtEstimatedStaticMethods.getVersion({
            url: _this2._scriptUrl
          });
          resolve();
        });
      }
    }, {
      key: "_getJsonFile",
      value: function _getJsonFile() {
        var _this3 = this;

        return new Promise(function (resolve) {
          var url = "".concat(_this3._rootLink, "/client/Store/").concat(_this3._shop, "/data.json?v=").concat(_this3._v);
          OtEstimatedStaticMethods.getJsonFile({
            url: url
          }).then(function (data) {
            _this3._data = data.app;
            _this3._generalSettings = data.app.settings;
            OtEstimatedStaticMethods.logTime("JSON data loaded after : {diff} milliseconds");
            resolve();
          });
        });
      }
    }, {
      key: "_loadJQuery",
      value: function _loadJQuery() {
        var _this4 = this;

        return new Promise(function (resolve) {
          OtEstimatedStaticMethods.loadJquery({
            wantedVersion: _this4._generalSettings.jquery_version
          }).then(function (jQuery) {
            _this4._jQuery = jQuery;
            resolve();
          });
        });
      }
    }, {
      key: "_validateCondition",
      value: function _validateCondition() {
        var _this5 = this;

        return new Promise(function (resolve, reject) {
          if (_this5._generalSettings.enable_app == 1 && _this5._generalSettings.show_on_pages.split(',').some(function (e) {
            return _this5._currentUrl.indexOf(e) > -1;
          })) {
            _this5._validateProducts().then(function () {
              resolve();
            }).catch(function () {
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
    }, {
      key: "_validateProducts",
      value: function _validateProducts() {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
          var currentUrl = window.location.href;
          var fullUrlParts = document.location.href.split("variant=");
          var variantID = fullUrlParts["1"];

          if (_this6._generalSettings.disable_when_product_is_out_of_stock == 1) {
            _this6._getProductById({
              productId: _this6._product.id
            }).then(function () {
              if (_this6._product && Array.isArray(_this6._product.variants)) {
                if (typeof variantID != "undefined") {
                  if (_this6._product.variants.some(function (variant) {
                    return variant.inventory_management == 'shopify' && variant.inventory_policy == 'deny' && variant.inventory_quantity < 1 && variantID == variant.id;
                  })) {
                    reject();
                  }
                } else {
                  variantID = _this6._product.variants[0]['id'];

                  if (_this6._product.variants.some(function (variant) {
                    return variant.inventory_management == 'shopify' && variant.inventory_policy == 'deny' && variant.inventory_quantity < 1 && variantID == variant.id;
                  })) {
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
    }, {
      key: "_switchToOptionalLayout",
      value: function _switchToOptionalLayout() {
        var customLayout = this._jQuery(".".concat(this._selectors.mainClass)).attr('data-layout');

        if (_typeof(customLayout) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) && customLayout !== false) {
          this._generalSettings.layout = customLayout;
        }
      }
    }, {
      key: "_initLayout",
      value: function _initLayout() {
        switch (this._generalSettings.layout) { 
          case "1":
            window.OtEstimatedDate = new OtEstimatedDate({
              _app: this,
              shippingMethods: this._data.shippingMethods,
              settings: this._data.estimatedDate.settings,
              specificRules: this._data.estimatedDate.specificRules,
              specificRuleTargets: this._data.estimatedDate.specificRuleTargets
            });
            break;

          case "2":
            window.OtEstimatedZipcode = new OtEstimatedZipcode({
              _app: this,
              shippingMethods: this._data.shippingMethods,
              settings: this._data.zipcode.settings,
              specificRules: this._data.estimatedDate.specificRules,
              listZipcodes: this._data.zipcode.listZipcodes,
              specificProducts: this._data.zipcode.specificProducts,
              specificCollections: this._data.zipcode.specificCollections,
              specificVendors: this._data.zipcode.specificVendors,
            });
            break;

          case "3":
            window.OtEstimatedCountry = new OtEstimatedCountry({
              _app: this,
              specificProducts: this._data.country.specificProducts,
              listCountries: this._data.country.listCountries
            });
            break;

          default:
            break;
        }
      }
    }, {
      key: "_localizeMoment",
      value: function _localizeMoment() {
        var _this7 = this;

        return new Promise(function (resolve) {
          if (_this7._generalSettings.date_locale === 'en') {
            resolve();
          } else {
            OtEstimatedStaticMethods.getScript({
              source: "".concat(_this7._rootAssetFolder, "/js/moment/locales/").concat(_this7._generalSettings.date_locale, ".js")
            }).then(function () {
              OtEstimatedStaticMethods.logTime('Localized after : {diff} milliseconds');
              resolve();
            });
          }
        });
      }
    }, {
      key: "_createParentClass",
      value: function _createParentClass() {
        if (this._jQuery(".".concat(this._selectors.mainClass)).length == 0) {
          var _this$_generalSetting = this._generalSettings,
              custom_position = _this$_generalSetting.custom_position,
              position = _this$_generalSetting.position;
          var appendTo = custom_position || position;

          this._jQuery(appendTo).append("\n                            <!-- Start OmegaTheme Estimated Shipping For Shopify -->\n                            <div class='".concat(this._selectors.mainClass, "'></div>\n                            <!-- End OmegaTheme Estimated Shipping For Shopify -->\n                        "));
        }
      }
    }, {
      key: "_applyCss",
      value: function _applyCss() {
        var htmlcss = "";

        if (Shopify.shop != "pallet-bedz-company.myshopify.com") {
          htmlcss += "<link href='".concat(this._rootLink, "/assets/lib/font-awesome/css/font-awesome.min.css?v=").concat(this._v, "' rel='stylesheet'>");
        }

        htmlcss += " \n                <link href='".concat(this._rootLink, "/assets/css/estimated-shipping.css?v=").concat(this._v, "' rel='stylesheet' type='text/css'>\n                <link href='").concat(this._rootLink, "/assets/flags/flags.css?v=").concat(this._v, "' rel='stylesheet' type='text/css'>\n                <style>\n                    [class^=\"").concat(this._selectors.mainClass, "\"] {\n                        font-size : ").concat(this._generalSettings.text_size, "px;\n                        color     : ").concat(this._generalSettings.text_color, ";\n                    }\n                    ").concat(this._generalSettings.custom_css, "\n                </style>\n            ");

        this._jQuery('body').append(htmlcss);
      }
    }, {
      key: "_calculateStartAndEndDay",
      value: function _calculateStartAndEndDay(_ref6) {
        var minimumDays = _ref6.minimumDays,
            estimatedDays = _ref6.estimatedDays;
        var self = this;
        var workingDays = this._generalSettings.week_working_days !== '' ? JSON.parse(this._generalSettings.week_working_days) : [];
        var specialDayOffs = this._generalSettings.specific_day_off && this._generalSettings.specific_day_off != '' && this._generalSettings.specific_day_off != null ? JSON.parse(this._generalSettings.specific_day_off) : []; // Begin calculate start day 

        var startDay = calculateStartDay(minimumDays, specialDayOffs, workingDays); // Begin calculate end day

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
              var weekDay = workingDays.find(function (e) {
                return e.day == today;
              });

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
            var weekDay = workingDays.find(function (e) {
              return e.day == today;
            });
            var condition = weekDay.cut_off_after.split(":");
            var conditionHour = Number(condition[0]);
            var conditionMinute = Number(condition[1]);

            if (weekDay.enable != 1 || currentHour > conditionHour || currentHour == conditionHour && currentMinute >= conditionMinute) {
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
              var weekDay = workingDays.find(function (e) {
                return e.day == today;
              });

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

          return "".concat(year, "-").concat(month, "-").concat(day);
        }
      }
    }, {
      key: "_generateMainEstimatedText",
      value: function _generateMainEstimatedText(_ref7) {
        var rawEstimatedText = _ref7.rawEstimatedText,
            startDay = _ref7.startDay,
            endDay = _ref7.endDay,
            icon = _ref7.icon;
        var self = this; 
        if (self._generalSettings.textCountDownFormat != "" && self._generalSettings.textCountDownFormat != null) {
          var otCountDown = setInterval(function () {
            appendCountDownTime(self._generalSettings, window.workingDays);
          }, 1000);
        } 
        icon = icon ? icon : self._generalSettings.estimated_icon ? self._generalSettings.estimated_icon : "<i class='fa fa-check'></i>";
         
        // debugger;
        if (icon.indexOf("{country_code}") > -1 && self._userInfo && self._userInfo.country_code) {
          icon = icon.replace("{country_code}", self._userInfo.country_code.toLowerCase());
        }
        console.log("self._generalSettings.date_format",self._generalSettings.date_format)
        var dateFormat = self._generalSettings.date_format;
        var estimatedText = rawEstimatedText.replace('{date}', "<span class=\"".concat(self._selectors.startDayTextClass, "\">").concat(moment(startDay).format(dateFormat), "</span>"));
        estimatedText = estimatedText.replace('{date+1}', "<span class=\"".concat(self._selectors.endDayTextClass, "\">").concat(moment(endDay).format(dateFormat), "</span>"));
        console.log("estimatedText",estimatedText)
        if (self._generalSettings.textCountDownFormat != "" && self._generalSettings.textCountDownFormat != null) {
          var today = new Date().getDay();
          var weekDay = workingDays.find(function (e) {
            return e.day == today;
          });

          if (weekDay.enable != "0") {
            self._generalSettings.textCountDownFormat = self._generalSettings.textCountDownFormat.replace('{TimeCountDown}', "<span class=\"otCountDown\"></span>");
            estimatedText = " ".concat(self._generalSettings.textCountDownFormat, "   ").concat(estimatedText);
          }
        }

        estimatedText = "".concat(icon, "    ").concat(estimatedText);
        estimatedText = "<p class=\"".concat(self._selectors.mainTextClass, "\">").concat(estimatedText, "</p>");

        self._bindEstimatedTextAsHiddenInput({
          rawEstimatedText: rawEstimatedText,
          startDay: startDay,
          endDay: endDay
        });
        console.log("estimatedText",estimatedText)
        return estimatedText;

        function appendCountDownTime(generalSettings, workingDays) {
          var startDay = self._createDate();

          var today = startDay.getDay();
          var currentHour = startDay.getHours();
          var currentMinute = startDay.getMinutes();
          var currentSecond = startDay.getSeconds();
          var weekDay = workingDays.find(function (e) {
            return e.day == today;
          });

          if (weekDay.enable != "0") {
            var caculatorTime = diff(currentHour + ":" + currentMinute + ":" + currentSecond, weekDay.cut_off_after + ":" + "59");

            if(generalSettings.typeTimeCountdown == 1){
                var html = `
                <span class="ot-seckill-time-div" id="seckill_time">
                    <span id="h_val" class="seckill-time-num h">${caculatorTime['hours']} ${generalSettings.hours}</span>
                    <span class="seckill-time-colon">:</span>
                    <span id="m_val" class="seckill-time-num m">${caculatorTime['minutes']} ${generalSettings.minutes}</span>
                    <span class="seckill-time-colon">:</span>
                    <span  id="s_val" class="seckill-time-num s">${caculatorTime['seconds']} ${generalSettings.seconds}</span>
                </span> 
                `;  
            }else if(generalSettings.typeTimeCountdown == 2){
                var html = `
                <span class="ot-seckill-time-div" id="seckill_time">
                    <span id="h_val" class="seckill-time-num h">${caculatorTime['hours']}</span>
                    <span class="seckill-time-colon">:</span>
                    <span id="m_val" class="seckill-time-num m">${caculatorTime['minutes']}</span>
                    <span class="seckill-time-colon">:</span>
                    <span  id="s_val" class="seckill-time-num s">${caculatorTime['seconds']}</span>
                </span> 
                `;  
            }else{
                var html = `
                <span class="ot-seckill-time-div" id="seckill_time">
                    <span id="h_val" class="seckill-time-num h">${caculatorTime['hours']}</span>
                    <span class="seckill-time-colon">:</span>
                    <span id="m_val" class="seckill-time-num m">${caculatorTime['minutes']}</span> 
                </span> 
                `;  
            }
            if ($(".ot-seckill-time-div").length > 0) {
              $(".otCountDown").empty();
              $(".otCountDown").append(html);
            } else {
              $(".otCountDown").append(html);
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
          var seconds = Math.floor(diff / 1000); // If using time pickers with 24 hours format, add the below line get exact hours

          if (hours < 0) hours = hours + 24;
          if (hours < 9) hours = "0" + hours;
          if (minutes < 9) minutes = "0" + minutes;
          if (seconds < 9) seconds = "0" + seconds;
          var result = [];
          result['hours'] = hours;
          result['minutes'] = minutes;
          result['seconds'] = seconds;
          return result;
        }
      }
    }, {
      key: "_bindEstimatedTextAsHiddenInput",
      value: function _bindEstimatedTextAsHiddenInput(_ref8) {
        var rawEstimatedText = _ref8.rawEstimatedText,
            startDay = _ref8.startDay,
            endDay = _ref8.endDay;

        if (this._jQuery(".otExistRule").length > 0) {
          this._jQuery(".otExistRule").remove();
        } // Each time we generate estimated text
        // We will check to bind a hidden input to product's submit form
        // So the shop owner can see it when customer complete order which have estimated


        if (this._currentUrl.indexOf('products') > -1 && this._generalSettings.show_on_line_item == 1 && rawEstimatedText) {
          // Get Date Format
          var dateFormat = this._generalSettings.date_format;
          var startWithStartDate = false;
          var startWithEndDate = false;
          var raw = []; // We will split the raw estimated text into an array which has two elements
          // The first element is the property of the propduct in cart
          // The second element is the value of that property in cart

          if (rawEstimatedText.indexOf('{date}') > -1) {
            // Split by a fixed characters {date}
            raw = rawEstimatedText.split('{date}');
            startWithStartDate = true;
          } else if (rawEstimatedText.indexOf('{date+1}') > -1) {
            // Split by a fixed characters {date+1}
            raw = rawEstimatedText.split('{date+1}');
            startWithEndDate = true;
          }

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

            fieldName = fieldName.replace(/"/g, "'"); // Toggle an hidden input to form  

            if (typeof window.propertiesLableInput == "undefined") window.propertiesLableInput = "";

            if (this._jQuery("form[action=\"/cart/add\"] input[name=\"properties[".concat(fieldName, "]\"]")).length) {
              this._jQuery("form[action=\"/cart/add\"] input[name=\"properties[".concat(fieldName, "]\"]")).remove();
            }

            if (this._jQuery(".otEstimatedShipping").length > 0) {
              this._jQuery(".otEstimatedShipping").remove();
            }

            this._jQuery('form[action^="/cart/add"]').prepend("\n                            <input type=\"hidden\" class=\"otExistRule\"  name=\"properties[".concat(fieldName, "]\" value=\"").concat(fieldValue, "\">\n                        "));

            if (this._generalSettings.showNameMethodInPropertites == 1) {
              this._jQuery('form[action^="/cart/add"]').prepend("\n                                <input type=\"hidden\" class=\"otEstimatedShipping\" name=\"properties[".concat(window.typePropertiesLableInput, "]\" value=\"").concat(window.propertiesLableInput, "\">\n                            "));
            }
          } else {
            this._jQuery('form[action^="/cart/add"]').prepend("\n                            <input type=\"hidden\" class=\"otExistRule\"  name=\"properties[ ]\" value=\"".concat(rawEstimatedText, "\">\n                        "));

            if (this._generalSettings.showNameMethodInPropertites == 1) {
              this._jQuery('form[action^="/cart/add"]').prepend("\n                                <input type=\"hidden\" class=\"otEstimatedShipping\" name=\"properties[".concat(window.typePropertiesLableInput, "]\" value=\"").concat(window.propertiesLableInput, "\">\n                            "));
            }
          }
        }
      }
    }, {
      key: "_displayShippingMethods",
      value: function _displayShippingMethods(shippingMethods) {
        var jQuery = this._jQuery;

        if (shippingMethods.length > 1 && jQuery(".".concat(this._selectors.shippingMethodClass)).length == 0) {
          var selectMethods = "<div class=\"".concat(this._selectors.shippingMethodClass, "\">");
          selectMethods += "<select class=\"".concat(this._selectors.shippingMethodSelectBoxClass, "\">");
          window.propertiesLableInput = shippingMethods[0]['name'] + " - ";
          window.typePropertiesLableInput = "Method shipping";
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = shippingMethods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var method = _step.value;
              selectMethods += "<option class=\"".concat(this._selectors.shippingMethodSelectItemClass, "\" value=\"").concat(method.id, "\">").concat(method.name, "</option>");
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          selectMethods += "</select>";
          selectMethods += "</div>";
          jQuery(".".concat(this._selectors.mainClass)).append(selectMethods);
          jQuery(".".concat(this._selectors.shippingMethodSelectBoxClass)).on("change", function (e) {
            jQuery(document).trigger("OtEstimated_OnShippingMethodHasChanged", [{
              methodId: jQuery(this).val()
            }]);
          });
        }
      }
    }, {
      key: "_getCollectionsByProductId",
      value: function _getCollectionsByProductId() {
        var _this8 = this;

        return new Promise(function (resolve, reject) {
          _this8._jQuery.ajax({
            url: "".concat(_this8._rootShopifyApi),
            type: 'GET',
            data: {
              shop: _this8._shop,
              action: 'getCollectionsByProductId',
              productId: _this8._product.id
            },
            dataType: 'json'
          }).done(function (result) {
            if (!_this8._jQuery.isEmptyObject(result)) {
              resolve(result);
            } else {
              resolve(null);
            }
          });
        });
      }
    }, {
      key: "_getProductById",
      value: function _getProductById() {
        var _this9 = this;

        return new Promise(function (resolve, reject) {
          _this9._jQuery.ajax({
            url: "".concat(_this9._rootShopifyApi),
            type: 'GET',
            data: {
              shop: _this9._shop,
              action: 'getProductById',
              productId: _this9._product.id
            },
            dataType: 'json'
          }).done(function (result) {
            if (!_this9._jQuery.isEmptyObject(result)) {
              _this9._product = result.product;
              resolve(result);
            } else {
              resolve(null);
            }
          });
        });
      }
    }, {
      key: "_getUserInfoByIp",
      value: function _getUserInfoByIp(forceGet) {
        var _this10 = this;

        return new Promise(function (resolve) {
          if (forceGet || _this10._generalSettings.get_user_info && Number(_this10._generalSettings.get_user_info) === 1) {
            _this10._jQuery.ajax({
              url: "".concat(_this10._ip2LocationApi),
              type: 'GET',
              data: {
                action: 'getInfo'
              },
              dataType: 'json'
            }).done(function (result) {
              OtEstimatedStaticMethods.logTime("Get user info after: {diff} milliseconds");
              _this10._userInfo = result;
              resolve();
            });
          } else {
            resolve();
          }
        });
      }
    }, {
      key: "_createDate",
      value: function _createDate(d) {
        var timezone = function (rawTimezone) {
          if (!rawTimezone) return new Date().getTimezoneOffset();
          var timeGMT = rawTimezone.substring(rawTimezone.lastIndexOf("(") + 1, rawTimezone.lastIndexOf(")"));
          var timeGMTSplit = timeGMT.split("");
          var hour = Number(timeGMTSplit[3] + timeGMTSplit[4] + timeGMTSplit[5]) * -1;
          var minute = Number(timeGMTSplit[7] + timeGMTSplit[8]);
          if (minute === 30) minute = 0.5;
          var timezone = hour + minute;
          var timezoneToMinute = timezone * 60;
          return timezoneToMinute;
        }(this._generalSettings.date_timezone_offset);

        var localTimezone = new Date().getTimezoneOffset();
        var diff = timezone - localTimezone;
        var date = d ? new Date(d) : new Date();

        var momentDate = moment(date).utcOffset(-diff)._d;

        return momentDate;
      }
    }]);

    return OtEstimated;
  }();

  var OtEstimatedDate =
  /*#__PURE__*/
  function () {
    function OtEstimatedDate(_ref9) {
      var _app = _ref9._app,
          shippingMethods = _ref9.shippingMethods,
          settings = _ref9.settings,
          specificRules = _ref9.specificRules,
          specificRuleTargets = _ref9.specificRuleTargets;

      _classCallCheck(this, OtEstimatedDate);
     
      this._app = _app;
      this.shippingMethods = shippingMethods;
      this.settings = settings;
      this.specificRules = specificRules;
      this.specificRuleTargets = specificRuleTargets;
      this.availableRules = [];
      this.specificTargets = [];
      this.availableShippingMethods = [];
      this.currentMethod = null;
      this.error = null; // Specific selectors for estimated date

      this.selectors = {
        mainClass: OtEstimatedMainClass,
        basicLayoutClass: OtEstimatedMainClass + '-basic-layout',
        shippingPrivacyClass: OtEstimatedMainClass + '-basic-shipping-privacy',
        shippingPrivacyTextClass: OtEstimatedMainClass + '-basic-shipping-privacy-text',
        shippingPrivacyMoreClass: OtEstimatedMainClass + '-basic-shipping-privacy-more',
        shippingPrivacyMorePopupClass: OtEstimatedMainClass + '-basic-shipping-privacy-more-popup',
        productCustomTextClass: OtEstimatedMainClass + '-product-custom-text'
      };
      this.init();
    }

    _createClass(OtEstimatedDate, [{
      key: "init",
      value: function init() {
        var _this11 = this;
        this.findSpecificTargets().then(function () {
          return _this11.findAvailableRules();
        }).then(function () {
          return _this11.findAvailableShippingMethods();
        }).then(function () {
           if (_this11.availableShippingMethods.length) {
            _this11._app._displayShippingMethods(_this11.availableShippingMethods);

            _this11.setCurrentShippingMethod(0); 
            _this11.displayEstimatedTime();

            _this11.bindTrigger();
          }
        }).catch(function (error) {
          _this11.error = error.message;
        });
      }
    }, {
      key: "findSpecificTargets",
      value: function findSpecificTargets() {
        var _this12 = this;

        return new Promise(function (resolve) {
          var allTargets = _this12.specificRuleTargets;
          var product = _this12._app._product;
          var productId = product.id;
          var productVendor = product.vendor;
          // console.log("allTargets",allTargets);
          // debugger;
          _this12._app._getCollectionsByProductId().then(function (productCollections) {
            productCollections = productCollections || [];
            _this12.specificTargets = allTargets.filter(function (target) {
              return Number(target.value) === productId || productCollections.indexOf(Number(target.value)) > -1 || target.value === productVendor;
            });
            resolve();
          });
        });
      }
    }, {
      key: "findAvailableRules",
      value: function findAvailableRules() {
        var _this13 = this;
        // console.log("allTargets",allTargets);
        // debugger;
        return new Promise(function (resolve) {
          if (_this13.specificTargets.length) {
            _this13.availableRules = _this13.specificRules.filter(function (rule) {
              return _this13.specificTargets.some(function (target) {
                return Number(target.rule_id) === Number(rule.id);
              });
            });
          }

          resolve();
        });
      }
    }, {
      key: "findAvailableShippingMethods",
      value: function findAvailableShippingMethods() {
        var _this14 = this;

        return new Promise(function (resolve) {
          if (_this14.availableRules.length) {
            var availableMethods = []; 
            _this14.shippingMethods.forEach(function (method) {
              var rule = _this14.availableRules.find(function (rule) {
                return Number(method.id) === Number(rule.shipping_method_id);
              });

              if (rule) {
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

            _this14.availableShippingMethods = availableMethods;
          } else if (Number(_this14.settings.only_show_specific_targets) === 0) {
            // debugger;
            _this14.availableShippingMethods = _this14.shippingMethods.filter(function (method) {
              return Number(method.is_private) === 0;
            });
          } else {
            _this14.availableShippingMethods = [];
          }

          resolve();
        });
      }
    }, {
      key: "setCurrentShippingMethod",
      value: function setCurrentShippingMethod(index) {
        var method = this.availableShippingMethods[index];
        this.currentMethod = JSON.parse(JSON.stringify(method));
      }
    }, {
      key: "displayEstimatedTime",
      value: function displayEstimatedTime() { 
        var _this15 = this;

        var jQuery = this._app._jQuery; // Push all info to one array: listHtml

        var listHtml = []; // Calculate and Generate estimated day
        // -- Calculate

        var calculatedDay = this._app._calculateStartAndEndDay({
          minimumDays: this.currentMethod.minimum_days,
          estimatedDays: this.currentMethod.estimated_days
        });

        var startDay = calculatedDay.startDay;
        var endDay = calculatedDay.endDay; // -- Generate

        var mainText = this._app._generateMainEstimatedText({
          rawEstimatedText: this.currentMethod.estimated_text,
          icon: this.currentMethod.icon,
          startDay: startDay,
          endDay: endDay
        }); 
        listHtml.push(mainText); // Shipping privacy
        console.log("mainText",mainText)
        var privacyText = this.currentMethod.privacy_text;

        if (privacyText != '') {
          privacyText = privacyText.replace('{date}', this.currentMethod.estimated_days);
          var shippingPrivacy = '';
          shippingPrivacy += "<div class=\"".concat(this.selectors.shippingPrivacyClass, "\">");
          shippingPrivacy += "<p class=\"".concat(this.selectors.shippingPrivacyTextClass, "\">");
          shippingPrivacy += "<span>".concat(privacyText, "</span>");

          if (this.settings.privacy_page_url != '') {
            shippingPrivacy += "\n                            <a class=\"shipping-privacy-href\" href=\"".concat(this.settings.privacy_page_url, "\" target=\"_blank\">\n                                <span>").concat(this.settings.privacy_page_text, "</span>\n                            </a>\n                        ");
          } else {
            shippingPrivacy += "\n                            <span>".concat(this.settings.privacy_page_text, "</span>\n                        ");
          }

          if (this.settings.privacy_more) {
            shippingPrivacy += "\n                            <span class=\"".concat(this.selectors.shippingPrivacyMoreClass, "\">\n                                <i class=\"fas fa-info-circle\" aria-hidden=\"true\"></i>\n                                <span class=\"").concat(this.selectors.shippingPrivacyMorePopupClass, "\" style=\"display: none;\">\n                                    ").concat(this.settings.privacy_more, "\n                                </span>\n                            <span>\n                        ");
          }

          shippingPrivacy += "</p>";
          shippingPrivacy += "</div>";
          listHtml.push(shippingPrivacy);
        } // Custom text for specific product


        if (this.currentMethod.custom_text) {
          listHtml.push("<p class=\"".concat(this.selectors.productCustomTextClass, "\">").concat(this.currentMethod.custom_text, "</p>"));
        } // Display


        if (jQuery(".".concat(this.selectors.basicLayoutClass)).length == 0) {
          jQuery(".".concat(this.selectors.mainClass)).append("<div class=\"".concat(this.selectors.basicLayoutClass, "\"></div>"));
        }

        jQuery(".".concat(this.selectors.basicLayoutClass)).empty();
        listHtml.forEach(function (info) {
          return jQuery(".".concat(_this15.selectors.basicLayoutClass)).append(info);
        });
        jQuery(".".concat(this.selectors.shippingPrivacyMoreClass)).on("click", function () {
          jQuery(".".concat(_this15.selectors.shippingPrivacyMoreClass, " .").concat(_this15.selectors.shippingPrivacyMorePopupClass)).toggle();
        });
        OtEstimatedStaticMethods.logTime("App run after : {diff} milliseconds");
      }
    }, {
      key: "bindTrigger",
      value: function bindTrigger() {
        var _this16 = this;

        var jQuery = this._app._jQuery;
        jQuery(document).on("OtEstimated_OnShippingMethodHasChanged", function (e, context) {
          var methodId = context.methodId;

          _this16.availableShippingMethods.forEach(function (method, index) {
            if (method.id == methodId) {
              _this16.setCurrentShippingMethod(index);

              _this16.displayEstimatedTime();

              if ($(".otEstimatedShipping").length > 0) $(".otEstimatedShipping").remove();
              window.propertiesLableInput = method.name + " - ";
              window.typePropertiesLableInput = "Method shipping";

              if (_this16._generalSettings.showNameMethodInPropertites == 1) {
                jQuery('form[action^="/cart/add"]').prepend(" <input type=\"hidden\" class=\"otEstimatedShipping\" name=\"properties[".concat(window.typePropertiesLableInput, "]\" value=\"").concat(window.propertiesLableInput, "\"> "));
              }
            }
          });
        });
      }
    }]);

    return OtEstimatedDate;
  }();

  var OtEstimatedZipcode =
  /*#__PURE__*/
  function () {
    function OtEstimatedZipcode(_ref10) {
      var _app = _ref10._app,
          settings = _ref10.settings,
          listZipcodes = _ref10.listZipcodes,
          specificProducts = _ref10.specificProducts,
          specificCollections = _ref10.specificCollections,
          specificVendors = _ref10.specificVendors; 
      _classCallCheck(this, OtEstimatedZipcode); 
      this._app = _app;
      this.settings = settings;
      this.listZipcodes = listZipcodes;
      this.specificProducts = specificProducts;
      this.specificCollections = specificCollections;
      this.specificVendors = specificVendors;
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
        zipcodeShowInputZipcodeFormBtnClass: OtEstimatedMainClass + '-zipcode-show-input-zipcode-form'
      };
      this.init();
    }

    _createClass(OtEstimatedZipcode, [{
      key: "init",
      value: function init() {
        var _this17 = this;

        this.findAvailableZipcodes().then(function () {
          return _this17.getUserZipcode();
        }).then(function () {
          if (_this17.userZipcode) {
            // then check if user zipcode is in list specific zipcode, show info. else show input.
            _this17.findZipcodeSettingsBySpecificZipcode(_this17.userZipcode); // If zipcode of user match with any zipcode settings, apply setting and display


            if (_this17.currentZipcode) {
              _this17.displayZipcodeInfo();
            } else {
              // Else show input zipcode form to user
              _this17.displayInputZipcodeForm();
            }
          } else {
            // Else show input zipcode form to user
            _this17.displayInputZipcodeForm();
          }

          OtEstimatedStaticMethods.logTime("App run after : {diff} milliseconds");
        });
      }
    }, {
      key: "getUserZipcode",
      value: function getUserZipcode() {
        var _this18 = this;

        return new Promise(function (resolve) {
          if (_this18.settings.get_customer_zipcode != 1) {
            resolve();
          } else {
            if (!_this18._app._userInfo || _this18._app._userInfo == null) {
              _this18._app._getUserInfoByIp(true).then(function () {
                _this18.userZipcode = _this18._app._userInfo.zip_code;
                resolve();
              });
            } else {
              _this18.userZipcode = _this18._app._userInfo.zip_code;
              resolve();
            }
          }
        });
      }
    }, {
      key: "findSpecificZipcodes",
      value: function findSpecificZipcodes() {
        var _this19 = this;

        return new Promise(function (resolve) {
          var product = _this19._app._product;
          var productId = product.id;
          var productVendor = product.vendor;

          switch (_this19.settings.for_all_product) {
            case "0":
              // Specific products
              _this19.isUseSpecificZipcodes = true;
              // debugger;
              _this19.specificZipcodes = _this19.specificProducts.filter(function (e) {
                return e.product_id == productId;
              });
              resolve();
              break;

            case "2":
              // Specific vendors
              _this19.isUseSpecificZipcodes = true;
              // debugger;
              _this19.specificZipcodes = _this19.specificVendors.filter(function (e) {
                return e.name == productVendor;
              });
              resolve();
              break;

            case "3":
              // Specific collections
              _this19.isUseSpecificZipcodes = true;
              // debugger;
              _this19._app._getCollectionsByProductId().then(function (listCollections) {
                if (listCollections && Array.isArray(listCollections)) {
                  _this19.specificZipcodes = _this19.specificCollections.filter(function (specificCollection) {
                    return listCollections.some(function (collectionId) {
                      return collectionId === Number(specificCollection.collection_id);
                    });
                  });
                  resolve();
                } else {
                  resolve();
                }
              });

              break;

            default:
              // Default: all products
              _this19.isUseSpecificZipcodes = false;
              resolve();
              break;
          }
        });
      }
    }, {
      key: "findAvailableZipcodes",
      value: function findAvailableZipcodes() {
        var _this20 = this;

        return new Promise(function (resolve, reject) {
          _this20.findSpecificZipcodes().then(function () {
            if (_this20.isUseSpecificZipcodes) {
              if (_this20.specificZipcodes.length) {
                _this20.availableZipcodes = _this20.specificZipcodes.map(function (specificZipcode) {
                  var rawZipcodes = _this20.listZipcodes.find(function (c) {
                    return c.id == specificZipcode.zipcode_id;
                  });

                  rawZipcodes.estimated_days = specificZipcode.estimated_days;
                  rawZipcodes.minimum_days = specificZipcode.minimum_days;
                  rawZipcodes.custom_text = specificZipcode.custom_text;
                  return rawZipcodes;
                });
              }
            } else {
              _this20.availableZipcodes = _this20.listZipcodes;
            }
            if(typeof _this20.availableZipcodes == "undefined"){
                reject();
            }else{
                if (_this20.availableZipcodes.length > 0) {
                    resolve();
                } else {
                    reject();
                }
            } 
          });
        });
      }
    }, {
      key: "displayInputZipcodeForm",
      value: function displayInputZipcodeForm() {
        var _this21 = this;

        var jQuery = this._app._jQuery;

        if (jQuery(".".concat(this.selectors.zipcodeLayoutClass)).length == 0) {
          jQuery(".".concat(this.selectors.mainClass)).append("<div class=\"".concat(this.selectors.zipcodeLayoutClass, "\"></div>"));
        }

        jQuery(".".concat(this.selectors.zipcodeLayoutClass)).empty();
        jQuery(".".concat(this.selectors.zipcodeLayoutClass)).append("\n                    ".concat(this.settings.input_label, "\n                    <br>\n                    <input style=\"display:inline-block;\" type=\"text\" class=\"").concat(this.selectors.zipcodeInputClass, "\" placeholder=\"").concat(this.settings.input_placeholder, "\">\n                    <p class=\"").concat(this.selectors.zipcodeSubmitBtnClass, "\"\n                        style=\"\n                            background-color: ").concat(this.settings.submit_button_background_color, ";\n                            cursor: pointer;\n                            padding: 5px 10px;\n                            color: #fff;\n                            border: none;\n                            display: inline;\n                            margin: 0 0 0 5px;\n                        \"\n                    >\n                        ").concat(this.settings.submit_button, "\n                    </p>\n                "));
        jQuery("body .".concat(this.selectors.mainClass, " .").concat(this.selectors.zipcodeLayoutClass, " .").concat(this.selectors.zipcodeSubmitBtnClass)).on("click", function () {
          var inputVal = jQuery(".".concat(_this21.selectors.mainClass, " .").concat(_this21.selectors.zipcodeLayoutClass, " .").concat(_this21.selectors.zipcodeInputClass)).val();

          if (inputVal) {
            _this21.findZipcodeSettingsBySpecificZipcode(inputVal);

            if (_this21.currentZipcode) {
              // Display detail info about inputed zipcode
              _this21.displayZipcodeInfo();
            } else {
              // Display notice
              if (jQuery(".".concat(_this21.selectors.zipcodeNoticeClass)).length == 0) {
                jQuery(".".concat(_this21.selectors.zipcodeLayoutClass)).append("\n                                        <p class='".concat(_this21.selectors.zipcodeNoticeClass, "'></p>\n                                    "));
              }

              jQuery(".".concat(_this21.selectors.zipcodeNoticeClass)).empty();
              jQuery(".".concat(_this21.selectors.zipcodeNoticeClass)).html("".concat(_this21.settings.zipcode_not_available_text, " ").concat(inputVal));
            }
          }
        });
      }
    }, {
      key: "findZipcodeSettingsBySpecificZipcode",
      value: function findZipcodeSettingsBySpecificZipcode(specificZipcode) {
        this.userZipcode = specificZipcode;
        this.currentZipcode = this.availableZipcodes.find(function (setting) {
          var zipcodeListString = setting.zipcode_list.replace(/\n/g, '');
          var listZipcodes = zipcodeListString.split(',');
          return listZipcodes.some(function (zipcode) {
            zipcode = zipcode.trim(); // Check zipcode is in range of type startzip - end zip

            if (zipcode.indexOf('-') > -1) {
              var startZip = zipcode.split('-')[0].trim();
              var endZip = zipcode.split('-')[1].trim();

              if (!isNaN(startZip) && !isNaN(endZip) && Number(startZip) <= Number(specificZipcode) && Number(specificZipcode) <= Number(endZip)) {
                setting['user_zipcode'] = specificZipcode;
                return true;
              }
            } // else check typeof zipcode is Number
            else if (!isNaN(zipcode) && !isNaN(specificZipcode)) {
                if (zipcode == specificZipcode) {
                  setting['user_zipcode'] = specificZipcode;
                  return true;
                } else {
                  return false;
                }
              } // else check typeof zipcode is string
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
                    return false;
                  }
                } else {
                  return false;
                }
          });
        });
      }
    }, {
      key: "displayZipcodeInfo",
      value: function displayZipcodeInfo() {
        var _this22 = this;

        var zipcodeSetting = this.currentZipcode;
        var jQuery = this._app._jQuery;
        var listInfo = []; // Generate text available if zipcode available

        if (zipcodeSetting.zipcode_available == 1) {
          listInfo.push("\n                        <p class=\"".concat(this.selectors.zipcodeAvailableClass, "\">\n                            <i class=\"fa fa-check\"></i> \n                            ").concat(this.settings.zipcode_available_text, " ").concat(zipcodeSetting.user_zipcode, " \n                            <span class='").concat(this.selectors.zipcodeShowInputZipcodeFormBtnClass, "' style='cursor: pointer;'>\n                                <i class=\"fas fa-sync-alt\" aria-hidden=\"true\"></i>\n                            </span>\n                        </p>\n                    "));
        } // Generate text not available if zipcode not available
        else {
            listInfo.push("\n                        <p class=\"".concat(this.selectors.zipcodeNotAvailableClass, "\">\n                            <i class=\"fa fa-times\"></i> \n                            ").concat(this.settings.zipcode_not_available_text, " ").concat(zipcodeSetting.user_zipcode, " \n                            <span class='").concat(this.selectors.zipcodeShowInputZipcodeFormBtnClass, "' style='cursor: pointer;'>\n                                <i class=\"fas fa-sync-alt\" aria-hidden=\"true\"></i>\n                            </span>\n                        </p>\n                    "));
          } // Generate estimated time


        if (zipcodeSetting.show_estimated_date == 1) {
          var calculatedDay = this._app._calculateStartAndEndDay({
            minimumDays: zipcodeSetting.minimum_days,
            estimatedDays: zipcodeSetting.estimated_days
          });

          var startDay = calculatedDay.startDay;
          var endDay = calculatedDay.endDay; // Main text date

          var mainText = this._app._generateMainEstimatedText({
            rawEstimatedText: this.settings.estimated_text,
            startDay: startDay,
            endDay: endDay
          });

          listInfo.push(mainText);
        } // Generate COD infomation


        if (zipcodeSetting.show_cash_delivery == 1) {
          // Generate COD available
          if (zipcodeSetting.cash_delivery_available == 1) {
            listInfo.push("<p class=\"".concat(this.selectors.codAvailableClass, "\"><i class=\"fa fa-check\"></i> ").concat(this.settings.cash_available_text, "</p>"));
          } else {
            listInfo.push("<p class=\"".concat(this.selectors.codNotAvailableClass, "\"><i class=\"fa fa-times\"></i> ").concat(this.settings.cash_not_available_text, "</p>"));
          }
        } // Generate extra cost


        if (zipcodeSetting.show_extra_cost == 1) {
          listInfo.push("<p class=\"".concat(this.selectors.extraCostClass, "\"><i class=\"fa fa-check\"></i> ").concat(this.settings.extra_cost_text).concat(zipcodeSetting.extra_cost, "</p>"));
        } // Generate courier


        if (zipcodeSetting.show_courier == 1) {
          listInfo.push("\n                        <p>\n                            <i class=\"fa fa-check\"></i> \n                            <a href=\"".concat(zipcodeSetting.courier_url, "\" target=\"_blank\"></a>\n                            ").concat(this.settings.shipping_via).concat(zipcodeSetting.courier_name, "\n                        </p>\n                    "));
        } // Generate custom text


        if (zipcodeSetting.show_custom_text == 1) {
          listInfo.push("<p class=\"".concat(this.selectors.customTextClass, "\">").concat(zipcodeSetting.custom_text, "</p>"));
        } // Display generated infos


        if (jQuery(".".concat(this.selectors.zipcodeLayoutClass)).length == 0) {
          jQuery(".".concat(this.selectors.mainClass)).append("<div class=\"".concat(this.selectors.zipcodeLayoutClass, "\"></div>"));
        }

        jQuery(".".concat(this.selectors.zipcodeLayoutClass)).empty();
        listInfo.forEach(function (info) {
          return jQuery(".".concat(_this22.selectors.zipcodeLayoutClass)).append(info);
        }); // Bind event when user click on refresh icon

        jQuery("body .".concat(this.selectors.mainClass, " .").concat(this.selectors.zipcodeLayoutClass, " .").concat(this.selectors.zipcodeShowInputZipcodeFormBtnClass)).on("click", function () {
          _this22.displayInputZipcodeForm();
        });
      }
    }]);

    return OtEstimatedZipcode;
  }();

  var OtEstimatedCountry =
  /*#__PURE__*/
  function () {
    function OtEstimatedCountry(_ref11) {
      var _app = _ref11._app,
          listCountries = _ref11.listCountries,
          specificProducts = _ref11.specificProducts;

      _classCallCheck(this, OtEstimatedCountry);

      this._app = _app;
      this.listCountries = listCountries.map(function (country) {
        if (typeof country.provinces == "string") {
          country.provinces = JSON.parse(country.provinces);
        }

        return country;
      });
      this.specificProducts = specificProducts;
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
      };
      this.init();
    }

    _createClass(OtEstimatedCountry, [{
      key: "init",
      value: function init() {
        var _this23 = this;

        this.findAvailableCountries();

        if (this.availableCountries.length) {
          this.getUserCountryCode().then(function () {
            _this23.findUserCountry();

            _this23.displayCountryInfo();
          });
        }
      }
    }, {
      key: "findAvailableCountries",
      value: function findAvailableCountries() {
        var _this24 = this;

        var product = this._app._product;
        var productId = product.id; 
        var listSpecificRules = this.specificProducts.filter(function (e) {
          return e.product_id == productId;
        });

        if (listSpecificRules.length) {
          this.availableCountries = listSpecificRules.map(function (e) {
            var country = _this24.listCountries.find(function (c) {
              return c.id == e.country_id;
            });

            country.minimum_days = e.minimum_days;
            country.estimated_days = e.estimated_days;
            country.custom_text = e.custom_text;
            return country;
          });
        } else {
          this.availableCountries = this.listCountries;
        }
      }
    }, {
      key: "getUserCountryCode",
      value: function getUserCountryCode() {
        var _this25 = this;

        return new Promise(function (resolve) {
          if (_this25._app._generalSettings.get_user_info == 1) {
            if (!_this25._app._userInfo || _this25._app._userInfo == null) {
              _this25._app._getUserInfoByIp(true).then(function () {
                _this25.userCountryCode = _this25._app._userInfo.country_code;
                resolve();
              });
            } else {
              _this25.userCountryCode = _this25._app._userInfo.country_code;
              resolve();
            }
          } else {
            resolve();
          }
        });
      }
    }, {
      key: "findUserCountry",
      value: function findUserCountry() {
        var _this26 = this;

        // Find user country code match with settings
        var country = this.listCountries.find(function (e) {
          return e.code.toUpperCase() == _this26.userCountryCode.toUpperCase();
        });

        if (country) {
          this.userCountry = country;
        } else {
          this.userCountry = this.listCountries[0];
        }
      }
    }, {
      key: "displayCountryInfo",
      value: function displayCountryInfo() {
        var _this27 = this;

        var jQuery = this._app._jQuery;
        var displayCountry = this.userCountry;
        var displayProvince = this.userCountryProvince;
        var minimumDays = displayProvince && displayProvince.hasOwnProperty('use_custom_day') && displayProvince.use_custom_day ? displayProvince.minimum_days : displayCountry.minimum_days;
        var estimatedDays = displayProvince && displayProvince.hasOwnProperty('use_custom_day') && displayProvince.use_custom_day ? displayProvince.estimated_days : displayCountry.estimated_days; //---- Calculate start day and end day

        var calculatedDay = this._app._calculateStartAndEndDay({
          minimumDays: minimumDays,
          estimatedDays: estimatedDays
        });

        var startDay = calculatedDay.startDay;
        var endDay = calculatedDay.endDay; // ---- Gen list info will be display

        var listInfo = []; // Show country

        if (displayProvince && displayProvince != null) {
          var deliveryTo = "<p class=\"".concat(this.selectors.countryTextClass, "\">").concat(displayCountry.delivery_label, "".concat(displayProvince.name, ", ")).concat(displayCountry.name);

          if (jQuery(".".concat(this.selectors.selectBoxClass)).length == 0) {
            deliveryTo += " <i class=\"fas fa-sync-alt ".concat(this.selectors.showSelectBoxBtnClass, "\"></i></p>");
          } else {
            deliveryTo += '</p>';
          }

          listInfo.push(deliveryTo);
          window.typePropertiesLableInput = "Delivery to";
          window.propertiesLableInput = "".concat("".concat(displayProvince.name, ", "), displayCountry.name) + " - ";
        } else {
          var deliveryTo = "<p class=\"".concat(this.selectors.countryTextClass, "\">").concat(displayCountry.delivery_label).concat(displayCountry.name);

          if (jQuery(".".concat(this.selectors.selectBoxClass)).length == 0) {
            deliveryTo += " <i class=\"fas fa-sync-alt ".concat(this.selectors.showSelectBoxBtnClass, "\"></i></p>");
          } else {
            deliveryTo += '</p>';
          }

          listInfo.push(deliveryTo);
          window.typePropertiesLableInput = "Delivery to";
          window.propertiesLableInput = "".concat(displayCountry.name) + " - ";
        } // Show Estimated date


        var mainText = this._app._generateMainEstimatedText({
          rawEstimatedText: displayCountry.estimated_text,
          startDay: startDay,
          endDay: endDay
        });
        console.log("mainText",mainText)
        listInfo.push(mainText); // displayCountry.estimated_text;
        // Show courier

        if (displayCountry.display_courier_info == '1') {
          var courier = displayCountry.courier_url != '' ? "<a target=\"_blank\" href=\"".concat(displayCountry.courier_url, "\">").concat(displayCountry.courier_name, "</a>") : displayCountry.courier_name;
          var shippingVia = '<p class="' + this.selectors.courierTextClass + '"><i class="fa fa-check"></i> ' + displayCountry.courier_label + courier + '</p>';
          listInfo.push(shippingVia);
        } // Show custom info


        if (displayProvince && displayProvince.hasOwnProperty('custom_info') && displayProvince.custom_info != '') {
          var customProvinceInfo = "<p class=\"".concat(this.selectors.customInfoClass, "\">").concat(displayProvince.custom_info, "</p>");
          listInfo.push(customProvinceInfo);
        } else if (displayCountry.custom_info && displayCountry.custom_info != '') {
          var customCountryInfo = "<p class=\"".concat(this.selectors.customInfoClass, "\">").concat(displayCountry.custom_info, "</p>");
          listInfo.push(customCountryInfo);
        } // Display


        if (jQuery(".".concat(this.selectors.countryLayoutClass)).length == 0) {
          jQuery(".".concat(this.selectors.mainClass)).append("<div class=\"".concat(this.selectors.countryLayoutClass, "\"></div>"));
        }

        jQuery(".".concat(this.selectors.countryLayoutClass)).empty();
        listInfo.forEach(function (info) {
          return jQuery(".".concat(_this27.selectors.countryLayoutClass)).append(info);
        });
        jQuery(".".concat(this.selectors.mainClass, " .").concat(this.selectors.countryLayoutClass, " .").concat(this.selectors.showSelectBoxBtnClass)).on("click", function () {
          _this27.displaySelectCountry();
        });
      }
    }, {
      key: "displaySelectCountry",
      value: function displaySelectCountry() {
        var _this28 = this;

        var jQuery = this._app._jQuery; // Remove the button

        jQuery(".".concat(this.selectors.mainClass, " .").concat(this.selectors.countryLayoutClass, " .").concat(this.selectors.showSelectBoxBtnClass)).remove(); // Append select box

        if (!jQuery(".".concat(this.selectors.mainClass, " .").concat(this.selectors.countryLayoutClass, " .").concat(this.selectors.selectBoxClass))[0]) {
          jQuery(".".concat(this.selectors.mainClass)).prepend("\n                        <div class=\"".concat(this.selectors.selectBoxClass, "\">\n                            <select class=\"").concat(this.selectors.selectCountryClass, "\"></select>\n                        </div>\n                    "));
          this.listCountries.forEach(function (country) {
            jQuery(".".concat(_this28.selectors.selectCountryClass)).append("\n                            <option value=\"".concat(country.code, "\">").concat(country.name, "</option>\n                        "));
          });
        } // Call this function will automatic check current country has province or not
        // If has, we will append a new select province box


        this.selectCountryChange();
      }
    }, {
      key: "selectCountryChange",
      value: function selectCountryChange() {
        var _this29 = this;

        var jQuery = this._app._jQuery;
        var currentCode = jQuery(".".concat(this.selectors.selectCountryClass)).val();
        var currentCountry = this.listCountries.find(function (e) {
          return e.code == currentCode;
        });
        this.userCountry = currentCountry;
        jQuery(".".concat(this.selectors.selectProvinceClass)).remove();

        if (currentCountry.provinces.length > 0 && currentCountry.show_sub_regions == 1) {
          if (!jQuery(".".concat(this.selectors.selectBoxClass, " .").concat(this.selectors.selectProvinceClass))[0]) {
            jQuery(".".concat(this.selectors.selectBoxClass)).append("\n                            <select class=\"".concat(this.selectors.selectProvinceClass, "\">\n                                <option value=\"\">---</option>\n                            </select>\n                        "));
            currentCountry.provinces.forEach(function (province) {
              if (!province.hasOwnProperty('enable_shipping') || province.enable_shipping == 1) {
                jQuery(".".concat(_this29.selectors.selectProvinceClass)).append("\n                                    <option value=\"".concat(province.code, "\">").concat(province.name, "</option>\n                                "));
              }
            });
          }
        } else {
          this.userCountryProvince = null;
        }

        this.displayCountryInfo();
        this.bindTrigger();
      }
    }, {
      key: "bindTrigger",
      value: function bindTrigger() {
        var _this30 = this;

        jQuery(".".concat(this.selectors.mainClass, " .").concat(this.selectors.selectBoxClass, " .").concat(this.selectors.selectCountryClass)).on("change", function () {
          // Bind this function when user select another country
          // We will rerender
          _this30.selectCountryChange();
        });
        jQuery(".".concat(this.selectors.mainClass, " .").concat(this.selectors.selectBoxClass, " .").concat(this.selectors.selectProvinceClass)).on('change', function () {
          if (_this30.userCountry && _this30.userCountry.provinces.length > 0) {
            var currentProvinceCode = jQuery(".".concat(_this30.selectors.selectProvinceClass)).val();

            if (currentProvinceCode) {
              _this30.userCountryProvince = _this30.userCountry.provinces[_this30.userCountry.provinces.findIndex(function (e) {
                return e.code == currentProvinceCode;
              })];

              _this30.displayCountryInfo();
            } else {
              _this30.userCountryProvince = null;

              _this30.displayCountryInfo();
            }
          }
        });
      }
    }]);

    return OtEstimatedCountry;
  }();

  window.OtEstimated = new OtEstimated();
}