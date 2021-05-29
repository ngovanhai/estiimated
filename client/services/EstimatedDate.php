<?php
require("./_mixins.php");

$shop = "";

if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    $shopify = shopifyInit($shop);
    if ($action == 'getCollectionsByProductId') {
        $productId = $_GET['productId'];
        $result = null;
        $customCollections = $shopify("GET", APIVERSION."custom_collections.json?product_id=" . $productId . "&fields=id");
        if (is_array($customCollections) && count($customCollections) > 0) {
            foreach ($customCollections as $key => $collection) {
                $collectionId = $collection["id"];
                $data = fetchDbObject("SELECT * FROM $table_estimated_date_specific_collections WHERE shop = '$shop' and collection_id='$collectionId'");
                if ($data) {
                    $result = $data;
                    break;
                }
            }
        }
        if (!isset($result)) {
            $smartCollections = $shopify("GET", APIVERSION."smart_collections.json?product_id=" . $productId . "&fields=id");
            if (is_array($smartCollections) && count($smartCollections) > 0) {
                foreach ($smartCollections as $key => $collection) {
                    $collectionId = $collection["id"];
                    $data = fetchDbObject("SELECT * FROM $table_estimated_date_specific_collections WHERE shop = '$shop' and collection_id='$collectionId'");
                    if ($data) {
                        $result = $data;
                        break;
                    }
                }
            }
            
        }
        echo json_encode($result);
    }
    if ($action == 'getProductVendor') {
        $productId = $_GET['productId'];
        
    }
    if($action == "getEstProductByCountry"){ 
        $productID = $_GET['productID'];
        $countryCode = $_GET['countryCode'];
        $result = fetchDbArray("
            SELECT * 
            FROM `estimated_country_specific_products` as product 
            LEFT JOIN estimated_country_list as country ON product.country_id = country.id 
            WHERE product.shop = '$shop' AND product.product_id = $productID AND code= '$countryCode'
        ");
        if(!is_array($result)) $result = [] ;
        echo json_encode($result); 
        exit();
    }
}