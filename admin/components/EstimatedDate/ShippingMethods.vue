<template>
  <viewing-card title="Shipping Methods" :show-content="true" v-loading="sorting">
    <draggable
      class="estimated-shipping-methods-item-wrapper"
      :list="methods"
      :handle="'.draggable'"
      tag="ul"
      @end="updatePosition"
    >
      <li
        v-for="(method, index) in methods"
        :key="method.id"
        class="estimated-shipping-methods-item"
      >
        <shipping-method :method="method" :index="index"></shipping-method>
      </li>
      <li v-if="createNew" class="estimated-shipping-methods-item new-method">
        <new-shipping-method @cancel="createNew = false"></new-shipping-method>
      </li>
    </draggable>
    <div class="text-right">
      <el-button
        class="new-button-text"
        v-if="!createNew" 
        @click="createNew = true"
        type="text"
      >+ New shipping method</el-button>
    </div>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "estimated-shipping-methods",
  components: {
    "new-shipping-method": httpVueLoader(
      `./ShippingMethods/NewShippingMethod.vue?v=${window.v}`
    ),
    "shipping-method": httpVueLoader(
      `./ShippingMethods/ShippingMethodItem.vue?v=${window.v}`
    )
  },
  props: ["show"],
  computed: {
    ...Vuex.mapGetters({
      methods: "shippingMethods/getShippingMethods",
      loading: "shippingMethods/getFetching",
      sorting: "shippingMethods/getUpdatingPosition"
    })
  },
  data() {
    return {
      createNew: false
    };
  },
  created() {
    this.showContent = this.show ? this.show : false;
    this.init();
  },
  methods: {
    ...Vuex.mapActions({
      getShippingMethods: "shippingMethods/getShippingMethods",
      updatePosition: "shippingMethods/updateShippingMethodsPosition"
    }),
    init() {
      this.getShippingMethods()
        .then(() => {})
        .catch(error => { 
          ShopifyNotification(error,"error"); 
        });
    }
  }
};
</script>

<style scoped>
.estimated-shipping-methods-item {
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 3px;
  margin-top: 10px;
}
.estimated-shipping-methods-item.new-method {
  border: 1px dashed #dcdfe6;
}
</style>
