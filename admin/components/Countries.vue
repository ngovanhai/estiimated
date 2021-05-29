<template>
  <div class="container" v-if="show">
    <div class="panel-wrapper">
      <list-countries></list-countries>
    </div>
    <div class="panel-wrapper">
      <specific-products></specific-products>
    </div>
    <div class="panel-wrapper">
      <specific-collections></specific-collections>
    </div>
  </div>
</template>

<script>
// Every modified this component notice that : in the database, the primary key of each country is od, not id because id is same field with country from shopify
module.exports = {
  components: {
    "list-countries": httpVueLoader(
      `./Countries/ListCountries.vue?v=${window.v}`
    ),
    "specific-products": httpVueLoader(
      `./Countries/SpecificProducts.vue?v=${window.v}`
    ),
    "specific-collections": httpVueLoader(
      `./Countries/SpecificCollections.vue?v=${window.v}`
    )
  },
  name: "countries",
  props: ["show"]
};
</script>