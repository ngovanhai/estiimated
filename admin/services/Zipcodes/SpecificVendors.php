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
            SELECT * FROM $table_zipcode_specific_vendors
            WHERE shop = '$shop'
                AND name IN ( SELECT * FROM (
                    SELECT name FROM $table_zipcode_specific_vendors
                    WHERE shop = '$shop'
                    GROUP BY name
                    ORDER BY name LIMIT $start, $limit
                ) as t)
            ORDER BY name
        ");
        $count = fetchDbObject("SELECT COUNT(name) as total FROM (
            SELECT name FROM $table_zipcode_specific_vendors
            WHERE shop = '$shop'
            GROUP BY name
        ) as t");
        echo json_encode([
            "success" => true,
            "zipcodeSpecificVendors" => $zipcodes,
            "count" => $count["total"]
        ]);
    }
    if ($action == "delete") {
        $id = $_GET["id"];
        $query = $db->query("DELETE FROM $table_zipcode_specific_vendors WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => true,
            "query" => $query
        ]);
    }
    if ($action == "count") {
        $count = fetchDbObject("SELECT COUNT(name) as total FROM (
            SELECT name FROM $table_zipcode_specific_vendors
            WHERE shop = '$shop'
            GROUP BY name
        ) as t");
        echo json_encode([
            "success" => true,
            "count" => $count["total"]
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "update") {
        $rule         = $_POST["rule"];
        $listZipcodes = $_POST["listZipcodes"];
        $listVendors = $_POST["listVendors"];
        $response = [
            "newZipcodeSpecificVendors" => [], // All new zipcodes will be pushed into this array
            "updatedZipcodeSpecificVendors" => [] // And updated zipcodes will be here
        ];
        $response = updateZipcodeSpecificVendors($listVendors, $listZipcodes, $rule, $response);
        echo json_encode([
            "success" => true,
            "rules" => $response
        ]);
    }
}

function updateZipcodeSpecificVendors ($listVendors, $listZipcodes, $rule, $response) {
    global $shop;
    global $table_zipcode_specific_vendors;
    $vendor = array_shift($listVendors);
    foreach ($listZipcodes as $key => $zipcode) {
        $zipcodeId = $zipcode["id"];
        $existedZipcode = fetchDbObject("SELECT * FROM $table_zipcode_specific_vendors WHERE shop = '$shop' AND zipcode_id = '$zipcodeId' AND name = '$vendor'");
        if ($existedZipcode) {
            $existedZipcode["estimated_days"] = $rule["estimated_days"];
            $existedZipcode["minimum_days"] = $rule["minimum_days"];
            $existedZipcode["custom_text"] = $rule["custom_text"];
            $query = dbUpdate($table_zipcode_specific_vendors, $existedZipcode, "shop = '$shop' AND zipcode_id = '$zipcodeId' AND name = '$vendor'");
            $response["updatedZipcodeSpecificVendors"] = array_merge($response["updatedZipcodeSpecificVendors"], $existedZipcode);
        } else {
            $newZipcode = $rule;
            if (isset($newZipcode["id"])) {
                unset($newZipcode["id"]);
            }
            $newZipcode["shop"] = $shop;
            $newZipcode["zipcode_id"] = $zipcodeId;
            $newZipcode["name"] = $vendor;
            $id = dbInsert($table_zipcode_specific_vendors, $newZipcode);
            $newZipcode["id"] = $id;
            $response["newZipcodeSpecificVendors"] = array_merge($response["newZipcodeSpecificVendors"], $newZipcode);
        }
    }
    if (count($listVendors) > 0) {
        return updateZipcodeSpecificVendors($listVendors, $listZipcodes, $rule, $response);
    } else {
        return $response;
    }
}
