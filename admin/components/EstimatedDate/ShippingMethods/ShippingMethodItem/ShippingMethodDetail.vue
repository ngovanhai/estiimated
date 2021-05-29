<template>
  <div>
    <div class="estimated-shipping-methods-item-header df show-item-on-hover">
      <div class="estimated-shipping-methods-item-header-info fx">
        <span v-html="genOrder()"></span>
        <span class="estimated-shipping-methods-item-header-info-icon" v-html="method.icon"></span>
        <span class="estimated-shipping-methods-item-header-info-name">
          <span v-html="method.name"></span>
          <span
            class="estimated-shipping-methods-item-header-info-name-lock-icon"
            v-if="method.is_private === 1"
            title="This method is private"
          >
            <i class="fas fa-lock"></i>
          </span>
        </span>
        <el-button
          class="item-to-show estimated-shipping-methods-item-header-text-btn"
          icon="fas fa-pen"
          type="text"
          size="mini"
          @click="onEdit"
          title="Edit"
        ></el-button>
        <el-button
          class="item-to-show estimated-shipping-methods-item-header-text-btn"
          icon="fas fa-trash-alt"
          type="text"
          size="mini"
          title="Delete"
          :loading="deleting"
          @click="onDelete"
        ></el-button>
      </div>
      <div class="estimated-shipping-methods-item-header-extra-actions">
        <el-button
          :icon="`fas ${showBody ? 'fa-minus' : 'fa-sort-down'} estimated-shipping-methods-item-header-text-btn`"
          type="text"
          size="mini"
          title="Show details"
          @click="showBody = !showBody"
        ></el-button>
        <el-button
          class="item-to-show estimated-shipping-methods-item-header-text-btn draggable"
          icon="fas fa-sort"
          type="text"
          size="mini"
          title="Drag and Drop to sort"
        ></el-button>
      </div>
    </div>
    <div v-if="showBody" class="estimated-shipping-methods-item-body">
      <div class="estimated-shipping-methods-item-body-item df">
        <span>Minimum days</span>
        <span class="fx" v-html="`: ${method.minimum_days}`"></span>
      </div>
      <div class="estimated-shipping-methods-item-body-item df">
        <span>Estimated days</span>
        <span class="fx" v-html="`: ${method.estimated_days}`"></span>
      </div>
      <div class="estimated-shipping-methods-item-body-item df">
        <span>Estimated text</span>
        <span class="fx" v-html="`: ${method.estimated_text}`"></span>
      </div>
      <div class="estimated-shipping-methods-item-body-item df">
        <span>Privacy</span>
        <span class="fx" v-html="`: ${method.privacy_text}`"></span>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ["method", "index"],
  data() {
    return {
      showBody: false,
      deleting: false
    };
  },
  created() {
    this.index == 0 ? (this.showBody = true) : null;
  },
  methods: {
    ...Vuex.mapActions({
      getSpecificRules: "estimatedDate/specificRules/getSpecificRules",
      deleteShippingMethod: "shippingMethods/deleteShippingMethod",
      countRelatedSpecificRules: "shippingMethods/countRelatedSpecificRules"
    }),
    genOrder() {
      var order = this.index + 1;
      return `${order}. `;
    },
    onEdit() {
      this.$emit("edit");
    },
    onDelete() {
      this.countRelatedSpecificRules({
        id: this.method.id
      }).then(totalRelatedRules => {
        this.confirmDelete(totalRelatedRules);
      });
    },
    confirmDelete(totalRelatedRules) {
      this.$confirm(
        `This will permanently delete this method and ${totalRelatedRules} relative specific rules. Continue?`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.delete();
        })
        .catch(() => {});
    },
    delete() {
      this.deleting = true;
      this.deleteShippingMethod({
        id: this.method.id
      })
        .then(() => {
          this.getSpecificRules();
          this.deleting = false;
        })
        .catch(error => {
          ShopifyNotification(error,"error"); 
        });
    }
  }
};
</script>

<style scoped>
.estimated-shipping-methods-item-header-info-name {
  font-weight: 400;
  position: relative;
}
.estimated-shipping-methods-item-header-info-name-lock-icon {
  position: absolute;
  top: -13px;
  right: -3px;
  opacity: 0.5;
}

.estimated-shipping-methods-item-header-info-name-lock-icon i {
  font-size: 8px;
}

.estimated-shipping-methods-item-header-text-btn {
  color: rgba(0, 0, 0, 0.5);
}
.estimated-shipping-methods-item-body {
  padding: 5px 10px;
  border-top: 1px solid #dcdfe6;
}
.estimated-shipping-methods-item-body-item > span:first-child {
  width: 110px;
}
.estimated-shipping-methods-item-body-item > span:nth-child(2) {
  font-weight: 500;
}
</style>
