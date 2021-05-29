<template>
  <viewing-card title="Settings">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Estimated text</div>
        <div class="panel-component-item-content">
          <el-input
            placeholder="Ex: Estimated between {date} and {date+1}"
            v-model="settings.estimated_text"
          ></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >Zipcode Available</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Shipping Available at:" v-model="settings.zipcode_available_text"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Zipcode Not Available</div>
        <div class="panel-component-item-content">
          <el-input
            placeholder="Shipping not Available at:"
            v-model="settings.zipcode_not_available_text"
          ></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">COD Available</div>
        <div class="panel-component-item-content">
          <el-input
            placeholder="Cash on Delivery is available"
            v-model="settings.cash_available_text"
          ></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >COD Not Available</div>
        <div class="panel-component-item-content">
          <el-input
            placeholder="Cash on Delivery is not available"
            v-model="settings.cash_not_available_text"
          ></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title">Extra Shipping Cost</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Extra Shipping Cost:" v-model="settings.extra_cost_text"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >Shipping Courier</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Will be shipped via:" v-model="settings.shipping_via"></el-input>
        </div>
      </li>
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  name: "label-settings",
  props: ["settings"]
};
</script>
