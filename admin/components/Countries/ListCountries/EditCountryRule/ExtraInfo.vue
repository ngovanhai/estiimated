<template>
  <ul v-if="show" class="panel-component-items">
    <li class="panel-component-item">
      <div class="panel-component-item-title">Show courier</div>
      <div class="panel-component-item-content">
        <el-switch
          v-model="editingRule.display_courier_info"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
        <ul v-if="editingRule.display_courier_info == 1" class="panel-component-items">
          <li class="panel-component-item">
            <div
              class="panel-component-item-title panel-component-item-title-with-input"
            >Courier name</div>
            <div class="panel-component-item-content">
              <el-input placeholder="Ex: FedEx" v-model="editingRule.courier_name"></el-input>
            </div>
          </li>
          <li class="panel-component-item">
            <div
              class="panel-component-item-title panel-component-item-title-with-input"
            >Courier url</div>
            <div class="panel-component-item-content">
              <el-input placeholder="Ex: https://www.fedex.com" v-model="editingRule.courier_url"></el-input>
            </div>
          </li>
          <li class="panel-component-item">
            <div 
              class="panel-component-item-title panel-component-item-title-with-input"
            >Courier label</div>
            <div class="panel-component-item-content">
              <el-input v-model="editingRule.courier_label"></el-input>
            </div>
          </li>
        </ul>
      </div>
    </li>
    <li class="panel-component-item">
      <div class="panel-component-item-title">Courier name</div>
      <div class="panel-component-item-content">
        <el-input
          type="textarea"
          autosize
          placeholder="Some extra infomation..."
          v-model="editingRule.custom_info"
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
