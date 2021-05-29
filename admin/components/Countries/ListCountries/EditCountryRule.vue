<template>
  <el-dialog title="Country Rule" :visible.sync="isOpen">
    <el-tabs class="nav__left" v-model="currentTab" @tab-click="changeTab">
      <el-tab-pane label="Main Settings" name="country-settings">
        <main-settings :show="currentTab == 'country-settings'" :country="editingRule"></main-settings>
      </el-tab-pane>
      <el-tab-pane label="Extra Info" name="country-info">
        <extra-info :show="currentTab == 'country-info'" :country="editingRule"></extra-info>
      </el-tab-pane>
      <el-tab-pane label="Provinces" name="country-provinces">
        <provinces ref="provinces" :show="currentTab == 'country-provinces'" :country="editingRule"></provinces>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="onClose">Close</el-button>
      <el-button type="primary" :loading="updating" @click="onSave">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
module.exports = {
  components: {
    "main-settings": httpVueLoader(
      `./EditCountryRule/MainSettings.vue?v=${window.v}`
    ),
    "extra-info": httpVueLoader(
      `./EditCountryRule/ExtraInfo.vue?v=${window.v}`
    ),
    provinces: httpVueLoader(`./EditCountryRule/Provinces.vue?v=${window.v}`)
  },
  props: ["active"],
  data() {
    return {
      currentTab: "country-settings"
    };
  },
  computed: {
    ...Vuex.mapGetters({
      defaultCountries: "_shopify/countries/getCountries",
      countryRules: "countryDelivery/countryRules/getCountryRules",
      editingRule: "countryDelivery/countryRules/getEditingRule",
      updating: "countryDelivery/countryRules/getUpdating"
    }),
    isOpen: {
      get: function() {
        return this.active;
      },
      set: function() {
        this.onClose();
      }
    }
  },
  methods: {
    ...Vuex.mapActions({
      updateCountryRule: "countryDelivery/countryRules/updateCountryRule"
    }),
    onSave() {
      this.updateCountryRule()
        .then(() => {
            ShopifyNotification("Save Update successfully !","success");  
          this.onClose();
        })
        .catch(error => {
          ShopifyNotification(error,"error"); 
        });
    },
    changeTab(tab) {
      this.currentTab = tab.name;
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>
