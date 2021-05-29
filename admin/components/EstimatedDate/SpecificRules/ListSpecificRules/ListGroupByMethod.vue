<template>
  <el-table :data="rules" v-loading="loading">
    <el-table-column prop="id" label="ID" width="60"></el-table-column>
    <el-table-column prop="enable" label="Status" width="80">
      <template slot-scope="scope">
        <el-tag :type="scope.row.enable == 1 ? 'success' : 'info'">
          <span v-text="scope.row.enable == 1 ? 'Enable' : 'Disable'"></span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="minimum_days" label="Min" width="50" align="center"></el-table-column>
    <el-table-column prop="estimated_days" label="Est" width="50" align="center"></el-table-column>
    <el-table-column prop="shipping_method_id" label="Method">
      <template slot-scope="scope">
        <span v-html="getShippingMethodName(scope.row.shipping_method_id)"></span>
      </template>
    </el-table-column>
    <el-table-column prop="targets_count" label="Targets" width="120">
      <template slot-scope="scope">
        <el-popover
          placement="right"
          title="Targets"
          width="200"
          trigger="hover"
          @show="onGetPreviewData(scope.row.id)"
        >
          <div v-loading="loadingPreview">
            <ul class="specific-rule-list-targets">
              <li class="specific-rule-target" v-for="data in previewData" :key="data.type">
                <span v-html="`${data.title}:`"></span>
                <ul class="specific-rule-list-target-items">
                  <li v-for="item in data.items" :key="item || item.title">
                    <a
                      v-if="data.type !== 'vendor'"
                      :href="generateUrl(data.type, item.handle)"
                      target="_blank"
                      v-html="item.title"
                    ></a>
                    <span v-else v-html="item"></span>
                  </li>
                  <li v-if="data.isOverLimit">...</li>
                </ul>
              </li>
            </ul>
          </div>
          <div slot="reference">
            <p
              v-for="target in scope.row.targets_count"
              :key="target.type"
              v-html="`${target.total} ${target.type}`"
            ></p>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column align="right" width="155">
      <template slot-scope="scope">
        <el-button-group>
          <el-button
            icon="far fa-edit"
            size="mini"
            title="Edit"
            @click="onEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            icon="far fa-trash-alt"
            size="mini"
            title="Delete"
            @click="onDelete(scope.$index, scope.row)"
          ></el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      rules: "estimatedDate/specificRules/getRules",
      loading: "estimatedDate/specificRules/getFetching",
      shippingMethods: "shippingMethods/getShippingMethods",
      loadingPreview: "estimatedDate/specificRules/getFetchingPreviewData",
      previewData: "estimatedDate/specificRules/getPreviewData"
    })
  },
  methods: {
    ...Vuex.mapActions({
      setRuleId:
        "estimatedDate/specificRules/currentSpecificRule/setSpecificRuleId",
      setSelectedTargets:
        "estimatedDate/specificRules/currentSpecificRule/setSelectedTargets",
      setForceCreate:
        "estimatedDate/specificRules/currentSpecificRule/setForceCreate",
      deleteRule: "estimatedDate/specificRules/deleteSpecificRule",
      getPreviewData: "estimatedDate/specificRules/getPreviewData"
    }),
    onEdit(index, rule) {
      this.setForceCreate({
        forceCreate: false
      });
      this.setSelectedTargets({
        targets: []
      });
      this.setRuleId({
        id: rule.id
      });
      this.$emit("edit");
    },
    onDelete(index, rule) {
      this.$confirm("This will permanently delete rule. Continue?", "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.deleteRule({
            id: rule.id
          });
        })
        .catch(() => {});
    },
    getShippingMethodName(methodId) {
      let method = this.shippingMethods.find(e => e.id == methodId);
      if (method) {
        return method.name;
      } else {
        return "N/A";
      }
    },
    onGetPreviewData(ruleId) {
      this.getPreviewData({
        id: ruleId
      });
    },
    generateUrl(type, handle) {
      let shop = window.shop;
      let url = `https://${shop}/`;
      switch (type) {
        case "product":
          url += "products/";
          break;
        case "collection":
          url += "collections/";
          break;
        default:
          break;
      }
      url += handle;
      return url;
    }
  }
};
</script>

<style> 
.specific-rule-list-targets {
  list-style: disc;
  margin-left: 10px;
}
.specific-rule-target {
  margin-top: 10px;
}
.specific-rule-list-target-items {
  list-style: circle;
  margin-left: 10px;
}
</style>
