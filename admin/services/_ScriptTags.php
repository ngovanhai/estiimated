<?php
require("./_mixins.php");
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    
    if ($action == "getScriptTags") {
        $shop = $_GET["shop"];
        $shopify = shopifyInit($db, $shop, $appId);
        $scriptTags = $shopify("GET", APIVERSION."script_tags.json");
        $perPage = isset($_GET["limit"]) ? $_GET["limit"] : 50;
        $page = $_GET["page"];
        $start = ($page - 1) * $perPage;
        $shops = fetchDbArray("SELECT shop FROM $table_general_settings LIMIT $start, $perPage");
        foreach ($shops as $key => $shop) {
            $shop = $shop["shop"];
            $shopify = shopifyInit($db, $shop, $appId);
            $scriptTags = $shopify("GET", APIVERSION."script_tags.json?src=$rootLink/estimated-shipping.js");
            if (count($scriptTags) == 1) {
                $script = $scriptTags[0];
                $scriptId = $script["id"];
                $sql = $db->query("
                    UPDATE `$table_general_settings`
                    SET script_tag_id = $scriptId
                    WHERE shop = '$shop'
                ");
                $result = fetchDbObject("SELECT shop, script_tag_id FROM $table_general_settings WHERE shop = '$shop'");
                echo "<pre>";
                echo "Updated: " . $shop . " with script tag id: " . $result["script_tag_id"] ; 
                echo "\n------------------------------------------------------------------------";
                echo "</pre>";
            }
        }
    }
    if ($action == "countTotalShops") {
        $query = fetchDbObject("SELECT COUNT(shop) as total FROM $table_general_settings");
        $totalShops = $query["total"];
        $totalPages = ceil($totalShops/50);
        echo "<pre>";
        echo "Total shops : " . $totalShops;
        echo "</pre>";
        echo "<pre>";
        echo "Total Pages with 50 shop/page : " . $totalPages;
        echo "</pre>";
    }
    if ($action == "removeRedundantShops") {
        $query = fetchDbArray("SELECT shop FROM $table_general_settings");
        $currentShops = '';
        foreach ($query as $key => $shop) {
            $shop = $shop["shop"];
            $currentShops .= "'" . $shop . "'";
            if ($key < count($query) - 1) {
                $currentShops .= ', ';
            }
        }
        // Estimated
        // table_estimated_date_settings
        // $table_estimated_date_specific_collections
        // $table_estimated_date_specific_products

        $estimatedSettings = $db->query("DELETE FROM $table_estimated_date_settings WHERE shop NOT IN ($currentShops)");
        $estimatedSpecificCollections = $db->query("DELETE FROM $table_estimated_date_specific_collections WHERE shop NOT IN ($currentShops)");
        $estimatedSpecificProducts = $db->query("DELETE FROM $table_estimated_date_specific_products WHERE shop NOT IN ($currentShops)");

        // $table_zipcode_settings
        // $table_zipcode_list
        // $table_zipcode_specific_products
        // $table_zipcode_specific_collections
        // $table_zipcode_specific_vendors

        $zipcodeSettings = $db->query("DELETE FROM $table_zipcode_settings WHERE shop NOT IN ($currentShops)");
        $zipcodeList = $db->query("DELETE FROM $table_zipcode_list WHERE shop NOT IN ($currentShops)");
        $zipcodeSpecificCollections = $db->query("DELETE FROM $table_zipcode_specific_collections WHERE shop NOT IN ($currentShops)");
        $zipcodeSpecificProducts = $db->query("DELETE FROM $table_zipcode_specific_products WHERE shop NOT IN ($currentShops)");
        $zipcodeSpecificVendors = $db->query("DELETE FROM $table_zipcode_specific_vendors WHERE shop NOT IN ($currentShops)");

        // $table_country_list
        // $table_country_specific_products

        $countryList = $db->query("DELETE FROM $table_country_list WHERE shop NOT IN ($currentShops)");
        $countrySpecificProducts = $db->query("DELETE FROM $table_country_specific_products WHERE shop NOT IN ($currentShops)");
        
        echo "Done";
    }
} 
 