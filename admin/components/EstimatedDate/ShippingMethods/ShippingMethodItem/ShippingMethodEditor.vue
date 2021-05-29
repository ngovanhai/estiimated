<template>
  <el-form :model="method" :rules="rules" ref="method" label-width="120px">
    <el-form-item label="Method name" prop="name">
      <el-input v-model="method.name"></el-input>
    </el-form-item>
    <el-form-item label="Minimum days" prop="minimum_days">
      <el-input-number v-model="method.minimum_days" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="Estimated days" prop="estimated_days">
      <el-input-number
        v-model="method.estimated_days"
        :min="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="Estimated text" prop="estimated_text">
      <el-input v-model="method.estimated_text"></el-input>
    </el-form-item>

    <el-form-item prop="is_private">
      <div slot="label">
        <span>Set private</span>

        <el-popover
          placement="right-start"
          width="200"
          trigger="hover"
          content="When this field is enabled, this shipping method will only apply to specific rules related to this method"
        >
          <span class="notification-mark" slot="reference">
            <i class="fas fa-question-circle"></i>
          </span>
        </el-popover>
      </div>
      <el-switch
        v-model="method.is_private"
        :active-value="1"
        :inactive-value="0"
        active-color="#13ce66"
      ></el-switch>
    </el-form-item>

    <el-form-item label="Privacy" prop="privacy_text">
      <el-input type="textarea" v-model="method.privacy_text"></el-input>
    </el-form-item>
    <el-form-item label="Icon" prop="icon">
      <el-select
        v-model="method.icon"
        placeholder="Select icon"
        filterable
        allow-create
      >
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
        @click="onClickPreview()"
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
            generateMainEstimatedTextSample(method.icon, method.estimated_text)
          "
        ></p>
      </div>
    </el-form-item>
    <el-form-item label="Layout sample" prop="icon">
      <layout-sample
        :propsToLayout="'update'"
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
        :loading="updating"
        @click="submitForm('method')"
        >Save</el-button
      >
      <el-button size="small" @click="Cancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
module.exports = {
  props: ["method"],
  components: {
    layoutSample: httpVueLoader(`./../LayoutSample.vue?v=${window.v}`),
  },
  computed: {
    ...Vuex.mapGetters({
      icons: "shippingMethods/getIcons",
    }),
  },
  data() {
    return {
      data_old: null,
      show_more: false,
      show_settings: false,
      hide_layout: false,
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
      updating: false,
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
      update: "shippingMethods/updateShippingMethod",
      saveSettings: "generalSettings/saveSettings",
    }),
    setMethod(id) {
      this.method.estimated_text = id.estimated_text;
      this.method.icon = id.icon;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onUpdate();
        } else {
          return false;
        }
      });
    },
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
    onUpdate() {
      this.updating = true;
      this.saveSettings().then(() => {});
      this.update(this.method)
        .then(() => {
          this.updating = false;
          this.onCancel();
        })
        .catch((error) => {
          this.updating = false;
          ShopifyNotification(error, "error");
        });
    },

    onCancel() {
      this.$emit("cancel");
    },
    Cancel() {
      this.$emit("cancel");
      console.log(this.data_old);
      this.settings.background_color = this.data_old.background_color;
      this.settings.border_color = this.data_old.border_color;
      this.settings.text_color = this.data_old.text_color;
      this.settings.text_size = this.data_old.text_size;
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
#estimated-date-layout-sample:hover {
  cursor: pointer;
}
</style>