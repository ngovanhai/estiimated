<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
date_default_timezone_set('UTC');
require 'vendor/autoload.php';
use sandeepshetty\shopify_api;
require 'conn-shopify.php';
$select_settings = $db->query("SELECT * FROM tbl_appsettings WHERE id = $appId");
$app_settings = $select_settings->fetch_object();

if (!empty($_GET['shop']) && !empty($_GET['code'])) {
    $shop = $_GET['shop']; //shop name
    //get permanent access token
    $access_token = shopify_api\oauth_access_token(
        $_GET['shop'], $app_settings->api_key, $app_settings->shared_secret, $_GET['code']
    );
    $installed = checkInstalled($db, $shop, $appId);
    if($installed["installed"]){
        $date_installed = $installed["installed_date"];
        $db->query("
            INSERT INTO tbl_usersettings 
            SET access_token = '$access_token',
            store_name = '$shop', app_id = $appId, installed_date = '$date_installed', confirmation_url = ''
        ");
        $date1 = new DateTime($installed["installed_date"]);
        $date2 = new DateTime("now");
        $interval = date_diff($date1, $date2);
        $diff = (int)$interval->format('%R%a');
        $trialTime = $trialTime - $diff;
        if($trialTime < 0) {
            $trialTime = 0;
        }
    } else {
        $db->query("
            INSERT INTO tbl_usersettings 
            SET access_token = '$access_token',
            store_name = '$shop', app_id = $appId, installed_date = NOW(), confirmation_url = ''
        ");
        $db->query("
            INSERT INTO shop_installed
            SET shop = '$shop', app_id = $appId, date_installed = NOW()
        ");
    }

    // Init shopify object
    $shopify = shopify_api\client(
        $shop, $access_token, $app_settings->api_key, $app_settings->shared_secret
    );

    // insert general setting
    $generalSettings = fetchDbObject("SELECT * FROM $table_general_settings WHERE shop = '$shop'");
    if (count($generalSettings) < 1) {
        $db->query("INSERT INTO $table_general_settings(shop) values('$shop')");
    }

    // insert estimated settings
    $estimatedDateSettings = fetchDbObject("SELECT * FROM $table_estimated_date_settings WHERE shop = '$shop'");
    if (count($estimatedDateSettings) < 1) {
        $db->query("INSERT INTO $table_estimated_date_settings(shop) values('$shop')");
    }

    // insert default estimated shipping method
    $shippingMethod = fetchDbObject("SELECT * FROM $table_estimated_shipping_methods WHERE shop = '$shop'");
    if (count($estimatedDateSettings) < 1) {
        $db->query("INSERT INTO $table_estimated_shipping_methods(shop) values('$shop')");
    }
    
    // insert zipcode settings
    $zipcodeSettings = fetchDbObject("SELECT * FROM $table_zipcode_settings WHERE shop = '$shop'");
    if (count($zipcodeSettings) < 1) {
        $db->query("INSERT INTO $table_zipcode_settings(shop) values('$shop')");
    }

    // insert first country for layout Country Delivery purpose
    $restOfWorldCountrySettings = fetchDbObject("SELECT * FROM $table_country_list WHERE shop = '$shop' AND id = 'other_countries'");    
    if (count($restOfWorldCountrySettings) < 1) {
        $db->query("INSERT INTO $table_country_list SET id='other_countries',code='other_countries',provinces='[]',name='Other Countries',shop = '$shop'");
    }

    //charge fee
    $charge = array(
        "recurring_application_charge" => array(
            "name" => $chargeTitle,
            "price" => $price,
            "return_url" => "$rootLink/charge.php?shop=$shop",
            "test" => $testMode,
            "trial_days" => $trialTime
        )
    );

    if ($chargeType == "one-time") {
        $recu = $shopify("POST", APIVERSION."application_charges.json", $charge);
        $confirmation_url = $recu["confirmation_url"];
    } else {
        $recu = $shopify("POST", APIVERSION."recurring_application_charges.json", $charge);
        $confirmation_url = $recu["confirmation_url"];
    }
    $db->query("update tbl_usersettings set confirmation_url = '$confirmation_url' where store_name = '$shop' and app_id = $appId");

    // Gui email cho customer khi cai dat
    require 'email/install_email.php';
    
    // add js to shop
    $isScriptTagExist = false;
    $scriptTags = $shopify('GET', APIVERSION.'script_tags.json?src='. $rootLink .'/estimated-shipping.js');
    $scriptTagId = 0;
    if ($scriptTags && count($scriptTags) == 1) {
        $isScriptTagExist = true;
        $scriptTagId= $scriptTags[0]["id"];
    }
    if (!$isScriptTagExist) {
        $newScriptTag = $shopify('POST', APIVERSION.'script_tags.json', array('script_tag' => array('event' => 'onload', 'src' => $rootLink . '/estimated-shipping.js')));
        $scriptTagId= $newScriptTag["id"];
    }
    $db->query("UPDATE $table_general_settings SET script_tag_id = '$scriptTagId' WHERE shop = '$shop'");

    // Update script tag with new json file and version
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 0,
        CURLOPT_URL => $rootLink . '/admin/services/_generateJson.php?action=generate&shop=' . $shop,
        CURLOPT_USERAGENT => 'Generate Json file and update script tag',
        CURLOPT_SSL_VERIFYPEER => false
    ));
    $resp = curl_exec($curl);

    //hook when user remove app
    $webhook = $shopify('POST', APIVERSION.'webhooks.json', array('webhook' =>
        array(
            'topic' => 'app/uninstalled',
            'address' => $rootLink . '/uninstall.php',
            'format' => 'json')
        )
    );
    //hook on store plan update
    $updateStorePlanUrl = $rootLink."/storePlan.php?action=getStorePlan&shop=".$shop;
    $dataUpdateStorePlan = [
        "webhook" => [
            "topic" => "shop/update",
            "address" =>  $updateStorePlanUrl,
            "format" => "json",
        ]
    ];
    $shopify("POST",APIVERSION."webhooks.json",$dataUpdateStorePlan);

    if($chargeType == "free"){
        $db->query("update tbl_usersettings set status = 'active' where store_name = '$shop' and app_id = $appId");
        header('Location: https://'.$shop.'/admin/apps/'.$apiKey.'');
    } else {
        header('Location: ' . $confirmation_url);
    }
}

function checkInstalled($db, $shop, $appId) {
    $sql = "select * from shop_installed where shop = '$shop' and app_id = $appId";
    $query = $db->query($sql);
    if ($query->num_rows > 0) {
        while ($row = $query->fetch_assoc()) {
            $date_instaled = $row["date_installed"];
            $result = array(
                "installed_date" => $date_instaled,
                "installed" => true
            );
            return $result;
        }
    } else {
        $result = array(
            "installed" => false
        );
        return $result;
    }
}


function fetchDbObject ($sql) {
    global $db;
    global $shop;
    $query = $db->query($sql);
    $object = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $object = $row;
        }
    }
    return $object;
}

function getCountry($db, $shop, $countryId) {
    $sql = "SELECT * FROM estimated_countries WHERE shop = '$shop' AND id='$countryId'";
    $query = $db->query($sql);
    $countries = array();
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $countries = $row;
        }
    }
    return $countries;
}