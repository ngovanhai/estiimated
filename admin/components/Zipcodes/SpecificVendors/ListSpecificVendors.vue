<template>
  <div>
    <el-table :data="data" :span-method="getRowSpan">
      <el-table-column prop="name" label="Vendor" width="180"></el-table-column>
      <el-table-column prop="zipcode_id" label="Zipcode" width="180">
        <template slot-scope="scope">
          <span v-html="getZipcodeName(scope.row.zipcode_id)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="minimum_days" label="Minimum" width="100"></el-table-column>
      <el-table-column prop="estimated_days" label="Estimated" width="100"></el-table-column>
      <el-table-column align="right">
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
    <div class="df">
      <div class="df-half-start">
        <el-pagination
          v-if="totalData > perPage"
          small
          layout="prev, pager, next"
          :total="totalData"
          :page-size="perPage"
          :current-page.sync="currentPage"
          @current-change="onGet"
        ></el-pagination>
      </div>
      <div class="df-half-end text-right">
        <el-button type="text" @click="onCreate">+ Vendor rule</el-button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: [
    "specificRules",
    "zipcodeRules",
    "totalData",
    "perPage",
    "currentPage"
  ],
  computed: {
    data: function() {
      return this.specificRules || [];
    },
    calculatedSpans: function() {
      if (this.data.length) {
        var currentVendor = this.data[0].name;
        var splits = [
          {
            index: 0,
            span: 1
          }
        ];
        for (var i = 1; i < this.data.length; i++) {
          if (this.data[i].name == currentVendor) {
            splits[splits.length - 1].span++;
          } else {
            currentVendor = this.data[i].name;
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
    getZipcodeName(zipcodeId) {
      let zipcode = this.zipcodeRules.find(e => e.id == zipcodeId);
      if (zipcode) {
        return zipcode.name;
      } else {
        return "N/A";
      }
    },
    getRowSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        let calculated = this.calculatedSpans.find(e => e.index == rowIndex);
        if (calculated) {
          return {
            rowspan: calculated.span,
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
    onGet(page) {
      this.$emit("get", page);
    },
    onCreate() {
      this.$emit("create");
    },
    onEdit(index, zipcode) {
      this.$emit("edit", zipcode);
    },
    onDelete(index, zipcode) {
      this.$confirm("Do you want to delete rule of this vendor?", "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.$emit("delete", zipcode);
        })
        .catch(_ => {});
    }
  }
};
</script>
