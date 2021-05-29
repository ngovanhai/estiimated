<template>
  <div>
    <div class="filter">
      <input
        placeholder="Search by collection title..."
        v-model="searchCollection"
        @input="searchOnTable"
        class="regular-input el-input__inner"
      />
      <multiselect
        v-model="filterCountry"
        :options="countryRules"
        placeholder="Search country..."
        label="name"
        track-by="id"
        @input="searchOnTable"
        select-label="Select"
        deselect-label="Remove"
        :multiple="false"
      />
    </div>
    <el-table
      :data="specificCollections"
      :span-method="getRowSpan"
      v-loading="loading"
    >
      <el-table-column prop="collection_id" label="Collection" width="180">
        <template slot-scope="scope">
          <a :href="`https://${window.shop}/collections/${getCollectionHandle(scope.row.collection_id)}`" target="_blank">
            <span v-html="getCollectionTitle(scope.row.collection_id)"></span>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="country_id" label="Country" width="180">
        <template slot-scope="scope">
          <span
            v-html="getCountryName(scope.row.country_id, scope.$index)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="minimum_days"
        label="Minimum"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="estimated_days"
        label="Estimated"
        width="100"
      ></el-table-column>
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
          small
          layout="prev, pager, next"
          :total="totalData"
          :page-size="perPage"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div class="df-half-end text-right">
        <el-button type="text" @click="onCreate">+ Collection rule</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    components: {
      multiselect: window.VueMultiselect.default,
    },
    computed: {
      ...Vuex.mapGetters({
        collections: "_shopify/collections/getCollections",
        countryRules: "countryDelivery/countryRules/getCountryRules",
        specificCollections: "countryDelivery/specificCollections/getRules",
        loading: "countryDelivery/specificCollections/getFetching",
        totalData: "countryDelivery/specificCollections/getTotal",
        page: "countryDelivery/specificCollections/getPage",
        perPage: "countryDelivery/specificCollections/getPerPage",
      }),
      calculatedSpans: function () {
        if (this.specificCollections.length) {
          var currentId = this.specificCollections[0].collection_id;
          var splits = [
            {
              index: 0,
              span: 1,
            },
          ];
          for (var i = 1; i < this.specificCollections.length; i++) {
            if (this.specificCollections[i].collection_id == currentId) {
              splits[splits.length - 1].span++;
            } else {
              currentId = this.specificCollections[i].collection_id;
              splits[splits.length] = {
                index: i,
                span: 1,
              };
            }
          }
          return splits;
        } else {
          return [];
        }
      },
      currentPage: {
        get: function () {
          return this.page;
        },
        set: function (page) {
          this.onGet(page);
        },
      },
    },
    data() {
      return {
        searchCollection: "",
        filterCountry: [],
      };
    },
    mounted() {
      this.onGet(1);
    },
    methods: {
      ...Vuex.mapActions({
        getRules: "countryDelivery/specificCollections/getRules",
        deleteRule: "countryDelivery/specificCollections/deleteRule",
        setPage: "countryDelivery/specificCollections/setPage",
        setEditingRule: "countryDelivery/specificCollections/setEditingRule",
      }),
      searchOnTable() {
        window.searchCollection = this.searchCollection;
        window.filterCountry = this.filterCountry.id;
        this.onGet(1);
      },

      getCollectionTitle(collectionId) {
        let collection = this.collections.find((e) => e.id == collectionId);
        if (collection) {
          return collection.title;
        } else {
          console.log("collectionId", collectionId);
          console.log("this.collections", this.collections);
          return "N/A";
        }
      },
      getCollectionHandle(collectionId) {
        let collection = this.collections.find((e) => e.id == collectionId);
        if (collection) {
          return collection.handle;
        } else {
          console.log("collectionId", collectionId);
          console.log("this.collections", this.collections);
          return "N/A";
        }
      },
      getCountryName(countryId, index) {
        let country = this.countryRules.find((e) => e.id == countryId);
        if (country) {
          if (!this.specificCollections[index]["country_name"]) {
            this.specificCollections[index]["country_name"] = country.name;
          }
          return country.name;
        } else {
          if (!this.specificCollections[index]["country_name"]) {
            this.specificCollections[index]["country_name"] = "N/A";
          }
          return "N/A";
        }
      },
      getRowSpan({ row, column, rowIndex, columnIndex }) {
        if (columnIndex == 0) {
          let calculated = this.calculatedSpans.find((e) => e.index == rowIndex);
          if (calculated) {
            return {
              rowspan: calculated.span,
              colspan: 1,
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
      },
      onGet(page) {
        this.setPage({ page });
        this.getRules();
      },
      onCreate() {
        this.$emit("create");
      },
      onEdit(index, rule) {
        this.setEditingRule({
          rule,
        });
        this.$emit("edit");
      },
      onDelete(index, rule) {
        this.$confirm("Do you want to delete rule of this product?", "Warning", {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            this.deleteRule({
              id: rule.id,
            }).then(() => {
              ShopifyNotification("Delete rule success", "success");
            });
          })
          .catch((_) => {});
      },
    },
  };
</script>
<style>
  .filter {
    display: flex;
  }
  .filter input {
    border-radius: 0px;
    border-right: none;
  }
  .filter > .multiselect {
    width: 50%;
  }
  .filter .multiselect__tags {
    border-radius: 0px;
  }

  .filter .multiselect .multiselect__single {
    color: #454546;
  }
</style>