<template>
  <div class="container" v-if="settings && show">
    <!-- <el-alert :title="alertHtml" type="info" show-icon></el-alert> -->
    <div class="panel-wrapper">
      <main-settings @change-tab="changeTab"></main-settings>
    </div>
    <div class="panel-wrapper">
      <week-working-days></week-working-days>
    </div>
    <div class="panel-wrapper">
      <display-settings></display-settings>
    </div>
    <div class="panel-wrapper">
      <date-settings></date-settings>
    </div>
    <div class="panel-wrapper">
      <countdown-settings></countdown-settings>
    </div> 
    <div class="panel-wrapper">
      <advance-settings></advance-settings>
    </div>
    <div class="panel-wrapper text-right">
      <el-button type="primary" @click="onSave" :loading="updating">Save</el-button> 
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "settings",
  props: ["show"],
  components: {
    mainSettings: httpVueLoader(`./Settings/Main.vue?v=${window.v}`),
    advanceSettings: httpVueLoader(`./Settings/Advance.vue?v=${window.v}`),
    weekWorkingDays: httpVueLoader(
      `./Settings/WeekWorkingDays.vue?v=${window.v}`
    ),
    dateSettings: httpVueLoader(`./Settings/DateSettings.vue?v=${window.v}`),
    countdownSettings: httpVueLoader(`./Settings/CountdownSettings.vue?v=${window.v}`),
    displaySettings: httpVueLoader(
      `./Settings/DisplaySettings.vue?v=${window.v}`
    )
  },
  data: function() {
    return {
      alertHtml:
        "If you're using Custom Theme or after installed app and nothing appears, please contact <a href='mailto:contact@omegatheme.com'>contact@omegatheme.com</a> and we will assist you in the shortest time."
    };
  },
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings",
      loading: "generalSettings/getFetching",
      updating: "generalSettings/getUpdating"
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    ...Vuex.mapActions({
      getSettings: "generalSettings/getSettings",
      saveSettings: "generalSettings/saveSettings"
    }),
    init() {
      this.getSettings()
        .then(_ => {})
        .catch(error => {
          ShopifyApp.flashError("Error when fetching settings");
        });
    },
    changeTab(tabId) {
      this.$emit("change-tab", tabId);
    },
    onSave() {
      this.saveSettings()
        .then(_ => { 
          ShopifyNotification("Save Settings successfully","success"); 
        })
        .catch(error => {
           ShopifyNotification(error,"error"); 
        });
    }
  }
};
</script>
