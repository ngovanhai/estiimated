<template>
  <div>
    <el-tabs class="nav__center" v-model="activeTab" type="border-card" @tab-click="changeTab">
      <!-- General settings --> 
        <div class="wpProgressbar container">
            <el-progress :text-inside="true" :stroke-width="15" :percentage="0" status="success"></el-progress> 
            <small>Please wait for the app to finish downloading data from your store for the best performance</small>
        </div> 
        <el-tab-pane name="tab-settings">
            <span slot="label">
            <i class="fas fa-cog"></i> Settings
            </span>
            <settings :show="showTabSettings" @change-tab="changeTab"></settings> 
        </el-tab-pane>

      <!-- Estimated Date -->
      <el-tab-pane v-if="settings && settings.layout == 1" name="tab-estimated-date">
        <span slot="label">
          <i class="fas fa-tag"></i> Estimated Date
        </span>
        <estimated-date :show="showTabEstimatedDate"></estimated-date>
      </el-tab-pane>

      <!-- Zipcode Shipping -->
      <el-tab-pane v-else-if="settings && settings.layout == 2" name="tab-zipcode">
        <span slot="label">
          <i class="fas fa-barcode"></i> Zipcode
        </span>
        <zipcodes :show="showTabZipcode"></zipcodes>
      </el-tab-pane>

      <!-- Country Delivery -->
      <el-tab-pane v-else-if="settings && settings.layout == 3" name="tab-countries">
        <span slot="label">
          <i class="fas fa-flag"></i> Country
        </span>
        <countries :show="showTabCountries"></countries>
      </el-tab-pane>
    </el-tabs>
    <omega-footer></omega-footer> 
  </div>
</template>

<script>
window.progress = 0;
module.exports = {
  components: {
    settings: httpVueLoader(`admin/components/Settings.vue?v=${window.v}`),
    zipcodes: httpVueLoader(`admin/components/Zipcodes.vue?v=${window.v}`),
    estimatedDate: httpVueLoader(
      `admin/components/EstimatedDate.vue?v=${window.v}`
    ),
    countries: httpVueLoader(`admin/components/Countries.vue?v=${window.v}`),
    omegaFooter: httpVueLoader(`admin/components/Footer.vue?v=${window.v}`)
  },
  data() {
    return {
      noticeConfig: true,
      activeTab: "tab-settings",
      showTabSettings: true,
      showTabEstimatedDate: false,
      showTabZipcode: false,
      showTabCountries: false,
    };
  },
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings"
    })
  },
  created() {
    window.eventBus = new Vue({});
    window.eventBus.$on("generate-json-file", () => {
      this.$http.get(window.generateJsonApi, {
        params: {
          action: "generate",
          shop: window.shop
        }
      });
    });
  },
  mounted() {
    this.getAllProducts();
    this.getAllCollections();
    this.getAllVendors();
    this.getAllCountries();
  },
  methods: {
    ...Vuex.mapActions({
      getAllProducts: "_shopify/products/getAllProducts",
      getAllCollections: "_shopify/collections/getAllCollections",
      getAllVendors: "_shopify/vendors/getAllVendors",
      getAllCountries: "_shopify/countries/getAllCountries"
    }),
    changeTab(tab, event) {
      if (typeof tab === "object") {
        tab = tab.name;
      }
      let listTabs = [
        "tab-settings",
        "tab-estimated-date",
        "tab-zipcode",
        "tab-countries"
      ];
      let listConditions = [
        "showTabSettings",
        "showTabEstimatedDate",
        "showTabZipcode",
        "showTabCountries"
      ];
      this.activeTab = tab;
      for (let i = 0; i < listTabs.length; i++) {
        if (listTabs[i] == tab) {
          this[listConditions[i]] = true;
        } else {
          this[listConditions[i]] = false;
        }
      }
    }
  }
};
</script>
<style>
.wpProgressbar{

}
.el-progress-bar__outer{
 }
</style>