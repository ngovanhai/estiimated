<?php
require("../_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "get") {
        $page = $_GET["page"];
        $limit = $_GET["limit"];
        $start = ($page-1) * $limit;
        $where = "";
        if(isset($_GET['searchProduct']) && $_GET['searchProduct'] != ""){
            $searchProductTitle = $_GET['searchProduct'];
            $where .= "AND ( product_title like '%$searchProductTitle%' OR product_sku like '%$searchProductTitle%' )";
        }  
        if(isset($_GET['filterCountry']) && $_GET['filterCountry'] != ""){
            $filterCountry = $_GET['filterCountry'];
            $where .= " AND country_id =  '$filterCountry' ";
        }    
        if($where != ""){
            $limit = "";
        }else{
            $limit = "LIMIT $start, $limit";
        }
        $rules = fetchDbArray("
            SELECT * FROM $table_country_specific_products
            WHERE shop = '$shop' $where
                AND product_id IN ( SELECT * FROM (
                    SELECT product_id FROM $table_country_specific_products
                    WHERE shop = '$shop'
                    GROUP BY product_id
                    ORDER BY product_id $limit
                ) as t)
            ORDER BY product_id
        ");


        $total = fetchDbObject("SELECT COUNT(product_id) as total FROM (
            SELECT product_id FROM $table_country_specific_products
            WHERE shop = '$shop' $where     
            GROUP BY product_id
        ) as t");
        echo json_encode([
            "success" => true,
            "rules" => $rules,
            "count" => $total["total"]
        ]);
    }
    if ($action == "delete") {
        $id = $_GET["id"];
        $query = $db->query("DELETE FROM $table_country_specific_products WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => $query
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "create") {
        $rule                   = $_POST['rule'];
        $productId              = $rule["product_id"];
        $getSku = explode(" | sku: ",$rule["product_title"]);
        $rule["product_title"] = isset($getSku['0'])?$getSku['0']:"";
        if(count($getSku) == 2){
            $rule["product_sku"] = $getSku['1'];
        } 
        $countryId              = $rule["country_id"];
        $exsitedRule            = fetchDbObject("SELECT * FROM $table_country_specific_products WHERE shop = '$shop' AND product_id = '$productId' AND country_id = '$countryId'");
        if ($exsitedRule) {
            $rule['id']         = $exsitedRule['id'];
            $query              = dbUpdate($table_country_specific_products, $rule, "shop = '$shop' AND product_id = '$productId' AND country_id = '$countryId'");
            echo json_encode([
                "success" => true,
                "is_duplicated" => true,
                "rule" => $rule
            ]);
        } else {
            $rule["shop"] = $shop;
            $id = dbInsert($table_country_specific_products, $rule);
            $rule["id"] = $id;
            echo json_encode([
                "success" => true,
                "is_duplicated" => false,
                "rule" => $rule
            ]);
        }
        exit();
    }
    if ($action == "update") {
        $rule       = $_POST["rule"];
        $productId  = $rule["product_id"];
        $countryId  = $rule["country_id"];
        $getSku = explode(" | sku: ",$rule["product_title"]);
        $rule["product_title"] = isset($getSku['0'])?$getSku['0']:"";
        if(count($getSku) == 2){
            $rule["product_sku"] = $getSku['1'];
        }   
        $query      = dbUpdate($table_country_specific_products, [
            "product_id" => $rule["product_id"],
            "product_title" => $rule["product_title"],
            "product_sku" => $rule["product_sku"],
            "country_id" => $rule["country_id"],
            "minimum_days" => $rule["minimum_days"],
            "estimated_days" => $rule["estimated_days"],
            "custom_text" => $rule["custom_text"],
        ], "shop = '$shop' AND product_id = '$productId' AND country_id = '$countryId'");
        echo json_encode([
            "success" => true
        ]);
        exit();
    }
}

