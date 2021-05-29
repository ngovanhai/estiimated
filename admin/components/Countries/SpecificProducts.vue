<template>
  <viewing-card title="Specific Products">
    <list-specific-products @create="onCreate" @edit="onEdit"></list-specific-products>
    <new-specific-products :active="toggleNewModal" @close="onClose"></new-specific-products>
    <edit-specific-product :active="toggleEditModal" @close="onClose"></edit-specific-product>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "country-delivery-specific-product-rules",
  components: {
    "list-specific-products": httpVueLoader(
      `./SpecificProducts/ListSpecificProducts.vue?v=${window.v}`
    ),
    "new-specific-products": httpVueLoader(
      `./SpecificProducts/NewSpecificProducts.vue?v=${window.v}`
    ),
    "edit-specific-product": httpVueLoader(
      `./SpecificProducts/EditSpecificProduct.vue?v=${window.v}`
    )
  },
  computed: {
    ...Vuex.mapGetters({
      countryRules: "countryDelivery/countryRules/getCountryRules",
      specificProducts: "countryDelivery/specificProducts/getRules"
    })
  },
  data() {
    return {
      toggleNewModal: false,
      toggleEditModal: false
    };
  },
  methods: {
    onEdit() { 
      this.toggleEditModal = true;
    },
    onCreate() {
      this.toggleNewModal = true;
    },
    onClose() {
      this.toggleNewModal = false;
      this.toggleEditModal = false;
    }
  }
};
</script>

