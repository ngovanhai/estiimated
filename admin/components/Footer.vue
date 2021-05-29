<template>
  <div class="app-footer">
    <div class="footer-header">
        <p><i class="fa fa-info-circle" aria-hidden="true"></i>Do you want to show a delivery date for the product? Please refer app <a   target="_blank" href="https://apps.shopify.com/delivery-date-omega">Delivery Date by Omega</a></p>
        <p><i class="fa fa-question-circle" aria-hidden="true"></i>

            After change setting, if your store does not change please wait 1 - 3 minutes to update the data or enter 
            <a @click="updateCache()" style="    cursor: pointer; color: #409EFF; font-weight: bold;">here</a> 
            to update now  
        </p>
        <p class="statusUpdate">Updating...</p>
        <a target="_blank" href="https://estimates-shipping-date.myshopify.com/pages/install-app">
            <el-button icon="el-icon-document" round>Our Document.</el-button>
        </a>
    </div>
    <!-- <?php require 'admin/review/star.php'; ?> -->
    <el-row class="footer-more-apps" type="flex" justify="center" :gutter="10">
      <el-col class="footer-more-app-container" v-for="app in moreApps" :key="app.title" :span="6">
        <a :href="app.url" target="_blank">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img :src="app.img">
            <div style="padding: 14px;">
              <span v-html="app.title"></span>
              <el-rate
                v-model="app.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value} points"
              ></el-rate>
            </div>
          </el-card>
        </a>
      </el-col>
    </el-row>
    <div class="footer-copyright">
      ©2019
      <a href="https://www.omegatheme.com/" target="_blank">Omegatheme</a> All Rights Reserved.
    </div>
  </div>
</template>

<script> 
module.exports = {
  data() {
    return {
      moreApps: [
        {
          url:
            "https://apps.shopify.com/quantity-price-breaks-limit-purchase?utm_source=estimated_shipping_admin&surface_type=estimated_shipping",
          title: "Quantity Price Breaks",
          img:
            "https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/5143/splash.png?1452220345",
          rating: 5.0
        },
        {
          url:
            "https://apps.shopify.com/facebook-reviews-1?utm_source=estimated_shipping_admin&surface_type=estimated_shipping",
          title: "Facebook Reviews",
          img:
            "https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/13331/splash.png?1499916138",
          rating: 5.0
        },
        {
          url:
            "https://apps.shopify.com/delivery-date-omega",
          title: "Delivery Date",
          img:
            "https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/20857/splash.png?1523954773",
          rating: 5.0
        },
        {
          url:
            "https://apps.shopify.com/order-tagger-by-omega?utm_source=estimated_shipping_admin&surface_type=estimated_shipping",
          title: "Order Tagger",
          img:
            "https://s3.amazonaws.com/shopify-app-store/shopify_applications/small_banners/17108/splash.png?1510565540",
          rating: 5.0
        }
      ]
    };
  },
    methods : {
        updateCache: function(){
            $(".statusUpdate").html("Updating...");
            $(".statusUpdate").show();
            var self = this; 
            $.ajax({
                url: 'https://apps.omegatheme.com/estimated-shipping/admin/services/_generateJson.php?action=generate&shop=estimated-shipping.myshopify.com',
                type: 'GET',
                data: {}
            }).done((result) => {
                $(".statusUpdate").html("Update done. Please check again. If you need to support please contact via contact@omegatheme.com");
            }).fail((error) => {
                $(".statusUpdate").html("Update error. Please contact contact@omegatheme.com for assistance");
            });  
        }     
    }
};
</script>
<style lang="css">
    .statusUpdate{
        display: none;
    }
</style>

