<template>
  <div>
    <b-container>
      <!-- User Interface controls -->

      <div class="wp_data" v-show="typeof storeEdit.shop == 'undefined'">
        <b-row>
          <b-col md="6" class="my-1">
            <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
              <b-input-group>
                <b-form-input v-model="filter" placeholder="Enter store name to search information"></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col> 
          
        </b-row>

        <!-- Main table element -->
        <p>Total row: {{fields.length}} </p>
        <b-table
          show-empty
          stacked="md"
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          @filtered="onFiltered"
        >
           <template slot="stt" slot-scope="row">
                        <strong>{{row.value}}</strong>
                    </template>
                    <template slot="shop" slot-scope="row">
                        <a target="_blank" :href=" window.rootLink+'/admin.php?shop='+row.value"  style="cursor: pointer;color: #007bff;">{{row.value}}</a>
                    </template>
                     <template slot="note" slot-scope="row">
                        <a @click="showNoteStore(row.item.id)" style="cursor: pointer;color: #007bff;" :class="'textNote textNote_'+row.item.id" v-if="row.value != ''">{{row.value}}</a>
                        <button @click="showNoteStore(row.item.id)" style="cursor: pointer;color: #007bff;" :class="'button btn textNote textNote_'+row.item.id" v-else>Add note</button>
                        <div :class="'contentNote contentNote_'+row.item.id">
                            <textarea   cols="30" rows="5">{{row.value}}</textarea>
                            <b-button class="saveNote" @click="saveNoteStore(row.item.shop,row.item.id)" variant="dark">Save</b-button>
                        </div>
                    </template>
                    <template slot="install" slot-scope="row">
                        <polaris-badge status="success" v-if="row.value == 'install'">
                            Installed
                        </polaris-badge>
                        <polaris-badge  v-else>
                            Uninstalled
                        </polaris-badge>
                    </template>
             <template slot="actions" slot-scope="row">
                <a
                size="sm"
                class="mr-1 btn btn-xanh"
                @click="updateScriptTag(row.item, row.index, $event.target)"
                >
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </a> 
          </template> 
        </b-table> 
        <b-row>
          <b-col md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>  
    </b-container>
  </div>
</template> 
 
  <script>
module.exports = {
  props: [],
  data: function() {
    return {
        items: [],
        totalRows: 1,
        currentPage: 1,
        perPage: 20,
        settings: [],
        pageOptions: [5, 10, 15],
        sortBy: null,
        sortDesc: false,
        sortDirection: "asc",
        filter: null,
        storeEdit: [],
        urlChart:"",
        fields: [
            { key: 'stt', label: '#', sortable: true, sortDirection: 'desc' },
            { key: 'shop', label: 'Store Name', sortable: true },
            { key: 'date_installed', label: 'Installed Date', sortable: true  },
            { key: 'email_shop', label: 'Email', sortable: true  },
            { key: 'phone', label: 'Phone', sortable: true  },
            { key: 'country', label: 'country code', sortable: true  },
            { key: 'date_uninstalled', label: 'date_uninstalled', sortable: true  },
            { key: 'note', label: 'note', sortable: true  },
            { key: 'install', label:'Status'},
            { key: "actions", label: "Actions", sortable: true, sortDirection: "desc" },  
        ], 
    };
  },
  mounted: function() {
    var self = this;
    this.totalRows = this.items.length;
    this.getAllShops();
  },
  components: {},
  methods: { 
    getAllShops() {
        this.fetching = true;
        this.$http
        .get("process.php", {
            params: {
                action: "getAllShops",
            }
        }).then(res => {
            this.items = res.body;
            console.log("res.body.shops",res.body)
            this.fetching = false;
        });
    },
    updateScriptTag(item, index, button) { 
        var self = this;
        self.items[index].updating = true;
        this.$http
            .get(window.rootApi, {
                params: {
                    action: "generate",
                    shop: item.shop
                }
            })
            .then(res => {
                var data = res.body;
                if (data && data.error) {
                    self.items[index].status = 'Uninstalled';
                } else {
                    self.items[index].status = 'Updated Script Tag';
                }
                self.items[index].updating = false;
               
            })
            .catch(error => {
                self.items[index].status = 'Error';
                self.items[index].updating = false;
            })
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
     saveNoteStore: function(shop,id){
                var seft = this;
                $.ajax({
                    url: "process.php",
                    data: {
                        action: "saveNoteStore",
                        shop: shop,
                        note: $(".contentNote_"+id+ ' textarea').val(),
                    },
                    dataType: "JSON",
                    type: "GET", 
                }).done((data) => { 
                    $(".contentNote_"+id).hide();
                    $(".textNote_"+id).show();
                    seft.getAllShops();
                })
            },
            showNoteStore: function(id){
                console.log($(".contentNote_"+id));
                $(".contentNote_"+id).show();
                $(".textNote_"+id).hide();
            }
  }
};
</script>
<style>
.wrapperChar{
position: fixed;
    left: 0px;
    width: 300px;
    text-align: center;
    bottom: 10%;
}
.wrapperChar h3 {
    font-size: 13px;
    text-transform: uppercase;
    color: #8e8e8e;
}
.wrapperChar img{
    width:100%;
}
 
.contentNote{
    display:none;
}
.saveNote{
    display: block;
    margin-top: 10px;
    font-size: 15px;
    padding: 5px 5px;
    width: 100%;
}
.button.btn.textNote{
        display: block;
    margin-top: 10px;
    font-size: 15px;
    padding: 5px 5px;
    width: 100%;
    color: black !important;
}
 
</style>