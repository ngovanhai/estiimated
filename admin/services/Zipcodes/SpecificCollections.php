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
            SELECT * FROM $table_zipcode_specific_collections
            WHERE shop = '$shop'
                AND collection_id IN ( SELECT * FROM (
                    SELECT collection_id FROM $table_zipcode_specific_collections
                    WHERE shop = '$shop'
                    GROUP BY collection_id
                    ORDER BY collection_id LIMIT $start, $limit
                ) as t)
            ORDER BY collection_id
        ");
        $count = fetchDbObject("SELECT COUNT(collection_id) as total FROM (
            SELECT collection_id FROM $table_zipcode_specific_collections
            WHERE shop = '$shop'
            GROUP BY collection_id
        ) as t");
        echo json_encode([
            "success" => true,
            "zipcodeSpecificCollections" => $zipcodes,
            "count" => $count["total"]
        ]);
    }
    if ($action == "delete") {
        $id = $_GET["id"];
        $query = $db->query("DELETE FROM $table_zipcode_specific_collections WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => true,
            "query" => $query
        ]);
    }
    if ($action == "count") {
        $query = fetchDbObject("SELECT COUNT(collection_id) as total FROM (
            SELECT collection_id FROM $table_zipcode_specific_collections
            WHERE shop = '$shop'
            GROUP BY collection_id
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
        $listCollections = $_POST["listCollections"];
        $response = [
            "newZipcodeSpecificCollections" => [], // All new zipcode will be pushed into this array
            "updatedZipcodeSpecificCollections" => [] // And updated zipcode will be here
        ];
        $response = updateZipcodeSpecificCollections($listCollections, $listZipcodes, $rule, $response);
        echo json_encode([
            "success" => true,
            "rules" => $response
        ]);
    }
}

function updateZipcodeSpecificCollections ($listCollections, $listZipcodes, $rule, $response) {
    global $shop;
    global $table_zipcode_specific_collections;
    $collection = array_shift($listCollections);
    $collectionId = $collection["id"];
    foreach ($listZipcodes as $key => $zipcode) {
        $zipcodeId = $zipcode["id"];
        $existedZipcode = fetchDbObject("SELECT * FROM $table_zipcode_specific_collections WHERE shop = '$shop' AND zipcode_id = '$zipcodeId' AND collection_id = '$collectionId'");
        if ($existedZipcode) {
            $existedZipcode["estimated_days"] = $rule["estimated_days"];
            $existedZipcode["minimum_days"] = $rule["minimum_days"];
            $existedZipcode["custom_text"] = $rule["custom_text"];
            $query = dbUpdate($table_zipcode_specific_collections, $existedZipcode, "shop = '$shop' AND zipcode_id = '$zipcodeId' AND collection_id = '$collectionId'");
            $response["updatedZipcodeSpecificCollections"] = array_merge($response["updatedZipcodeSpecificCollections"], $existedZipcode);
        } else {
            $newZipcode = $rule;
            if (isset($newZipcode["id"])) {
                unset($newZipcode["id"]);
            }
            $newZipcode["shop"] = $shop;
            $newZipcode["zipcode_id"] = $zipcodeId;
            $newZipcode["collection_id"] = $collectionId;
            $id = dbInsert($table_zipcode_specific_collections, $newZipcode);
            $newZipcode["id"] = $id;
            $response["newZipcodeSpecificCollections"] = array_merge($response["newZipcodeSpecificCollections"], $newZipcode);
        }
    }
    if (count($listCollections) > 0) {
        return updateZipcodeSpecificCollections($listCollections, $listZipcodes, $rule, $response);
    } else {
        return $response;
    }
}
