<template>
  <ul v-if="show" class="panel-component-items">
    <li class="panel-component-item">
      <div class="panel-component-item-title panel-component-item-title-with-input">Country name</div>
      <div class="panel-component-item-content">
        <el-input placeholder="Ex: United State" v-model="editingRule.name"></el-input>
      </div>
    </li>
    <li class="panel-component-item">
      <div class="panel-component-item-title panel-component-item-title-with-input">Ordering</div>
      <div class="panel-component-item-content">
        <el-input placeholder="Ordering Countries in table" v-model="editingRule.Ordering"></el-input>
      </div>
    </li>
    <li class="panel-component-item">
      <div class="panel-component-item-title panel-component-item-title-with-input">Minimum days</div>
      <div class="panel-component-item-content">
        <el-input-number v-model="editingRule.minimum_days" :min="0"></el-input-number>
      </div>
    </li>
    <li class="panel-component-item">
      <div class="panel-component-item-title panel-component-item-title-with-input">Estimated days</div>
      <div class="panel-component-item-content">
        <el-input-number v-model="editingRule.estimated_days" :min="0"></el-input-number>
      </div>
    </li>
    <li class="panel-component-item">
      <div class="panel-component-item-title panel-component-item-title-with-input">Estimated text</div>
      <div class="panel-component-item-content">
        <el-input
          placeholder="Ex: Estimated between {date} and {date+1}"
          v-model="editingRule.estimated_text"
        ></el-input>
      </div>
    </li>
    <li class="panel-component-item">
      <div class="panel-component-item-title panel-component-item-title-with-input">Delivery Label</div>
      <div class="panel-component-item-content">
        <el-input
          placeholder="Delivery to :"
          v-model="editingRule.delivery_label"
        ></el-input>
      </div>
    </li>
  </ul>
</template>

<script>
module.exports = {
  props: ["show"],
  computed: {
    ...Vuex.mapGetters({
      editingRule: "countryDelivery/countryRules/getEditingRule"
    })
  }
};
</script>
 