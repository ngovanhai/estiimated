<template>
  <viewing-card title="Date Config" :show-content="true">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Day Offs</div>
        <div class="panel-component-item-content">
          <div
            class="show-item-on-hover"
            v-for="(dayoff, index) in settings.specific_day_off"
            :key="index"
          >
            <datepicker
              class="el-input__inner"
              v-model="settings.specific_day_off[index]"
              :config="config"
              placeholder="Select a date"
              style="width: 150px; margin: 5px 0;"
            ></datepicker>
            <el-button
              class="item-to-show"
              type="text"
              size="small"
              @click="settings.specific_day_off.splice(index, 1)"
            >
              <i class="far fa-trash-alt"></i>
            </el-button>
          </div>
          <el-button type="text" @click="settings.specific_day_off.push(null)">Add day off</el-button>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Format</div>
        <div class="panel-component-item-content"> 
          <el-select v-model="settings.date_format" placeholder="Select">
            <el-option
              v-for="(format, index) in dateFormats"
              :key="index"
              :label="formatDate(format)"
              :value="format"
            ></el-option>
          </el-select>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Language</div>
        <div class="panel-component-item-content">
          <el-select v-model="settings.date_locale" placeholder="Select" @change="localizeMoment">
            <el-option
              v-for="locale in locales"
              :key="locale.value"
              :label="locale.title"
              :value="locale.value"
            ></el-option>
          </el-select>
        </div>
      </li>

      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">
          <span>Timezone</span>
          <el-popover
            placement="right-start"
            width="200"
            trigger="hover"
            content="By default, the application calculates the date and time based on the client's machine. You can choose a fixed time zone and the date and time will be calculated based on this time zone"
          >
            <span class="notification-mark" slot="reference">
              <i class="fas fa-question-circle"></i>
            </span>
          </el-popover>
        </div>
        <div class="panel-component-item-content">
          <timezone/>
        </div>
      </li>
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  components: {
    datepicker: VueFlatpickr,
    timezone: httpVueLoader(`./DateSetting/Timezone.vue?v=${window.v}`)
  },
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings"
    })
  },
  data() {
    return {
      config: {
        altFormat: "m-d-Y"
      },
      dateFormats: [
        "MM/DD/YY",
        "MM/DD/YYYY",
        "DD/MM/YY",
        "YY/MM/DD",
        "DD.MM.YY",
        "YY.MM.DD",
        "YYYY-MM-DD",
        "DD-MM-YY",
        "DD MMM, YY",
        "DD MMM, YYYY",
        "DD MMMM, YYYY",
        "MMMM DD",
        "dddd, DD MMMM, YYYY",
        "ddd, MMM DD, YYYY",
        "dddd, MMM DD, YYYY",
        "dddd, MMMM DD, YYYY",
        "dddd, DD MMMM",
        "dddd DD MMMM",
        "DD MMMM",
        "ddd, MMMM DD, YYYY"
      ],
      locales: [
        {
          title: "Afrikaans",
          value: "af"
        },
        {
          title: "Albanian",
          value: "sq"
        },
        {
          title: "Arabic",
          value: "ar"
        },
        {
          title: "Arabic (Algeria)",
          value: "ar-dz"
        },
        {
          title: "Arabic (Kuwait)",
          value: "ar-kw"
        },
        {
          title: "Arabic (Lybia)",
          value: "ar-ly"
        },
        {
          title: "Arabic (Morocco)",
          value: "ar-ma"
        },
        {
          title: "Arabic (Saudi Arabia)",
          value: "ar-sa"
        },
        {
          title: "Arabic (Tunisia)",
          value: "ar-tn"
        },
        {
          title: "Armenian",
          value: "hy-am"
        },
        {
          title: "Azerbaijani",
          value: "az"
        },
        {
          title: "Bambara",
          value: "bm"
        },
        {
          title: "Basque",
          value: "eu"
        },
        {
          title: "Balarusion",
          value: "be"
        },
        {
          title: "Bengali",
          value: "bn"
        },
        {
          title: "Bosnian",
          value: "bs"
        },
        {
          title: "Breton",
          value: "br"
        },
        {
          title: "Bulgarian",
          value: "bg"
        },
        {
          title: "Burmese",
          value: "my"
        },
        {
          title: "Cambodian",
          value: "km"
        },
        {
          title: "Catalan",
          value: "ca"
        },
        {
          title: "Central Atlas Tamazight",
          value: "tzm"
        },
        {
          title: "Central Atlas Tamazight Latin",
          value: "tzm-latn"
        },
        {
          title: "Chinese (China)",
          value: "zh-cn"
        },
        {
          title: "Chinese (Hong Kong)",
          value: "zh-hk"
        },
        {
          title: "Chinese (Taiwan)",
          value: "zh-tw"
        },
        {
          title: "Chuvash",
          value: "cv"
        },
        {
          title: "Croatian",
          value: "hr"
        },
        {
          title: "Czech",
          value: "cs"
        },
        {
          title: "Danish",
          value: "da"
        },
        {
          title: "Dutch",
          value: "nl"
        },
        {
          title: "Dutch (Belgium)",
          value: "nl-be"
        },
        {
          title: "English (Australia)",
          value: "en-au"
        },
        {
          title: "English (Canada)",
          value: "en-ca"
        },
        {
          title: "English (Ireland)",
          value: "en-ie"
        },
        {
          title: "English (Israel)",
          value: "en-il"
        },
        {
          title: "English (New Zealand)",
          value: "en-nz"
        },
        {
          title: "English (United Kingdom)",
          value: "en-gb"
        },
        {
          title: "English (United States)",
          value: "en"
        },
        {
          title: "Esperanto",
          value: "eo"
        },
        {
          title: "Estonian",
          value: "et"
        },
        {
          title: "Faroese",
          value: "fo"
        },
        {
          title: "Finnish",
          value: "fi"
        },
        {
          title: "French",
          value: "fr"
        },
        {
          title: "French (Canada)",
          value: "fr-ca"
        },
        {
          title: "French (Switzerland)",
          value: "fr-ch"
        },
        {
          title: "Frisian",
          value: "fy"
        },
        {
          title: "Galician",
          value: "gl"
        },
        {
          title: "Georgian",
          value: "ka"
        },
        {
          title: "German",
          value: "de"
        },
        {
          title: "German (Austria)",
          value: "de-at"
        },
        {
          title: "German (Switzerland)",
          value: "de-ch"
        },
        {
          title: "Greek",
          value: "el"
        },
        {
          title: "Gujarati",
          value: "gu"
        },
        {
          title: "Hebrew",
          value: "he"
        },
        {
          title: "Hindi",
          value: "hi"
        },
        {
          title: "Hungarian",
          value: "hu"
        },
        {
          title: "Icelandic",
          value: "is"
        },
        {
          title: "Indonesian",
          value: "id"
        },
        {
          title: "Irsh or Irish Gaelic",
          value: "ga"
        },
        {
          title: "Italian",
          value: "it"
        },
        {
          title: "Italian (Switzerland)",
          value: "it-ch"
        },
        {
          title: "Japanese",
          value: "ja"
        },
        {
          title: "Javanese",
          value: "jv"
        },
        {
          title: "Kannada",
          value: "kn"
        },
        {
          title: "Kazakh",
          value: "kk"
        },
        {
          title: "Klingon",
          value: "tlh"
        },
        {
          title: "Konkani Latin script",
          value: "gom-latn"
        },
        {
          title: "Korean",
          value: "ko"
        },
        {
          title: "Kurdish",
          value: "ku"
        },
        {
          title: "Kyrgyz",
          value: "ky"
        },
        {
          title: "Lao",
          value: "lo"
        },
        {
          title: "Latvian",
          value: "lv"
        },
        {
          title: "Lithuanian",
          value: "lt"
        },
        {
          title: "Luxembourgish",
          value: "lb"
        },
        {
          title: "Macedonian",
          value: "mk"
        },
        {
          title: "Malay",
          value: "ms"
        },
        {
          title: "Malayalam",
          value: "ml"
        },
        {
          title: "Maldivian",
          value: "dv"
        },
        {
          title: "Maltese (Malta)",
          value: "mt"
        },
        {
          title: "Maori",
          value: "mi"
        },
        {
          title: "Marathi",
          value: "mr"
        },
        {
          title: "Mongolian",
          value: "mn"
        },
        {
          title: "Montenegrin",
          value: "me"
        },
        {
          title: "Nepalese",
          value: "ne"
        },
        {
          title: "Northern Sami",
          value: "se"
        },
        {
          title: "Norwegian BokmÃ¥l",
          value: "nb"
        },
        {
          title: "Nynorsk",
          value: "nn"
        },
        {
          title: "Persian",
          value: "fa"
        },
        {
          title: "Polish",
          value: "pl"
        },
        {
          title: "Portuguese",
          value: "pt"
        },
        {
          title: "Portuguese (Brazil)",
          value: "pt-br"
        },
        {
          title: "Pseudo",
          value: "x-pseudo"
        },
        {
          title: "Punjabi",
          value: "pa-in"
        },
        {
          title: "Romanian",
          value: "ro"
        },
        {
          title: "Russian",
          value: "ru"
        },
        {
          title: "Scottish Gealic",
          value: "gd"
        },
        {
          title: "Serbian",
          value: "sr"
        },
        {
          title: "Serbian Cyrillic",
          value: "sr-cyrl"
        },
        {
          title: "Sindhi",
          value: "sd"
        },
        {
          title: "Sinhalese",
          value: "si"
        },
        {
          title: "Slovak",
          value: "sk"
        },
        {
          title: "Slovenian",
          value: "sl"
        },
        {
          title: "Spanish",
          value: "es"
        },
        {
          title: "Spanish (Dominican Republic)",
          value: "es-do"
        },
        {
          title: "Spanish (United States)",
          value: "es-us"
        },
        {
          title: "Swahili",
          value: "sw"
        },
        {
          title: "Swedish",
          value: "sv"
        },
        {
          title: "Tagalog (Philippines)",
          value: "tl-ph"
        },
        {
          title: "Tajik",
          value: "tg"
        },
        {
          title: "Talossan",
          value: "tzl"
        },
        {
          title: "Tamil",
          value: "ta"
        },
        {
          title: "Telugu",
          value: "te"
        },
        {
          title: "Tetun Dili (East Timor)",
          value: "tet"
        },
        {
          title: "Thai",
          value: "th"
        },
        {
          title: "Tibetan",
          value: "bo"
        },
        {
          title: "Turkish",
          value: "tr"
        },
        {
          title: "Ukrainian",
          value: "uk"
        },
        {
          title: "Urdu",
          value: "ur"
        },
        {
          title: "Uyghur (China)",
          value: "ug-cn"
        },
        {
          title: "Uzbek",
          value: "uz"
        },
        {
          title: "Uzbek Latin",
          value: "uz-latn"
        },
        {
          title: "Vietnamese",
          value: "vi"
        },
        {
          title: "Welsh",
          value: "cy"
        },
        {
          title: "Yoruba Nigeria",
          value: "yo"
        },
        {
          title: "siSwati",
          value: "ss"
        }
      ]
    };
  },
  created() {
    this.localizeMoment();
  },
  methods: {
    formatDate: function(formatType) { 
      return moment().format(formatType);
    },
    localizeMoment() {
      let locale = this.settings.date_locale;

      if (locale && locale !== "en") {
        let source = `assets/js/moment/locales/${locale}.js`;
        this.getScript(source, () => {
          moment.locale(locale);
        });
      }
    },
    getScript(source, callback) {
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = source;
      s.onload = s.onreadystatechange = function(_, isAbort) {
        if (isAbort || !s.readyState || /loaded|complete/.test(s.readyState)) {
          s.onload = s.onreadystatechange = null;
          s = undefined;

          if (!isAbort) {
            if (callback) callback();
          }
        }
      };
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
    }
  }
};
</script>

<style>
</style>
