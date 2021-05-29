<?php
require "./_mixins.php";
if (isset($_GET["action"]) && isset($_GET["shop"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    $shopify = shopifyInit($shop);
    if ($action == 'getCollectionsByProductId') {
        // 156391407704
        $result = [];
        if (isset($_GET['productId'])) {
            $productId = $_GET['productId'];
            $collects = $shopify("GET", APIVERSION."custom_collections.json?product_id=" . $productId . "&limit=250");  
            if (is_array($collects) && count($collects) > 0) {
                foreach ($collects as $key => $collect) {
                    array_push($result, $collect["id"]);
                }
            }
            $collects = $shopify("GET", APIVERSION."smart_collections.json?product_id=" . $productId . "&limit=250");
            if (is_array($collects) && count($collects) > 0) {
                foreach ($collects as $key => $collect) {
                    array_push($result, $collect["id"]);
                }
            }
        }
        if($shop == "luggage-n-leather.myshopify.com"){
            foreach($result as $k=>&$v){
                if($v == "156391407704" && $k != 0){
                    $temp = $result[0];
                    $result[0] = "156391407704";
                    $result[$k] = $temp;
                }
            }
        }
        echo json_encode($result);
        exit();
    }
    if ($action == 'getProductById') {
        $product = [];
        if (isset($_GET['productId'])) {
            $productId = $_GET['productId'];
            $product = $shopify("GET", APIVERSION."products/$productId.json");
        }
        echo json_encode([
            "product" => $product,
        ]);
    }
} 