<template>
  <el-select v-model="selectecTimezone" placeholder="Select" filterable reserve-keyword>
    <el-option v-for="timezone in timezones" :key="timezone" :label="timezone" :value="timezone"></el-option>
  </el-select>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings"
    }),
    selectecTimezone: {
      get: function() { 
        if (typeof this.settings.date_timezone_offset == "undefined") { 
          return "Default customer timezone";
        } else { 
          return this.settings.date_timezone_offset;
        }
      },
      set: function(value) { 
        this.settings.date_timezone_offset = value;
      }
    }
  },
  created() {
    this.getTimezones();
  },
  data() {
    return {
      timezones: ["Default customer timezone"]
    };
  },
  methods: {
    getTimezones() { 
      this.$http.get("assets/json/timezones.json?v=1").then(response => {
        let data = response.body || {};
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            const timezone = `${key}: ${element}`;
            this.timezones.push(timezone);
          }
        }
      });
    }
  }
};
</script>
