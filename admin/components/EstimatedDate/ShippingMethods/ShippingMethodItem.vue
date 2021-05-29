<template>
  <div>
    <div v-if="!editing" class="estimated-shipping-method-detail">
      <detail :method="method" :index="index" @edit="editing = true"></detail>
    </div>
    <div v-else class="estimated-shipping-method-editor">
      <editor :method="method" @cancel="editing = false"></editor>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    editor: httpVueLoader(
      `./ShippingMethodItem/ShippingMethodEditor.vue?v=${window.v}`
    ),
    detail: httpVueLoader(
      `./ShippingMethodItem/ShippingMethodDetail.vue?v=${window.v}`
    )
  },
  props: ["method", "index"],
  data() {
    return {
      editing: false
    };
  }
};
</script>
 