<template>
  <viewing-card title="Form Settings">
    <ul class="panel-component-items">
      <li class="panel-component-item panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Label</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Check Shipping Availability:" v-model="settings.input_label"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Placeholder</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Enter Area Code" v-model="settings.input_placeholder"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Button Text</div>
        <div class="panel-component-item-content">
          <el-input placeholder="Submit" v-model="settings.submit_button"></el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div class="panel-component-item-title panel-component-item-title-with-input">Button Color</div>
        <div class="panel-component-item-content">
          <el-color-picker v-model="settings.submit_button_background_color"></el-color-picker>
        </div>
      </li>
    </ul>
  </viewing-card> 
</template>

<script>
module.exports = {
  name: "check-zipcode-form-settings",
  props: ["settings"]
};
</script>
