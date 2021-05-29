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
        $zipcodes = fetchDbArray("
            SELECT * FROM $table_zipcode_specific_products
            WHERE shop = '$shop'
                AND product_id IN ( SELECT * FROM (
                    SELECT product_id FROM $table_zipcode_specific_products
                    WHERE shop = '$shop'
                    GROUP BY product_id
                    ORDER BY product_id LIMIT $start, $limit
                ) as t)
            ORDER BY product_id
        ");
        $count = fetchDbObject("SELECT COUNT(product_id) as total FROM (
            SELECT product_id FROM $table_zipcode_specific_products
            WHERE shop = '$shop'
            GROUP BY product_id
        ) as t");
        echo json_encode([
            "success" => true,
            "zipcodeSpecificProducts" => $zipcodes,
            "count" => $count["total"]
        ]);
    }
    if ($action == "delete") {
        $id = $_GET["id"];
        $query = $db->query("DELETE FROM $table_zipcode_specific_products WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => true,
            "query" => $query
        ]);
    }
    if ($action == "count") {
        $query = fetchDbObject("SELECT COUNT(product_id) as total FROM (
            SELECT product_id FROM $table_zipcode_specific_products
            WHERE shop = '$shop'
            GROUP BY product_id
        ) as t");
        echo json_encode([
            "success" => true,
            "count" => $query["total"]
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "update") {
        $rule         = $_POST["rule"];
        $listZipcodes = $_POST["listZipcodes"];
        $listProducts = $_POST["listProducts"];
        $response = [
            "newZipcodeSpecificProducts" => [], // All new zipcode will be pushed into this array
            "updatedZipcodeSpecificProducts" => [] // And updated zipcode will be here
        ];
        $response = updateZipcodeSpecificProducts($listProducts, $listZipcodes, $rule, $response);
        echo json_encode([
            "success" => true,
            "rules" => $response
        ]);
    }
}

function updateZipcodeSpecificProducts($listProducts, $listZipcodes, $rule, $response) {
    global $shop;
    global $table_zipcode_specific_products;
    $product = array_shift($listProducts);
    $productId = $product["id"];
    foreach ($listZipcodes as $key => $zipcode) {
        $zipcodeId = $zipcode["id"];
        $existedZipcode = fetchDbObject("SELECT * FROM $table_zipcode_specific_products WHERE shop = '$shop' AND zipcode_id = '$zipcodeId' AND product_id = '$productId'");
        if ($existedZipcode) {
            $existedZipcode["estimated_days"] = $rule["estimated_days"];
            $existedZipcode["minimum_days"] = $rule["minimum_days"];
            $existedZipcode["custom_text"] = $rule["custom_text"];
            $query = dbUpdate($table_zipcode_specific_products, $existedZipcode, "shop = '$shop' AND zipcode_id = '$zipcodeId' AND product_id = '$productId'");
            $response["updatedZipcodeSpecificProducts"] = array_merge($response["updatedZipcodeSpecificProducts"], $existedZipcode);
        } else {
            $newZipcode = $rule;
            if (isset($newZipcode["id"])) {
                unset($newZipcode["id"]);
            }
            $newZipcode["shop"] = $shop;
            $newZipcode["zipcode_id"] = $zipcodeId;
            $newZipcode["product_id"] = $productId;
            $id = dbInsert($table_zipcode_specific_products, $newZipcode);
            $newZipcode["id"] = $id;
            $response["newZipcodeSpecificProducts"] = array_merge($response["newZipcodeSpecificProducts"], $newZipcode);
        }
    }
    if (count($listProducts) > 0) {
        return updateZipcodeSpecificProducts($listProducts, $listZipcodes, $rule, $response);
    } else {
        return $response;
    }
}
