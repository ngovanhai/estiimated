<template>
  <multiselect
    v-model="values"
    :options="options"
    :multiple="true"
    group-values="targets"
    group-label="title"
    :group-select="false"
    placeholder="Search targets by products, collections, vendors..."
    track-by="id"
    label="title"
    @search-change="onSearch"
  >
    <span slot="noResult">No targets found. Consider changing the search query.</span>
  </multiselect>
</template>

<script>
module.exports = {
  components: {
    multiselect: window.VueMultiselect.default
  },
  computed: {
    ...Vuex.mapGetters({
      products: "_shopify/products/getProducts",
      collections: "_shopify/collections/getCollections",
      vendors: "_shopify/vendors/getVendors"
    }),
    searchLimit() {
      return 5;
    },
    options() {
      const options = [
        {
          title: "Products",
          targets: this.filterProducts
        },
        {
          title: "Collections",
          targets: this.filterCollections
        },
        {
          title: "Vendors",
          targets: this.filterVendors
        }
      ];
      return options;
    },
    filterProducts() {
      let searchStr = this.search;
      let limit = this.searchLimit;
      if (!searchStr) {
        return this.products.slice(0, limit);
      } else {
        const match = this.products.filter(product =>
          product.title.toLowerCase().includes(searchStr.toLowerCase())
        );
        return match.slice(0, limit);
      }
    },
    filterCollections() {
      let searchStr = this.search;
      let limit = this.searchLimit;
      if (!searchStr) {
        return this.collections.slice(0, limit);
      } else {
        const match = this.collections.filter(collection =>
          collection.title.toLowerCase().includes(searchStr.toLowerCase())
        );
        return match.slice(0, limit);
      }
    },
    filterVendors() {
      let searchStr = this.search;
      let limit = this.searchLimit;
      let match = [];
      if (!searchStr) {
        match = this.vendors.slice(0, limit);
      } else {
        match = this.vendors.filter(vendor =>
          vendor.toLowerCase().includes(searchStr.toLowerCase())
        );
      }
      return match.map(vendor => {
        return {
          id: vendor,
          title: vendor
        };
      });
    }
  }, 
  data() {
    return {
      values: [],
      search: ""
    };
  },
  watch: {
    values: function(values) {
      this.setSelectedValues({
        values: values.map(value => value.id)
      });
    }
  },
  methods: {
    ...Vuex.mapActions({
      setSelectedValues: "estimatedDate/specificRules/setSelectedValues"
    }),
    onSearch(search) {
      this.search = search;
    } 
  }
};
</script>
