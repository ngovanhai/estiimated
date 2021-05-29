<?php
require "./_mixins.php";
header('Access-Control-Allow-Origin: *'); 
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    $shopify = shopifyInit($db, $shop, $appId);
    if ($action == "getDefaultCountries") {
        $countries = $shopify('GET', APIVERSION.'countries.json');
        echo json_encode([
            "success" => true,
            "countries" => $countries,
        ]);
    }
    if ($action == "countProducts") {
        $count = $shopify("GET", APIVERSION."products/count.json");
        echo json_encode($count);
    }
    if ($action == "getProducts") {
        $since_id = $_GET["since_id"];
        $limit = $_GET["limit"];
        $products = $shopify("GET", APIVERSION."products.json?limit=" . $limit . "&since_id=" . $since_id . "&fields=id,title,handle,variants");
        if(!is_array($products)) $products = [];
        foreach($products as &$v){ 
            $v['sku'] = isset($v['variants'][0]['sku'])?" | sku: ".$v['variants'][0]['sku']:"";
            $v['variants'] = [];
            $v['title'] = $v['title'].$v['sku']; 
        }
        echo json_encode($products); 
    }
    if($action == "updateProductInformation"){  
        $products = fetchDbArray("SELECT * FROM `estimated_country_specific_products` WHERE shop = '$shop'");
        foreach($products as $product){ 
            $productID = $product['product_id'];
            $product = $shopify("GET", APIVERSION."products/$productID.json?fields=id,title,variants");
            $product['sku'] = isset($product['variants'][0]['sku'])?$product['variants'][0]['sku']:""; 
            $query      = dbUpdate($table_country_specific_products, [ 
                "product_title" => $product["title"],
                "product_sku" => $product["sku"], 
            ], "shop = '$shop' AND product_id = '$productID'");
            echo "done product: ".$product["title"];
        } 
    }
    if ($action == "countCollections") {
        $smartCollections = $shopify("GET", APIVERSION."smart_collections/count.json");
        $customCollections = $shopify("GET", APIVERSION."custom_collections/count.json");
        echo json_encode([
            "total_smart_collections" => $smartCollections,
            "total_custom_collections" => $customCollections,
        ]);
    }
    if ($action == "getCollections") { 
        $limit = $_GET["limit"];
        $page = $_GET["page"];
        $type = $_GET["type"];
        if(isset($_GET['collection_since_id'])){
            $since_id = $_GET['collection_since_id'];
        }else{
            $since_id = 0;
        }
        switch ($type) {
            case 'smart':
                $collections = $shopify("GET", APIVERSION."smart_collections.json?fields=id,title,handle&limit=$limit&since_id=" . $since_id . "");
                break;
            case 'custom':
                $collections = $shopify("GET", APIVERSION."custom_collections.json?fields=id,title,handle&limit=$limit&since_id=" . $since_id . "");
                break;
            default:
                break;
        }

        echo json_encode([
            "success" => true,
            "collections" => $collections,
        ]);
    }
    if ($action == "getVendors") {
        $response = [];
        $vendors = fetchDbArray("SELECT value from $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND type = 'vendor'");
        foreach ($vendors as $key => $vendor) {
            if (!in_array($vendor["value"], $response, true)) {
                array_push($response, $vendor["value"]);
            }
        }
        $vendors = fetchDbArray("SELECT name from $table_zipcode_specific_vendors WHERE shop = '$shop'");
        foreach ($vendors as $key => $vendor) {
            if (!in_array($vendor["name"], $response, true)) {
                array_push($response, $vendor["name"]);
            }
        }
        echo json_encode([
            "success" => true,
            "vendors" => $response,
        ]);
    }

    if ($action == "clearCachedData") {
        $files = glob(CACHE_PATH . $shop . '/*'); // get all file names
        foreach ($files as $file) { // iterate files
            if (is_file($file)) {
                unlink($file);
            }
            // delete file
        }
        echo json_encode([
            "files_count" => count($files),
            "success" => true,
        ]);
    }
}

if (isset($_POST["action"])) {
    $action = $_POST["action"];
    $shop = $_POST["shop"];
}
