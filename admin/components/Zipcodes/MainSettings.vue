<template>
  <viewing-card title="Settings">
    <ul class="panel-component-items">
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Show Estimated For</div>
        <div class="panel-component-item-content">
          <el-radio v-model="settings.for_all_product" :label="1">All Products</el-radio>
          <el-radio v-model="settings.for_all_product" :label="2">Specific Vendors</el-radio>
          <el-radio v-model="settings.for_all_product" :label="3">Specific Collections</el-radio>
          <el-radio v-model="settings.for_all_product" :label="0">Specific Products</el-radio>
        </div>
      </li>
      <li class="panel-component-item panel-component-item-content-inline">
        <div class="panel-component-item-title">Get Customer Zipcode</div>
        <div class="panel-component-item-content">
          <el-switch
            v-model="settings.get_customer_zipcode"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <span
            v-if="settings.get_customer_zipcode"
            class="panel-component-item-content-helper-text warning"
          >
            <i class="el-icon-warning"></i>
            <span>This will make the application a bit slower</span>
          </span>
        </div>
      </li>
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "main-zipcode-settings",
  props: ["settings"]
};
</script>
