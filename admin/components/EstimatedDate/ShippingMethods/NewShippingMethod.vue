<template>
  <el-form
    :model="shippingMethod"
    :rules="rules"
    ref="shippingMethod"
    label-width="120px"
  >
    <el-form-item label="Method name" prop="name">
      <el-input v-model="shippingMethod.name"></el-input>
    </el-form-item>
    <el-form-item label="Minimum days" prop="minimum_days">
      <el-input-number
        v-model="shippingMethod.minimum_days"
        :min="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="Estimated days" prop="estimated_days">
      <el-input-number
        v-model="shippingMethod.estimated_days"
        :min="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="Estimated text" prop="estimated_text">
      <el-input v-model="shippingMethod.estimated_text"></el-input>
    </el-form-item>
    <el-form-item label="Privacy" prop="privacy_text">
      <el-input
        type="textarea"
        v-model="shippingMethod.privacy_text"
      ></el-input>
    </el-form-item>
    <el-form-item label="Icon" prop="icon">
      <el-select v-model="shippingMethod.icon" placeholder="Select">
        <el-option
          v-for="(icon, index) in icons"
          :key="index"
          :label="icon"
          :value="icon"
        >
          <span v-html="icon"></span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Preview">
      <div
        id="estimated-date-layout-sample"
        class="estimated-date-preview"
        @click="onClickPreview"
        :style="{
          backgroundColor: settings.background_color,
          border: '2px solid ' + settings.border_color,
          borderRadius: '5px',
          color: settings.text_color,
          fontSize: settings.text_size + 'px',
        }"
      >
        <p
          v-html="
            generateMainEstimatedTextSample(
              shippingMethod.icon,
              shippingMethod.estimated_text
            )
          "
        ></p>
      </div>
    </el-form-item>
    <el-form-item label="Layout sample" prop="icon">
      <layout-sample
        :propsToLayout="'create'"
        @data_sample="setMethod"
        @data_old="saveData"
        :hide_layout="hide_layout"
        :show_settings="show_settings"
        @click_showall="showAll()"
        @change_showsettings="changeShowSetting()"
      ></layout-sample>
    </el-form-item>

    <el-form-item>
      <el-button
        size="small"
        type="primary"
        :loading="creating"
        @click="submitForm('shippingMethod')"
        >Create</el-button
      >
      <el-button size="small" @click="cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
module.exports = {
  components: {
    layoutSample: httpVueLoader(`./LayoutSample.vue?v=${window.v}`),
  },
  data() {
    return {
      show_more: false,
      show_settings: false,
      hide_layout: false,
      data_old: null,
      rules: {
        name: [
          {
            required: true,
            message: "Please input Shipping Method name",
            trigger: "blur",
          },
          {
            min: 1,
            max: 80,
            message: "Length should be 1 to 80",
            trigger: "blur",
          },
        ],
        minimum_days: [
          {
            required: true,
            message: "Please input Minimum days",
            trigger: "blur",
          },
        ],
        estimated_days: [
          {
            required: true,
            message: "Please input Estimated days",
            trigger: "blur",
          },
        ],
        estimated_text: [
          {
            required: true,
            message: "Please input Estimated text",
            trigger: "blur",
          },
          {
            min: 0,
            message: "Length should be 1 to 255",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...Vuex.mapGetters({
      shippingMethod: "shippingMethods/getNewShippingMethod",
      creating: "shippingMethods/getCreating",
      icons: "shippingMethods/getIcons",
      settings: "generalSettings/getSettings",
    }),
  },
  methods: {
    ...Vuex.mapActions({
      create: "shippingMethods/createShippingMethod",
      saveSettings: "generalSettings/saveSettings",
    }),
    showAll() {
      this.show_settings = false;
      this.hide_layout = false;
      this.show_more = false;
    },
    changeShowSetting() {
      this.show_settings = true;
    },
    onClickPreview() {
      this.hide_layout = true;
      this.show_settings = true;
    },
    data_sample(data) {
      console.log(data);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveSettings().then(() => {});
          this.create()
            .then(() => {
              this.onCancel();
            })
            .catch((error) => {
              ShopifyNotification(error, "error");
            });
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.$emit("cancel");
    },
    cancel() {
      this.$emit("cancel");
      this.settings.background_color = this.data_old.background_color;
      this.settings.border_color = this.data_old.border_color;
      this.settings.text_color = this.data_old.text_color;
      this.settings.text_size = this.data_old.text_size;
    },
    setMethod(id) {
      this.shippingMethod.estimated_text = id.estimated_text;
      this.shippingMethod.icon = id.icon;
    },
    generateMainEstimatedTextSample(icon, text) {
      estimatedText = `${icon} ${text}`;
      return estimatedText;
    },
    saveData(data) {
      this.data_old = data;
    },
  },
};
</script>
<style scoped>
#estimated-date-layout-sample {
  margin: 10px 0px;
}
#estimated-date-layout-sample > p {
  margin: 0px 10px;
}
.estimated-date-preview:hover {
  cursor: pointer;
}
</style>