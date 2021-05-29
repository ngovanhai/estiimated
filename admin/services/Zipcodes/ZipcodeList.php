<?php
require("../_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "get") {
        $zipcodes = fetchDbArray("SELECT * FROM $table_zipcode_list WHERE shop = '$shop'");
        echo json_encode([
            "success" => true,
            "zipcodes" => $zipcodes
        ]);
    }
    if ($action == "delete") {
        $id = $_GET["id"];
        $query1 = $db->query("DELETE FROM $table_zipcode_list WHERE shop = '$shop' AND id = '$id'");
        $query2 = $db->query("DELETE FROM $table_zipcode_specific_products WHERE shop = '$shop' AND zipcode_id = '$id'");
        $query3 = $db->query("DELETE FROM $table_zipcode_specific_collections WHERE shop = '$shop' AND zipcode_id = '$id'");
        $query4 = $db->query("DELETE FROM $table_zipcode_specific_vendors WHERE shop = '$shop' AND zipcode_id = '$id'");
        echo json_encode([
            "success" => true,
            "query" => $query1 && $query2 && $query3 && $query4
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "update") {
        $zipcode = $_POST["zipcode"];
        $zipcodeId = $zipcode["id"];
        $query = dbUpdate($table_zipcode_list, $zipcode, "shop = '$shop' AND id='$zipcodeId'");
        echo json_encode([
            "success" => true
        ]);
    }
    if ($action == "create") {
        $zipcode         = $_POST["zipcode"];
        $zipcode["shop"] = $shop;
        $id = dbInsert($table_zipcode_list, $zipcode);
        echo json_encode([
            "success" => true,
            "id" => $id
        ]);
    }
}
