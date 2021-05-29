<template>
  <viewing-card title="List Countries" v-loading="loading">
    <list-countries :countries="countryRules" @create="onCreate" @edit="onEdit"></list-countries>
    <edit-country :active="openEditModal" @close="openEditModal = false"></edit-country>
    <new-country :active="openNewModal" @close="openNewModal = false"></new-country>
  </viewing-card>
</template>

<script>
// Every modified this component notice that : in the database, the primary key of each country is od, not id because id is same field with country from shopify
module.exports = {
  components: {
    "list-countries": httpVueLoader(
      `./ListCountries/ListCountries.vue?v=${window.v}`
    ),
    "new-country": httpVueLoader(
      `./ListCountries/NewCountryRule.vue?v=${window.v}`
    ),
    "edit-country": httpVueLoader(
      `./ListCountries/EditCountryRule.vue?v=${window.v}`
    )
  },
  name: "countries",
  computed: {
    ...Vuex.mapGetters({
      defaultCountries: "_shopify/countries/getCountries",
      countryRules: "countryDelivery/countryRules/getCountryRules",
      loading: "countryDelivery/countryRules/getFetching"
    })
  },
  data: function() {
    return {
      showCountryRules: true,
      currentCountry: {},
      openNewModal: false,
      openEditModal: false,
      currentSpecificRule: {}
    };
  },
  methods: {
    onEdit() {
      this.openEditModal = true;
    },
    onCreate() {
      this.openNewModal = true;
    },
    updateEditedRule(editedRule) {
      let index = this.countryRules.findIndex(e => e.id == editedRule.id);
      this.countryRules.splice(index, 1);
      this.countryRules.splice(index, 0, editedRule);
    },
    pushNewRule(newCountryRule) {
      this.countryRules.push(newCountryRule); 
    }
  }
};
</script>