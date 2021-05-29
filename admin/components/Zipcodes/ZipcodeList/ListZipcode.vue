<template>
  <div class="list-zipcodes-container">
    <a title="Import Zipcode" class="btnImportZipcode"  @click="centerDialogVisible = true"><i class="fa fa-upload" aria-hidden="true"></i>  </a>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="Rule" width="120"></el-table-column>
      <el-table-column prop="zipcode_list" label="Zipcode">
        <template slot-scope="scope">
          <span
            style="
                display: block;
                white-space: nowrap; 
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 180px;
            "
            :title="scope.row.zipcode_list"
            v-html="scope.row.zipcode_list"
          ></span>
        </template>
      </el-table-column>
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
            <!-- <el-button
              :class="{'md-primary' : demoZipcode && demoZipcode.id == scope.row.id}"
              icon="far fa-eye"
              size="mini"
              title="Preview"
              @click="onPreview(scope.$index, scope.row)"
            ></el-button>-->
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
          v-if="totalZipcodes > perPage"
          small
          layout="prev, pager, next"
          :total="totalZipcodes"
          :page-size="perPage"
          :current-page.sync="currentPage"
          @current-change="onPageChange"
        ></el-pagination>
      </div>
      <div class="df-half-end text-right">
        <el-button type="text" @click="onCreate">+ Zipcode Rule</el-button>
      </div>
    </div>

    <el-dialog
        title="Import Zipcodes by CSV "
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <div>
            <p>Download a <a href="https://apps.omegatheme.com/estimated-shipping/admin/components/Zipcodes/ZipcodeList/template-import-zipcode.xlsx" target="_blank">sample CSV template</a> to see an example of the format required.  </p>
             <input type="file" @change="fileExcelZipcode"  accept=".xlsx,.csv,.xls" />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="uploadListZipcode" class="uploadFileExcel">Upload</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
module.exports = {
  name: "list-zipcodes",
  props: ["zipcodes", "demoZipcode"],
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      centerDialogVisible: false,
      image :"",
      listZipCodeImport :[]
    };
  },
  computed: {
    tableData() {
      var page = this.currentPage - 1;
      var perPage = this.perPage;
      return this.zipcodes.slice(page * perPage, (page + 1) * perPage);
    },
    totalZipcodes() {
      return this.zipcodes ? this.zipcodes.length : 0;
    }
  },
  methods: {
    fileExcelZipcode(event){
        var self = this;
        let files = event.target.files || event.dataTransfer.files; 
        const  fd = new FormData();
        console.log("files",files)
        fd.append('fileZipcode',files[0]);
        fd.append('shop',window.shop); 
        fd.append('action',"importFile"); 
        if($(".errorFileExcel").length > 0){
            $(".errorFileExcel").remove();
        }
        if(files[0]['size'] > 3000000){
            $(".uploadFileExcel").after(`<p class="errorFileExcel">Please upload files <3MB in size</p>`); 
        }else{
            $(".uploadFileExcel").attr("disable",true); 
            $(".uploadFileExcel").html("Uploading...");
            this.$http.post(window.zipcodeImport, fd, { emulateJSON: true  
            }).then(result => { 
                console.log("result.body",result)
                $(".uploadFileExcel").html("Upload"); 
                $(".uploadFileExcel").attr("disable",false);
                self.listZipCodeImport = result.body
            });
        }
     
    },
    onCreate() {
      this.$emit("create");
    },
 
    
    uploadListZipcode(){
       var self = this;
      $(".uploadFileExcel").attr("disable",true); 
      $(".uploadFileExcel").html("Uploading...");
      this.$http
        .post(
          window.zipcodeImport,  {
              shop: window.shop,
            action:"importZipcode",
            listZipCodeImport:self.listZipCodeImport
            
          },
          {
            emulateJSON: true
          }
        )
      .then(result => { 
          $(".uploadFileExcel").attr("disable",false);
          $(".uploadFileExcel").html("Upload"); 
          self.centerDialogVisible = false;
          ShopifyNotification("Upload zipcode rule successfully","success");  
          self.onReloadRules();
          window.eventBus.$emit("generate-json-file");
      }); 
    },
    onReloadRules() {
      this.$emit("reload");
    },
    onDelete(index, zipcode) {
      this.$confirm("Do you want to delete this zipcode rule ?", "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.$emit("delete", zipcode);
        })
        .catch(() => {});
    },
    onEdit(index, zipcode) {
      this.$emit("edit", zipcode);
    },
    onPreview() {},
    onPageChange(page) {
      this.currentPage = page;
    }
  }
};
</script>
<style>
.btnImportZipcode{
    display: block;
    text-align: right;
    padding-right: 10px;
    cursor: pointer;
}
.el-upload-dragger,.el-upload {
  width: 100% !important;
}
.errorFileExcel{
    color: brown;
}
</style>