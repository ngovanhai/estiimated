<template>
  <viewing-card title="Display Config" :show-content="true">
    <ul class="panel-component-items">
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Choose layout
        </div>
        <div class="panel-component-item-content choose-layout">
          <el-radio v-model="settings.choose_layout" label="select"
            >Layout select</el-radio
          >
          <el-radio v-model="settings.choose_layout" label="card"
            >Layout card</el-radio
          >
          <!-- <el-select
            class="fixed-input-width"
            v-model="settings.position_code"
            placeholder="Select"
          >
            <el-option
              v-for="position in positions"
              :key="position.code"
              :label="position.title"
              :value="position.code"
            ></el-option>
          </el-select> -->
        </div>
      </li>

      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Position
        </div>
        <div class="panel-component-item-content">
          <el-select
            class="fixed-input-width"
            v-model="settings.position_code"
            placeholder="Select"
          >
            <el-option
              v-for="position in positions"
              :key="position.code"
              :label="position.title"
              :value="position.code"
            ></el-option>
          </el-select>
        </div>
      </li>

      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Custom Position
        </div>
        <div class="panel-component-item-content">
          <el-input
            class="fixed-input-width"
            placeholder="Please input"
            v-model="settings.custom_position"
          ></el-input>
          <span class="panel-component-item-content-helper-text"
            >Enter the name of the class includes ".". Example:
            ".product-form"</span
          >
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Text Size
        </div>
        <div class="panel-component-item-content">
          <el-input
            class="fixed-input-width"
            placeholder="Please input"
            v-model="settings.text_size"
          >
            <template slot="append">px</template>
          </el-input>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Text Color
        </div>
        <div class="panel-component-item-content">
          <el-color-picker v-model="settings.text_color"></el-color-picker>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Background Color
        </div>
        <div class="panel-component-item-content">
          <el-color-picker
            v-model="settings.background_color"
          ></el-color-picker>
        </div>
      </li>
      <li class="panel-component-item">
        <div
          class="panel-component-item-title panel-component-item-title-with-input"
        >
          Border Color
        </div>
        <div class="panel-component-item-content">
          <el-color-picker v-model="settings.border_color"></el-color-picker>
        </div>
      </li>
    </ul>
  </viewing-card>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      settings: "generalSettings/getSettings",
    }),
  },
  data() {
    return {
      showContent: true,
      positions: [
        {
          code: 1,
          title: "Under product's description",
        },
        {
          code: 2,
          title: "Under 'Add to cart' button",
        },
        {
          code: 3,
          title: "Under product's price",
        },
        {
          code: 4,
          title: "Under product's title",
        },
      ],
    };
  },
};
</script>

<style scoped>
.fixed-input-width {
  width: 220px;
}
.choose-layout {
  display: flex;
  align-items: center;
}
</style>
