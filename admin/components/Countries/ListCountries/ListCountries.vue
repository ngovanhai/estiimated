<template>
  <div>
    <input placeholder="Search by country name..." v-model="searchByCountryName" @input="searchOnTable"  class="regular-input el-input__inner" />
    <el-table :data="tableData" v-loading="loading"> 
      <el-table-column prop="name" label="Country" width="180">
        <template slot-scope="scope">
          <div
            class="country-flag"
            v-if="scope.row.code != 'other_countries' && scope.row.code != '*'"
            :style="{
                backgroundImage : `url('https://www.countryflags.io/${scope.row.code}/flat/64.png')`,
                width: '16px',
                height: '16px',
                display: 'inline-block',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }"
          ></div> 
          <span v-html="scope.row.name"></span>
        </template>
      </el-table-column>
      <el-table-column prop="provinces" label="Provinces" width="100">
        <template slot-scope="scope">
          <span v-html="scope.row.provinces.length"></span>
        </template>
      </el-table-column>
      <el-table-column prop="Ordering" label="Ordering" width="100"></el-table-column>
      <el-table-column prop="minimum_days" label="Minimum" width="100"></el-table-column>
      <el-table-column prop="estimated_days" label="Estimated" width="100"></el-table-column>
      <el-table-column label="Actions" align="right">
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
          @current-change="onPageChange"
        ></el-pagination>
      </div>
      <div class="df-half-end text-right">
        <el-button type="text" @click="onCreate">+ Country Rule</el-button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  computed: {
    ...Vuex.mapGetters({
      countries: "countryDelivery/countryRules/getCountryRules",
      loading: "countryDelivery/countryRules/getFetching"
    }),
    tableData: function() {
      var page = this.currentPage - 1;
      var perPage = this.perPage;
      return this.countries.slice(page * perPage, (page + 1) * perPage);
    },
    totalData: function() {
      return Array.isArray(this.countries) ? this.countries.length : 0;
    }
  },
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      searchByCountryName:""
    };
  },

  created() {
    this.getCountryRules();
  },
  methods: {
    ...Vuex.mapActions({
      getCountryRules: "countryDelivery/countryRules/getCountryRules",
      deleteCountryRule: "countryDelivery/countryRules/deleteCountryRule",
      setEditingRule: "countryDelivery/countryRules/setEditingRule",
      reloadSpecificProductRules: "countryDelivery/specificProducts/getRules"
    }),
    searchOnTable(){ 
      window.searchByCountryName = this.searchByCountryName;
      this.getCountryRules(); 
    },
    onCreate() {
        this.$emit("create");
        this.getCountryRules(); 
    },
    onEdit(index, countryRule) {
      this.setEditingRule({
        rule: countryRule
      });
      this.$emit("edit", countryRule);
    },
    onDelete(index, countryRule) {
      this.$confirm("Do you want to delete this country rule ?", "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.confirmDelete(countryRule);
        })
        .catch(() => {});
    },
    confirmDelete(countryRule) {
      this.deleteCountryRule({
        od: countryRule.od
      })
        .then(() => {
          this.reloadSpecificProductRules();
        })
        .catch(error => {
           ShopifyNotification(error,"error"); 
        });
    },
    onPageChange(page) {
      this.currentPage = Number(page);
    }
  }
};
</script>
