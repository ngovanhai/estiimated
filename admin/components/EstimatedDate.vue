<template>
  <div class="container" v-if="settings && show">
    <div class="panel-wrapper">
      <shipping-methods></shipping-methods>
    </div>
    <div class="panel-wrapper">
      <specific-rules></specific-rules>
    </div>
    <div class="panel-wrapper">
      <extra-policy-settings></extra-policy-settings>
    </div>
    <div class="panel-wrapper text-right">
      <el-button type="primary" @click="onSave" :loading="isSaving">Save</el-button>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "estimated-date",
  components: {
    "shipping-methods": httpVueLoader(
      `./EstimatedDate/ShippingMethods.vue?v=${window.v}`
    ),
    "extra-policy-settings": httpVueLoader(
      `./EstimatedDate/ExtraPolicy.vue?v=${window.v}`
    ),
    "specific-rules": httpVueLoader(
      `./EstimatedDate/SpecificRules.vue?v=${window.v}`
    )
  },
  props: ["show"],
  computed: {
    ...Vuex.mapGetters({
      settings: "estimatedDate/getSettings",
      isSaving: "estimatedDate/getUpdating"
    })
  },
  mounted() {
    this.getSettings();
  },
  methods: {
    ...Vuex.mapActions({
      getSettings: "estimatedDate/getSettings",
      saveSettings: "estimatedDate/saveSettings"
    }),
    onSave() {
        this.saveSettings()
            .then(() => {
                ShopifyNotification("Save Settings successfully","success"); 
            })
            .catch((error) => {
                ShopifyNotification(error,"error"); 
            })
    }
  }
};
</script>

