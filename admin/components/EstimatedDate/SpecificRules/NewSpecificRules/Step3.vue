<template>
  <div id="estimated-date-preview" :style="style">
    <p v-html="generateMainEstimatedText()"></p>
    <div class="shipping-privacy" v-html="generatePrivacy()"></div>
    <p v-html="generateCustomText()"></p>
  </div>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/newSpecificRule/getRule",
      generalSettings: "generalSettings/getSettings",
      estimatedDateSettings: "estimatedDate/getSettings",
      shippingMethods: "shippingMethods/getShippingMethods",
    }),
    style() {
      if (this.generalSettings) {
        return {
          fontSize: this.generalSettings.text_size + "px",
          color: this.generalSettings.text_color,
          backgroundColor: this.generalSettings.background_color,
          border: "2px solid" + this.generalSettings.border_color,
          borderRadius: "5px",
        };
      } else {
        return {};
      }
    },
    selectedMethod() {
      let method = this.shippingMethods.find(
        (e) => e.id == this.rule.shipping_method_id
      );
      return method;
    },
  },
  methods: {
    generateMainEstimatedText() {
      let rawEstimatedText = this.rule.estimated_text;
      let icon = this.selectedMethod.icon;
      let dateFormat = this.generalSettings.date_format;
      let { startDay, endDay } = this.calculateStartAndEndDay();
      let estimatedText = rawEstimatedText.replace(
        "{date}",
        `<span>${moment(startDay).format(dateFormat)}</span>`
      );
      estimatedText = estimatedText.replace(
        "{date+1}",
        `<span>${moment(endDay).format(dateFormat)}</span>`
      );
      estimatedText = `${icon} ${estimatedText}`;
      return estimatedText;
    },
    calculateStartAndEndDay() {
      let minimumDays = this.rule.minimum_days;
      let estimatedDays = this.rule.estimated_days;
      var workingDays = this.generalSettings.week_working_days;
      var specialDayOffs = this.generalSettings.specific_day_off;
      // Begin calculate start day
      var startDay = calculateStartDay(
        minimumDays,
        specialDayOffs,
        workingDays
      );
      // Begin calculate end day
      var endDay = calculateEndDay(
        startDay,
        estimatedDays,
        specialDayOffs,
        workingDays
      );
      return {
        startDay: startDay,
        endDay: endDay,
      };

      function calculateStartDay(minimumDays, specialDayOffs, workingDays) {
        var startDay = new Date();
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
            var weekDay = workingDays.find((e) => e.day == today);
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
          var weekDay = workingDays.find((e) => e.day == today);
          var condition = weekDay.cut_off_after.split(":");
          var conditionHour = Number(condition[0]);
          var conditionMinute = Number(condition[1]);
          if (
            weekDay.enable != 1 ||
            currentHour > conditionHour ||
            (currentHour == conditionHour && currentMinute >= conditionMinute)
          ) {
            return true;
          } else {
            return false;
          }
        }
      }

      function calculateEndDay(
        startDay,
        estimatedDays,
        specialDayOffs,
        workingDays
      ) {
        var endDay = startDay;
        for (var i = 0; i < estimatedDays; i++) {
          endDay = increaseDateTimeByDays(endDay, 1);
          var compareDay = handleLocalDateTime(endDay);
          if (specialDayOffs.indexOf(compareDay) > -1) {
            estimatedDays++;
          } else {
            var today = endDay.getDay();
            var weekDay = workingDays.find((e) => e.day == today);
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
          day = "0" + day;
        }
        month = month + 1;
        if (month < 10) {
          month = "0" + month;
        }
        return `${year}-${month}-${day}`;
      }
    },
    generatePrivacy() {
      var privacyText = this.selectedMethod.privacy_text;
      if (privacyText != "") {
        var shippingPrivacy = "";
        shippingPrivacy += `<p>`;
        shippingPrivacy += `<span>${privacyText}</span>`;
        if (this.estimatedDateSettings.privacy_page_url != "") {
          shippingPrivacy += `
            <a class="shipping-privacy-href" target="_blank" href="${this.estimatedDateSettings.privacy_page_url}">
              <span>${this.estimatedDateSettings.privacy_page_text}</span>
            </a>
          `;
        } else {
          shippingPrivacy += `
            <span>${this.estimatedDateSettings.privacy_page_text}</span>
          `;
        }
        if (this.estimatedDateSettings.privacy_more) {
          shippingPrivacy += `
            <span class="shipping-privacy-more">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                <span class="shipping-privacy-more-popup">
                  ${this.estimatedDateSettings.privacy_more}
                </span>
            <span>
          `;
        }
        shippingPrivacy += "</p>";
        return shippingPrivacy;
      } else {
        return null;
      }
    },
    generateCustomText() {
      if (this.rule.custom_text) {
        return this.rule.custom_text;
      } else {
        return null;
      }
    },
  },
};
</script>

<style scoped>
#estimated-date-preview {
  padding: 10px;
  margin: auto;
}
</style>

