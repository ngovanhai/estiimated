<template>
  <div>
    <el-button v-if="show_settings" @click="showAll()" size="mini"
      >show all</el-button
    >
    <div v-if="!hide_layout">
      <div
        v-for="dataStyle in dataFirt"
        :key="dataStyle.id"
        id="estimated-date-layout-sample"
        :class="`estimated-date-layout-sample-${dataStyle.id}`"
        :style="{
          backgroundColor: dataStyle.background_color,
          border: '2px solid ' + dataStyle.border_color,
          borderRadius: dataStyle.radius,
          color: dataStyle.text_color,
          fontSize: dataStyle.text_size + 'px',
        }"
        v-show="dataStyle.show"
        @click="selectedLayoutFirt(dataStyle.id, dataStyles)"
        @mouseover="hover(dataStyle.id, dataStyle.border_color)"
        @mouseout="outHover(dataStyle.id)"
      >
        <p
          v-html="
            generateMainEstimatedTextSample(
              dataStyle.icon,
              dataStyle.estimated_text
            )
          "
        ></p>
      </div>
    </div>
    <div v-if="!hide_layout">
      <div v-if="show_more">
        <div
          v-for="dataStyle in dataStyles"
          :key="dataStyle.id"
          id="estimated-date-layout-sample"
          :class="`estimated-date-layout-sample-${dataStyle.id}`"
          :style="{
            backgroundColor: dataStyle.background_color,
            border: '2px solid ' + dataStyle.border_color,
            borderRadius: dataStyle.radius,
            color: dataStyle.text_color,
            fontSize: dataStyle.text_size + 'px',
          }"
          v-show="dataStyle.show"
          @click="selectedLayout(dataStyle.id, dataStyles)"
          @mouseover="hover(dataStyle.id, dataStyle.border_color)"
          @mouseout="outHover(dataStyle.id)"
        >
          <p
            v-html="
              generateMainEstimatedTextSample(
                dataStyle.icon,
                dataStyle.estimated_text
              )
            "
          ></p>
        </div>
      </div>
    </div>
    <div v-if="!show_settings">
      <el-button size="mini" v-if="!show_more" @click="show_more = true"
        >show more <i class="el-icon-caret-bottom"></i>
      </el-button>
      <el-button size="mini" v-else-if="show_more" @click="show_more = false"
        >show less <i class="el-icon-caret-top"></i>
      </el-button>
    </div>

    <settings-layout
      @data_sample="upDateDataNewShipping"
      @submit_cancel="onclickCancel"
      v-if="show_settings"
      :data="dataLayout"
    ></settings-layout>
  </div>
</template>

<script>
module.exports = {
  props: ["show_settings_preview", "hide_layout", "show_more", "show_settings"],
  components: {
    SettingsLayout: httpVueLoader(`./SettingsLayout.vue?v=${window.v}`),
  },
  computed: {
    ...Vuex.mapGetters({
      rule: "estimatedDate/specificRules/newSpecificRule/getRule",
      generalSettings: "generalSettings/getSettings",
      estimatedDateSettings: "estimatedDate/getSettings",
      shippingMethods: "shippingMethods/getShippingMethods",
    }),
  },
  data: function () {
    return {
      value2: false,
      dataFirt: [
        {
          id: 1,
          text_color: "#907366",
          text_size: 14,
          background_color: "white",
          icon: "🚀",
          border_color: "#907366",
          radius: "5px",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          show: true,
        },
        {
          id: 2,
          text_color: "#feae78",
          text_size: 14,
          background_color: "white",
          icon: "🚚",
          border_color: "#feae78",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          radius: "5px",
          show: true,
        },
      ],
      dataStyles: [
        {
          id: 3,
          text_color: "#689de0",
          text_size: 14,
          background_color: "white",
          icon: "🛳️",
          border_color: "#689de0",
          radius: "5px",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          show: true,
        },
        {
          id: 4,
          text_color: "#84cecd",
          text_size: 14,
          background_color: "white",
          icon: "🛵",
          border_color: "#84cecd",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          radius: "5px",
          show: true,
        },
        {
          id: 5,
          text_color: "#f182ba",
          text_size: 14,
          background_color: "#fff4f4",
          icon: "🚚",
          border_color: "#fff3f3",
          radius: "5px",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          show: true,
        },
        {
          id: 6,
          text_color: "#5788ba",
          text_size: 14,
          background_color: "#e5fffa",
          icon: "🚈",
          border_color: "#80f0fd",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          radius: "5px",
          show: true,
        },
        {
          id: 7,
          text_color: "#97bb72",
          text_size: 14,
          background_color: "#fcffdd",
          icon: "🚛",
          border_color: "#c6e45b",
          radius: "5px",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          show: true,
        },
        {
          id: 8,
          text_color: "#e8aa6c",
          background_color: "#fff4e6",
          icon: "🚂",
          text_size: 14,
          border_color: "#ffd66c",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          radius: "5px",
          show: true,
        },
        {
          id: 9,
          text_color: "#cf94fe",
          background_color: "#ffeffe",
          icon: "🚀",
          text_size: 14,
          border_color: "#d67cff",
          estimated_text: "Estimated delivery date between {date} to {date+1}",
          radius: "5px",
          show: true,
        },
      ],
      dataLayout: [],
      data_old: {},
    };
  },
  methods: {
    upDateDataNewShipping(data, showSetting) {
      const b = this.$emit("data_sample", data);
      this.show_settings = showSetting;
    },
    generateMainEstimatedTextSample(icon, text) {
      estimatedText = `${icon} ${text}`;
      return estimatedText;
    },
    selectedLayoutFirt(id) {
      this.data_old = {
        background_color: this.generalSettings.background_color,
        text_size: this.generalSettings.text_size,
        text_color: this.generalSettings.text_color,
        border_color: this.generalSettings.border_color,
      };
      const a = this.dataFirt.find((item) => item.id === id);
      this.generalSettings.background_color = a.background_color;
      this.generalSettings.text_size = a.text_size;
      this.generalSettings.text_color = a.text_color;
      this.generalSettings.border_color = a.border_color;
      this.dataLayout = a;
      this.show_settings = true;
      this.dataFirt.map((item) => {
        item.show = false;
      });
      this.dataStyles.map((item) => {
        item.show = false;
      });
      this.$emit("data_old", this.data_old);
      this.$emit("change_showsettings");
      this.show_btnShow = true;
    },
    selectedLayout(id) {
      this.data_old = {
        background_color: this.generalSettings.background_color,
        text_size: this.generalSettings.text_size,
        text_color: this.generalSettings.text_color,
        border_color: this.generalSettings.border_color,
      };
      const a = this.dataStyles.find((item) => item.id === id);
      this.generalSettings.background_color = a.background_color;
      this.generalSettings.text_size = a.text_size;
      this.generalSettings.text_color = a.text_color;
      this.generalSettings.border_color = a.border_color;
      this.dataLayout = a;
      this.show_settings = true;
      const b = this.dataStyles.map((item) => {
        item.show = false;
      });
      this.dataFirt.map((item) => {
        item.show = false;
      });
      this.$emit("data_old", this.data_old);
      this.$emit("change_showsettings");
      this.show_btnShow = true;
    },
    hover(id, color) {
      const a = document.querySelector(`.estimated-date-layout-sample-${id}`);
      a.style.transform = "scale(0.98)";
      a.style.transition = "transform 1s";
      a.style.boxShadow = `0 0 2px 2px ${color}`;
    },
    outHover(id) {
      const a = document.querySelector(`.estimated-date-layout-sample-${id}`);
      a.style.transform = "scale(1)";
      a.style.transition = "transform 1s";
      a.style.boxShadow = "0 0 0px 0px white";
    },
    showAll() {
      this.dataFirt.map((item) => (item.show = true));
      this.dataStyles.map((item) => {
        item.show = true;
      });
      //   this.show_more = true;
      //   this.show_settings = false;
      this.$emit("click_showall");
    },
    onclickCancel() {
      this.show_settings = false;
      this.dataStyles.map((item) => {
        item.show = true;
      });
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
.btn_show {
  float: right;
  margin-top: -35px;
}
#estimated-date-layout-sample:hover {
  cursor: pointer;
  background-color: red;
  color: red;
}
</style>
