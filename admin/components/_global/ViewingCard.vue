<template>
  <el-card shadow="never" :body-style="{'padding' : show ? '20px' : '0'}">
    <div slot="header" class="viewing-card-header-container" @click="toggleShow">
      <span v-html="title"></span>
      <el-button class="card-toggle-btn" type="text">
        <span v-if="!show">
          Show
          <i class="fas fa-sort-down"></i>
        </span>
        <span v-else>
          Hide
          <i class="fas fa-minus"></i>
        </span>
      </el-button>
    </div>
    <slot v-if="show"></slot>
  </el-card>
</template>
 
<script>
module.exports = {
  props: {
    title: {
      type: String,
      required: true
    },
    showContent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true
    };
  },
  mounted() {
    if (typeof this.showContent === "boolean") {
      this.show = this.showContent;
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  }
};
</script>

<style scoped>
.viewing-card-header-container {
  cursor: pointer;
}
</style>
