<template>
  <el-table :data="rules" v-loading="loading" :span-method="getRowSpan">
    <el-table-column prop="value" label="Target" width="180">
      <template slot-scope="scope">
        <el-tooltip effect="dark" :content="`Type: ${scope.row.type}`" placement="left-start">
          <span v-html="getTargetTitle(scope.row.type, scope.row.value)"></span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="shipping_method_id" label="Method" width="180">
      <template slot-scope="scope">
        <span v-html="getShippingMethodName(scope.row.shipping_method_id)"></span>
      </template>
    </el-table-column>
    <el-table-column prop="enable" label="Status" width="80">
      <template slot-scope="scope">
        <el-tag :type="scope.row.enable == 1 ? 'success' : 'info'">
          <span v-text="scope.row.enable == 1 ? 'Enable' : 'Disable'"></span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="minimum_days" label="Min" width="50" align="center"></el-table-column>
    <el-table-column prop="estimated_days" label="Est" width="50" align="center"></el-table-column>
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
      products: "_shopify/products/getProducts",
      collections: "_shopify/collections/getCollections"
    }),
    getSiblings: function() {
      if (this.rules.length) {
        var currentValue = this.rules[0].value;
        var splits = [
          {
            index: 0,
            span: 1
          }
        ];
        for (var i = 1; i < this.rules.length; i++) {
          if (this.rules[i].value == currentValue) {
            splits[splits.length - 1].span++;
          } else {
            currentValue = this.rules[i].value;
            splits[splits.length] = {
              index: i,
              span: 1
            };
          }
        }
        return splits;
      } else {
        return [];
      }
    }
  },
  methods: {
    ...Vuex.mapActions({
      setRuleId:
        "estimatedDate/specificRules/currentSpecificRule/setSpecificRuleId",
      setSelectedTargets:
        "estimatedDate/specificRules/currentSpecificRule/setSelectedTargets",
      setForceCreate:
        "estimatedDate/specificRules/currentSpecificRule/setForceCreate",
      deleteRule: "estimatedDate/specificRules/deleteSpecificRule"
    }),
    onEdit(index, rule) {
      this.setForceCreate({
        forceCreate: true
      });
      this.setSelectedTargets({
        targets: [
          {
            type: rule.type,
            value: rule.value
          }
        ]
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
      return method ? method.name : "N/A";
    },
    getRowSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        let sibling = this.getSiblings.find(e => e.index == rowIndex);
        if (sibling) {
          return {
            rowspan: sibling.span,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    getTargetTitle(type, value) {
      switch (type) {
        case "product":
          let product = this.products.find(
            product => Number(product.id) === Number(value)
          );
          return product ? product.title : "N/A";
          break;
        case "collection":
          let collection = this.collections.find(
            collection => Number(collection.id) === Number(value)
          );
          return collection ? collection.title : "N/A";
          break;
        case "vendor":
          return value;
          break;
        default:
          break;
      }
    }
  }
}; 
</script>
