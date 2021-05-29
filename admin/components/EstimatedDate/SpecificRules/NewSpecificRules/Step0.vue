<template>
  <el-select
    class="estimated-specific-rule-setup-shipping-method-selectbox"
    v-model="methodId"
    placeholder="Select one method"
  >
    <el-option v-for="item in shippingMethods" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/newSpecificRule/getRule",
      shippingMethods: "shippingMethods/getShippingMethods"
    })
  },
  data() {
    return {
      methodId: null
    };
  },
  mounted() {
    this.methodId = this.shippingMethods.length
      ? this.shippingMethods[0].id
      : null;
  },
  watch: { 
    methodId: function(id) {
      if (id) {
        method = this.shippingMethods.find(e => e.id == id);
        if (method) {
          this.rule.shipping_method_id = method.id;
          this.rule.minimum_days = method.minimum_days;
          this.rule.estimated_days = method.estimated_days;
          this.rule.estimated_text = method.estimated_text;
        }
      }
    }
  }
};
</script>

<style scoped>
.estimated-specific-rule-setup-shipping-method-selectbox {
  max-width: 300px;
  margin: 20px auto;
}
</style>
