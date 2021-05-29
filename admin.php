<?php
require 'conn-shopify.php';
session_start();
$shop = $_GET['shop'];
$shopData = $db->query("SELECT * FROM tbl_usersettings WHERE store_name = '" . $shop . "' AND app_id = $appId");
$shopData = $shopData->fetch_object();
$confirmUrl = $shopData->confirmation_url;
$clientStatus = $shopData->status;
if ($clientStatus != 'active') {
    header('Location: ' . $rootLink . '/chargeRequire.php?shop=' . $shop);
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Estimated Shipping Date Admin</title>
        <meta content="width=device-width,initial-scale=1,minimal-ui" name="viewport">
        <meta content="yes" name="mobile-web-app-capable">
        <meta content="yes" name="apple-mobile-web-app-capable">
        <meta content="black" name="apple-mobile-web-app-status-bar-style">
        <meta content="Estimated Shipping" name="apple-mobile-web-app-title">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/element-ui@2.4.11/lib/theme-chalk/index.css">
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic">
        <link rel="stylesheet" href="admin/lib/vue-flatpickr/flatpickr.min.css">
        <link rel="stylesheet" href="admin/lib/vue-multiselect/vue-multiselect.min.css">
        <link rel="stylesheet" href="admin/styles/styles.css?v=<?php echo time(); ?>">
        <link href="https://cdn.jsdelivr.net/npm/vue-toast-notification/dist/theme-default.css" rel="stylesheet"> 
        <link rel="stylesheet" href="admin/styles/multiselect.css?v=<?php echo $v; ?>">
        <link rel="stylesheet" href="admin/styles/panel-component.css?v=<?php echo $v; ?>">
        <link rel="stylesheet" href="admin/styles/utilities.css?v=<?php echo $v; ?>">
        <link rel="stylesheet" href="admin/styles/element-ui.css?v=<?php echo $v; ?>">
        <link rel="stylesheet" href="admin/styles/footer.css?v=<?php echo $v; ?>">
        <link rel="stylesheet" href="admin/styles/preview.css?v=<?php echo $v; ?>">
		<script src="https://apps.omegatheme.com/helpdesk/plugin.js?appId=20&v=<?php echo time(); ?>"></script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5CPCDDB');</script>
<!-- End Google Tag Manager -->		
		
    </head>
    <body>
        <!-- Main app -->
        <div id="estimated-app" style="margin-bottom: 25px;">
           <app></app>
           <error></error>
		   <?php require 'admin/review/star.php'; ?>
        </div>
      
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-126587266-1"></script>
		<script>
		 window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'UA-126587266-1'); 
		</script>
		<?php include 'google_remarketing_tag.txt';?>
        <script src="https://cdn.shopify.com/s/assets/external/app.js"></script>
        <script>
            var apiKey = "<?php echo $apiKey; ?>";
            var shopOrigin = "https://<?php echo $shop; ?>";
            window.shop = "<?php echo $shop; ?>";
            window.v = "<?php echo $v; ?>";

        </script>
        <div class="shopifyNotification"></div>
        <script type="text/javascript">
           
            function ShopifyNotification(notification,type){
                console.log("ShopifyNotification") 
                $(".shopifyNotification").empty().append(`
                    <div class="wrapperNotification ${type}">
                        <a>${notification}</a>
                    </div>
                `);
                $(".shopifyNotification").show();
                setTimeout(() => {
                    $(".shopifyNotification").hide();
                }, 3000);
              
            }
            // Assign Url Api to window, so we can use it in anywhere if needed
            // Shopify Api toggle with server
            window.shopifyApi = "./admin/services/_shopify.php";

            // Generate Json File Api
            window.generateJsonApi = "./admin/services/_generateJson.php";

            // Admin Api Services
            // -- General Settings
            window.generalSettingsApi = "./admin/services/GeneralSettings.php";
            // -- Estimated Date
            window.estimatedDateGeneralApi = "./admin/services/EstimatedDate.php";
            window.estimatedDateShippingMethodsApi = "./admin/services/EstimatedDate/ShippingMethods.php";
            window.estimatedDateSpecificRulesApi = "./admin/services/EstimatedDate/SpecificRules.php";
            window.estimatedDateSpecificVendorsApi = "./admin/services/EstimatedDate/SpecificVendors.php";
            window.estimatedDateSpecificProductsApi = "./admin/services/EstimatedDate/SpecificProducts.php";
            window.estimatedDateSpecificCollectionsApi = "./admin/services/EstimatedDate/SpecificCollections.php";

            // -- Zipcode
            window.zipcodeGeneralApi = "./admin/services/Zipcodes.php";
            window.zipcodeListApi = "./admin/services/Zipcodes/ZipcodeList.php";
            window.zipcodeSpecificProductsApi = "./admin/services/Zipcodes/SpecificProducts.php";
            window.zipcodeSpecificCollectionsApi = "./admin/services/Zipcodes/SpecificCollections.php";
            window.zipcodeSpecificVendorsApi = "./admin/services/Zipcodes/SpecificVendors.php";
            window.zipcodeImport = "./admin/services/Zipcodes/ZipcodeImport.php";

            // -- Country
            window.countryListCountriesApi = "./admin/services/Countries/ListCountries.php";
            window.countrySpecificProductsApi = "./admin/services/Countries/SpecificProducts.php";
            window.countrySpecificCollectionsApi = "./admin/services/Countries/SpecificCollections.php";
        </script>
        <script src="admin/lib/vue-flatpickr/flatpickr.min.js"></script>
        <script src="admin/lib/vue/vue.js"></script>
        <script src="admin/lib/vuex/vuex.min.js"></script>
        <script src="admin/lib/vue-loader/http-vue-loader.min.js"></script>
        <script src="admin/lib/vue-resource/vue-resource.js"></script>
        <script src="admin/lib/vue-element-ui/element-ui.min.js"></script>
        <script src="admin/lib/vue-element-ui/element-ui-locale-en.js"></script>
        <script src="admin/lib/vue-flatpickr/vue-flatpickr.min.js"></script>
        <script src="admin/lib/vue-multiselect/vue-multiselect.min.js"></script>
        <script src="admin/lib/moment/moment.min.js"></script>
        <script src="admin/lib/Sortable.min.js"></script>
        <script src="admin/lib/vuedraggable.umd.min.js"></script>
        <script src="admin/lib/browser/browser.js"></script>

        <script>
            let entrySrc = window.browser.isValid ? "admin/app.js?v=<?php echo $v; ?>" : "admin/error.js?v=<?php echo $v; ?>";

            getScript({
                source: entrySrc,
                type: "module"
            });
            
            function getScript({
                source,
                type
            }) {
                return new Promise((resolve) => {
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = source;
                    s.type = type;
                    s.onload = s.onreadystatechange = function (_, isAbort) {
                        if (isAbort || !s.readyState || /loaded|complete/.test(s.readyState)) {
                            s.onload = s.onreadystatechange = null;
                            s = undefined;

                            if (!isAbort) {
                                resolve();
                            }
                        }
                    };
                    var x = document.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                });
            }
        </script>
 
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CPCDDB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->	



 
<div class="otGroupButton">
            <style type="text/css">
                    .zopim:nth-child(1){display:none}.cart_count{display:flex;align-items:center;justify-content:center;position:absolute;right:-7px;top:-2px;font-weight:700;background-color:#557b97;color:#fff;min-width:1em;height:1em;border-radius:50%;font-weight:400;font-size:16px;padding:5px 0}.cta_group_preview{position:fixed;z-index:99999}.cta_group_preview.position_left{position:fixed;bottom:10%;left:20px}.cta_group_preview .ot-btn-item.has_text.icon_text,.cta_group_preview .ot-btn-item.has_text.only_text{width:auto;padding:10px}.cta_group_preview .ot-btn-item.has_text.icon_text .ot-btn-icon,.cta_group_preview .ot-btn-item.has_text.only_text .ot-btn-icon{margin-right:5px}.cta_group_preview .ot-btn-item.has_text.icon_text .ot-btn-item-child{display:flex}.cta_group_preview .ot-btn-item.has_text.only_text .ot-btn-item-child{display:block}.cta_group_preview .ot-btn-item.only_icon .ot-btn-text-icon{display:none}.cta_group_preview .ot-btn-item.only_text .ot-btn-icon{display:none}.ot-btn-icon{display:flex}.cta_group_preview.vertical{bottom:10%}.cta_group_preview.horizontal{bottom:20px;display:flex}.cta_group_preview.position_right{position:fixed;bottom:10%;right:20px}.cta_group_preview.position_bottom{position:fixed;bottom:10px}.vertical .ot-btn-item{display:block}.horizontal .ot-btn-item{display:inline-block}.style1 .ot-btn-item{border-radius:5px;margin-bottom:5px}.style1 .ot-btn-item{border-radius:0;margin-bottom:5px}.style2 .ot-btn-item{border-radius:5px;margin-bottom:5px}.style3 .ot-btn-item{border-radius:50%;margin-bottom:5px}.style4 .ot-btn-item{border-radius:50% 5px 50% 50%;margin-bottom:5px}.style5 .ot-btn-item{border-radius:50%;margin-bottom:5px}.style6 .ot-btn-item{border-radius:50% 50% 5px 50%;margin-bottom:5px}.style7 .ot-btn-item{border-radius:50% 50% 50% 5px;margin-bottom:5px}.small .ot-btn-item{width:32px;height:32px;padding:7px 0 0 7px}.medium .ot-btn-item{width:55px;height:55px}.large .ot-btn-item{width:55px;height:55px;padding:10px 0 0 10px}.small .ot-btn-icon,.small .ot-btn-icon img,.small .ot-btn-icon svg{width:18px;height:18px;line-height:32px;opacity:1}.medium .ot-btn-icon,.medium .ot-btn-icon img,.medium .ot-btn-icon svg{width:55px;height:55px;line-height:40px;opacity:1}.large .ot-btn-icon,.large .ot-btn-icon img,.large .ot-btn-icon svg{width:28px;height:28px;line-height:48px;opacity:1}.small .ot-btn-text-icon{font-size:14px;line-height:16px}.medium .ot-btn-text-icon{font-size:16px;line-height:20px}.large .ot-btn-text-icon{font-size:18px;line-height:24px}.ot-btn-item{display:block;background-color:#000;opacity:1;margin-right:5px;margin-top:5px;margin-bottom:5px;box-shadow:2px 2px 11px 2px rgba(0,0,0,0.08),0 2px 10px 0 rgba(0,0,0,.10)}.ot-btn-item:hover{cursor:pointer;box-shadow:0 5px 11px 0 rgba(0,0,0,.16),0 4px 15px 0 rgba(0,0,0,.13)}.ot-btn-item .ot-btn-item-child{display:inline-block;width:100%;height:100%;text-align:center}.ot-btn-item:hover{animation:.5s linear animateButton}@keyframes animateButton{0%{transform:translateY(0)}50%{transform:translateY(-5px)}100%{transform:translateY(0)}}@media screen and (max-width: 768px){.cta_group_preview.position_right{right:5px}.cta_group_preview.position_left{left:5px}}@media screen and (max-width: 800px){.cta_group_preview.display_desktop{visibility:hidden}.modal-window > div{width:90%!important;padding:5px!important}}@media screen and (min-width: 1300px){.cta_group_preview.display_mobile{visibility:hidden}}.modal-window:target{visibility:visible;opacity:1;pointer-events:auto}.modal-window{position:fixed;background-color:#9e0000;top:0;right:0;bottom:0;left:0;z-index:999;visibility:hidden;opacity:0;pointer-events:none;-webkit-transition:all .3s;transition:all .3s}.modal-window > div{width:60%;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);padding:20px;background:red;box-shadow:0 3px 12px rgba(0,0,0,0.2)}.modal-close{color:#000;line-height:30px;font-size:100%;position:absolute;right:0;text-align:center;top:0;width:30px;height:30px;background:red;box-shadow:0 3px 12px rgba(0,0,0,0.2)}.modal-close:hover{color:red!important}}.ot-whatsapp-box *,.ot-wsp-chat-btn *,.ot-wsp-nft-text *{font-family:'Poppins',sans-serif;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.ot-whatsapp-box :focus,.ot-wsp-chat-btn :focus,.ot-wsp-nft-text :focus{outline:none}.ot-whatsapp-box{width:300px;padding:0 0 26px;background:#fff;border-radius:25px;box-shadow:0 3px 12px rgba(0,0,0,0.2);opacity:0;visibility:hidden;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;z-index:9999999998;pointer-events:none;position:fixed;bottom:30px}.ot-whatsapp-box.chatbox-opened{opacity:1;visibility:visible;pointer-events:auto}.ot-whatsapp-box .ot-chatbox-header{width:100%;padding:20px 20px 40px;border-radius:25px 25px 0 0;position:relative;overflow:hidden}.ot-whatsapp-box .ot-chatbox-header h2{font-size:18px;font-weight:700;line-height:36px;color:#fff;margin:0 0 3px;text-transform:none;letter-spacing:normal}.ot-whatsapp-box .ot-chatbox-header p{font-size:13px;font-weight:400;line-height:1.4;margin:0}.ot-whatsapp-box .ot-chatbox-header img{position:absolute;left:0;bottom:-24px;width:100%;height:45px;fill:#fff}.ot-whatsapp-box .ot-chatbox-list-wrap{width:100%;height:0;transition:height .4s ease;position:relative;overflow:hidden;z-index:1}.ot-whatsapp-box .ot-chatbox-list{width:100%;padding:0 15px;margin-top:10px}.ot-whatsapp-box .close-ot-chctbox{position:absolute;top:5px;right:2px;width:40px;height:40px;padding:10px}.close-ot-chctbox .ot-close-i-ic:before,.close-ot-chctbox .ot-close-i-ic:after{background:#fff}.ot-whatsapp-box .ot-cbox-footer{display:block!important;position:absolute;bottom:0;left:0;width:100%;font-size:11px;font-weight:400;line-height:15px;border-radius:0 0 25px 25px;padding:5px 10px;color:#333;text-align:center;z-index:2}.ot-whatsapp-box .ot-cbox-footer a{font:inherit;color:#333;text-decoration:underline}.ot-whatsapp-box .ot-contact-item{width:100%;border-bottom:1px solid #ccc;display:-webkit-flex;display:flex;padding:0;cursor:pointer}.ot-whatsapp-box .ot-contact-item:last-child{border-bottom:0}.ot-contact-item .ot-cont-img{width:45px;height:45px;flex:0 0 auto;position:relative}.ot-contact-item .ot-cont-img .ot-exp-avatar{width:100%;height:100%;display:block;border-radius:100%;overflow:hidden;object-fit:cover}.ot-contact-item .ot-cont-img .ot-wsp-icon{position:absolute;bottom:0;left:0;width:16px}.ot-contact-item .ot-cont-info{width:100%;padding-left:15px;margin:auto 0;text-align:left}.ot-contact-item .ot-cont-info h6{font-size:16px;font-weight:400;line-height:1.2;color:#000;margin:0 0 5px;text-transform:none;letter-spacing:normal}.ot-contact-item .ot-cont-info p{font-size:13px;font-weight:400;line-height:1.2;color:#666;margin:0}.ot-close-i-ic{width:100%;height:100%;display:block;position:relative;transform:rotate(45deg)}.ot-close-i-ic:before,.ot-close-i-ic:after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;width:100%;height:2px;background:#333}.ot-close-i-ic:after{width:2px;height:100%}.ot-wsp-chat-btn{position:fixed;bottom:20px;padding:10px 12px;background:#fff;color:#333;border:1px solid #ccc;box-shadow:0 1px 6px rgba(27,27,27,0.2);border-radius:7px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;z-index:999999999;cursor:pointer}.ot-wsp-chat-btn img{width:24px;vertical-align:middle}.ot-wsp-chat-btn .ot-wsp-chat-text{font-size:13px;color:inherit;display:inline-block;vertical-align:middle;margin-left:5px;margin-top:-1px}.ot-wsp-chat-btn.chat-btn-radius{border-radius:60px}.ot-wsp-chat-btn.chat-btn-on-img{padding:6px}.ot-wsp-chat-btn.chat-btn-on-img img{width:38px}.ot-wsp-nft-text:not(.showed){bottom:-100%;opacity:0;visibility:hidden}.ot-wsp-nft-text{position:fixed;bottom:80px;right:20px;width:260px;background:#fff;border-radius:6px;border:1px solid #ccc;padding:13px 30px 13px 15px;box-shadow:0 1px 6px rgba(27,27,27,0.2);transition:all .7s ease;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;z-index:9999999997}.ot-wsp-nft-text p{font-size:14px;line-height:20px;color:#333;margin:0}.ot-wsp-nft-close{position:absolute;top:0;right:0;width:30px;height:30px;padding:7px}#ot-whatsapp-2 .ot-chatbox-header:after{content:'';position:absolute;bottom:-23px;left:15px;right:15px;height:50px;border-radius:25px;background:rgba(255,255,255,0.6)}#ot-whatsapp-2 .ot-chatbox-list-wrap{border-radius:25px 25px 0 0;background:#fff;margin-top:-20px;padding:10px 0;position:relative}#ot-whatsapp-chat{background:#f3f5f5;transition:opacity .4s ease 0s,margin .4s ease 0s,visibility .4s ease 0}#ot-whatsapp-chat.ot-gradient-box{background:#075e54;background-image:linear-gradient(160deg,#075e54 0%,#25d366 100%)}#ot-whatsapp-chat.ot-gradient-box .ot-chatbox-header{background:none}.spWhatsShare-container{text-align:left;z-index:99999;//transform:translate3d(0px,0px,0px)}.ot-whatsapp-box.right,.ot-whatsapp-box.bottom{right:90px}.ot-whatsapp-box.left{left:90px}.ot-whatsapp-box .ot-chatbox-header h2:before{content:'';width:15px;height:1em;float:right}@media only screen and (min-width: 768px){.ot-whatsapp-box.chatbox-opened .ot-chatbox-list-wrap{height:320px;transition-delay:.2s}.ot-whatsapp-box .ot-chatbox-list{max-height:320px;overflow:hidden;overflow-y:auto}#ot-whatsapp-2.chatbox-opened .ot-chatbox-list-wrap{height:340px}#ot-whatsapp-2 .ot-cbox-footer{transform:translateY(-10px);transition:transform .4s ease}#ot-whatsapp-2.chatbox-opened .ot-cbox-footer{transform:translateY(0);transition-delay:.4s}#ot-whatsapp-chat .ot-chatbox-list-wrap{height:40px}#ot-whatsapp-chat.chatbox-opened .ot-chatbox-list-wrap{height:340px}#ot-whatsapp-chat .ot-chatbox-list{opacity:0;transition:opacity .4s ease}#ot-whatsapp-chat.chatbox-opened .ot-chatbox-list{opacity:1;transition-delay:.6s}#ot-whatsapp-chat .ot-cbox-footer{transform:translateY(-32px);transition:transform .4s ease}#ot-whatsapp-chat.chatbox-opened .ot-cbox-footer{transform:translateY(0);transition-delay:.4s}}@media only screen and (max-width: 767px){.ot-whatsapp-box{width:100%;height:100%!important;left:0!important;right:0!important;bottom:0!important;border-radius:0}.ot-whatsapp-box .ot-chatbox-header{border-radius:0;padding:25px 25px 45px;transform:translateY(60px);opacity:0;transition:transform .6s ease,opacity .6s ease}.ot-whatsapp-box .ot-chatbox-header img{bottom:-20px}.ot-whatsapp-box .ot-chatbox-list-wrap{height:75vh;overflow:hidden;transform:translateY(60px);opacity:0;transition:transform .6s ease,opacity .6s ease}.ot-whatsapp-box .ot-cbox-footer{opacity:0;transition:opacity .6s ease}.ot-whatsapp-box.chatbox-opened .ot-chatbox-header{transform:translateY(0);opacity:1;transition-delay:.4s}.ot-whatsapp-box.chatbox-opened .ot-chatbox-list-wrap{transform:translateY(0);opacity:1;transition-delay:.9s}.ot-whatsapp-box.chatbox-opened .ot-cbox-footer{opacity:1;transition-delay:1.5s}#ot-whatsapp-2 .ot-chatbox-header:after,#ot-whatsapp-chat .ot-chatbox-header:after{transform:translateY(20px);opacity:0;transition:transform .6s ease,opacity .6s ease}#ot-whatsapp-2.chatbox-opened .ot-chatbox-header:after,#ot-whatsapp-chat.chatbox-opened .ot-chatbox-header:after{transform:translateY(0);opacity:1;transition-delay:1.5s}#ot-whatsapp-2.chatbox-opened .ot-cbox-footer,#ot-whatsapp-chat.chatbox-opened .ot-cbox-footer{transition-delay:1.8s}.ot-whatsapp-box .ot-chatbox-header h2:before{width:10px}}.ot-wspchat-sticky-bar a{color:#fff;text-decoration:none}.ot-whatsapp-watermark{display:block!important;position:absolute;bottom:5px;left:0;width:100%;min-width:100%;height:auto;max-height:initial;overflow:inherit;font-size:11px;font-weight:400;line-height:15px;border-radius:0 0 25px 25px;padding:5px 10px;color:#333;text-align:center;z-index:2!important;cursor:pointer}.ot-whatsapp-watermark:hover{color:#333}.ot-whatsapp-watermark.temp-4{color:#eee!important}.ot-chatbox-header.temp-4{background:transparent}.ot-chatbox-list-wrap.temp-1,.ot-chatbox-list-wrap.temp-2{border-radius:25px 25px 0 0;background:red;margin-top:-20px;margin-bottom:10px}.ot-chatbox-header.temp-1,.ot-chatbox-header.temp-2,.ot-chatbox-header.temp-3,.ot-chatbox-header.temp-4{height:120px}.ot-chatbox-header.temp-2::after{content:'';position:absolute;bottom:-23px;left:15px;right:15px;height:50px;border-radius:25px;background:red}.ot-chatbox-header.temp-4::after{content:'';position:absolute;bottom:-23px;left:30px;right:30px;height:50px;border-radius:25px;background:red}.ot-whatsapp-box.temp-3,.ot-whatsapp-box.temp-4{background:#f30000;height:456px}.ot-chatbox-list-wrap.temp-3,.ot-chatbox-list-wrap.temp-4{width:calc(100% - 30px);margin-left:15px;margin-right:15px;border-radius:25px;background:red;margin-top:-20px;padding:10px 0;position:relative}.ot-chatbox-list-wrap.temp-4{box-shadow:0 5px 0 rgba(0,0,0,0.1)}.ot-chatbox-message{position:relative;max-height:382px;padding:20px 20px 20px 15px;overflow:auto;height:100%;box-sizing:border-box!important;outline:none!important;-webkit-font-smoothing:antialiased}.ot-chatbox-message::before{display:block;position:absolute;content:'';left:0;bottom:0;height:100%;width:100%;z-index:0;opacity:.05;background-image:url(https://apps.omegatheme.com/cta-buttons/avatar/pattern.webp)}.ot-chatbox-message-layout{z-index:1;border:2px solid #0000001a;display:flex;flex-direction:column;width:100%;background-color:#fff;transform:translate3d(0px,0px,0px);opacity:1;pointer-events:all;visibility:visible;touch-action:auto;bottom:0;right:0;left:auto;margin-right:20px;border-radius:5px 10px 10px 10px;overflow:hidden;transition:opacity .4s ease 0s,margin .4s ease 0s,visibility .4s ease 0;padding:10px 15px;color:#333}.ot-cont-img::before{content:'';bottom:0;right:0;width:12px;height:12px;box-sizing:border-box;background-color:#4ad504;display:block;position:absolute;z-index:1;border-radius:50%;border-width:2px;border-style:solid;border-color:#fff;border-image:initial}.ot-cont-info-layout{display:flex;width:100%;padding:8px;border-radius:8px}.ot-cont-info-layout:hover{background:#f70000}.position_right.large .whatsapp-bubble{right:65px}.position_right.medium .whatsapp-bubble{right:60px}.position_right.small .whatsapp-bubble{right:55px}.position_left.large .whatsapp-bubble{left:65px}.position_left.medium .whatsapp-bubble{left:60px}.position_left.small .whatsapp-bubble{left:55px}.position_bottom .whatsapp-bubble,.horizontal .whatsapp-bubble{display:none}.whatsapp-bubble{display:inline-block;position:absolute;width:200px;height:auto;background-color:red;top:2px;padding:10px;border-radius:5px;box-shadow:2px 2px 17px 8px rgba(0,0,0,0.08),0 2px 10px 0 rgba(0,0,0,.10)}.whatsapp-bubble:after{content:' ';position:absolute;width:0;height:0;bottom:auto;border:12px solid;border-color:red #000 #000 red;transform:rotate(135deg);z-index:0;top:8px}.position_left .whatsapp-bubble:after{transform:rotate(-45deg);right:auto;left:-9px;transform:rotate(-45deg)}.position_right .whatsapp-bubble:after{transform:rotate(135deg);right:-5px;left:auto}@media only screen and (min-width: 768px){#ot-whatsapp-chat.chatbox-opened .ot-chatbox-list-wrap.temp-4,#ot-whatsapp-chat.chatbox-opened .ot-chatbox-list-wrap.temp-3{height:325px}}@media screen and (max-width: 768px){.spWhatsShare-container{width:100%;top:0;bottom:0!important;right:0!important;overflow:hidden;height:100%}}
            </style>
            <div group-id="5730" data-scroll="0" style="bottom: 187.32px" class="cta_group_preview  display_everywhere vertical position_right medium style5">
                <a target="_blank" btn-id="19667" data-ga="disable" data-fa="disable" data-type="whatsapp"
                href="https://api.whatsapp.com/send?phone=+84965607495&amp;text=I need support for Estimated Shipping app. My store is <?php echo $shop ?>" title="+84965607495" class="ot-btn-item  only_icon whatsapp" style="background-color: rgba(255, 255, 255, 1);  position: relative;display: block; ">
                <div class="ot-btn-item-child">
                    <div class="ot-btn-icon" style="color: #48c857; fill: #48c857"><svg width="48px" height="48px" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="whatsapp" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-whatsapp fa-w-14 fa-9x"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" class=""></path></svg></div>
                </div>
                </a>
            </div>
        </div>


        <?php
$customer = $shopify('GET', '/admin/shop.json');
$email = $customer['email'];

?> 
<div style="display:none;"><?php echo $email;  ?></div>
<script type="text/javascript"> 
 
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="a4bdf13a-e64f-4660-9d3a-b282560b6427";
            (function(){
                d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
                window.$crisp.push(["set", "user:email", [<?php echo $email ?>]]);
                window.$crisp.push(["set", "session:data", [[['is_connected', 'true']]]])
            })();</script>
     </body>
</html>