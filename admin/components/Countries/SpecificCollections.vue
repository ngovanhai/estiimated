<template>
  <viewing-card title="Specific Collections">
    <list-specific-collections @create="onCreate" @edit="onEdit"></list-specific-collections>
    <new-specific-collections :active="toggleNewModal" @close="onClose"></new-specific-collections>
    <edit-specific-collection :active="toggleEditModal" @close="onClose"></edit-specific-collection>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "country-delivery-specific-collection-rules",
  components: {
    "list-specific-collections": httpVueLoader(
      `./SpecificCollections/ListSpecificCollections.vue?v=${window.v}`
    ),
    "new-specific-collections": httpVueLoader(
      `./SpecificCollections/NewSpecificCollections.vue?v=${window.v}`
    ),
    "edit-specific-collection": httpVueLoader(
      `./SpecificCollections/EditSpecificCollections.vue?v=${window.v}`
    )
  },
  computed: {
    ...Vuex.mapGetters({
      countryRules: "countryDelivery/countryRules/getCountryRules",
      specificCollections: "countryDelivery/specificCollections/getRules"
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

