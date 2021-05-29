<template>
  <div class="container" v-if="show">
    <div class="panel-wrapper">
      <main-settings :settings="settings"></main-settings>
    </div>
    <div class="panel-wrapper">
      <zipcode-list
        :demo-zipcode="demoZipcode"
        @set-list-zipcodes="setListZipcodes"
        @reload-specific-rules="reloadSpecificRules"
      ></zipcode-list>
    </div>
    <div class="panel-wrapper">
      <specific-vendors
        v-if="settings.for_all_product == 2"
        ref="specificVendors"
        :zipcode-rules="zipcodes"
      ></specific-vendors>
      <specific-collections
        v-else-if="settings.for_all_product == 3"
        ref="specificCollections" 
        :zipcode-rules="zipcodes"
      ></specific-collections>
      <specific-products
        v-else-if="settings.for_all_product == 0"
        ref="specificProducts"
        :zipcode-rules="zipcodes"
      ></specific-products>
    </div>
    <div class="panel-wrapper">
      <form-settings :settings="settings"></form-settings>
    </div>
    <div class="panel-wrapper">
      <label-settings :settings="settings"></label-settings>
    </div>
    <div class="panel-wrapper text-right">
      <el-button type="primary" @click="saveSettings" :loading="isSaving">Save</el-button>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "zipcode",
  components: {
    "label-settings": httpVueLoader(
      `./Zipcodes/LabelSettings.vue?v=${window.v}`
    ),
    "form-settings": httpVueLoader(
      `./Zipcodes/CheckZipcodeFormSettings.vue?v=${window.v}`
    ),
    "main-settings": httpVueLoader(`./Zipcodes/MainSettings.vue?v=${window.v}`),
    "zipcode-list": httpVueLoader(`./Zipcodes/ZipcodeList.vue?v=${window.v}`),
    "specific-products": httpVueLoader(
      `./Zipcodes/SpecificProducts.vue?v=${window.v}`
    ),
    "specific-collections": httpVueLoader(
      `./Zipcodes/SpecificCollections.vue?v=${window.v}`
    ),
    "specific-vendors": httpVueLoader(
      `./Zipcodes/SpecificVendors.vue?v=${window.v}`
    )
  },
  props: ["shop", "show"],
  data: function() {
    return {
      zipcodes: [],
      currentZipcode: null,
      demoZipcode: null,
      settings: {},
      cloneSettings: null,
      isSaving: false
    };
  },
  created() {
    this.getSettings();
  },
  methods: {
    setListZipcodes(arr) {
      this.zipcodes = arr;
    },
    reloadSpecificRules() {
      if (this.settings.for_all_product == 0) {
        this.$refs.specificProducts.onGet();
      } else if (this.settings.for_all_product == 2) {
        this.$refs.specificVendors.onGet();
      } else if (this.settings.for_all_product == 3) {
        this.$refs.specificCollections.onGet();
      }
    },
    getSettings() {
      this.$http
        .get(window.zipcodeGeneralApi, {
          params: {
            action: "getSettings",
            shop: window.shop
          }
        })
        .then(res => {
          if (res.body.success) {
            let settings = this.parseSettings(res.body.settings);
            this.settings = settings;
            this.cloneSettings = JSON.parse(JSON.stringify(this.settings));
          } else { 
             ShopifyNotification("An error has occured when fetching settings","error"); 
          }
        });
    },
    saveSettings() {
      this.isSaving = true;
      this.$http
        .post(
          window.zipcodeGeneralApi,
          {
            settings: this.settings,
            shop: window.shop,
            action: "updateSettings"
          },
          {
            emulateJSON: true
          }
        )
        .then(response => {
          if (response.body.success || response.body.success == 1) {
            this.settings = this.parseSettings(response.body.settings);
            this.cloneSettings = JSON.parse(JSON.stringify(this.settings));
            ShopifyNotification("Save Settings successfully","success"); 
            window.eventBus.$emit("generate-json-file");
          } else if (response.body.error) {
            ShopifyApp.flashError(response.body.error);
          } else { 
             ShopifyNotification("Save Settings successfully","success"); 
          }
          this.isSaving = false;
        });
    },
    parseSettings(settings) {
      settings.for_all_product = Number(settings.for_all_product);
      settings.get_customer_zipcode = Number(settings.get_customer_zipcode);
      return settings;
    }
  }
};
</script>
