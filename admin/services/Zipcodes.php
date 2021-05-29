<?php
require("./_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "getSettings") {
        $settings = fetchDbObject("SELECT * FROM $table_zipcode_settings WHERE shop = '$shop'");
        echo json_encode([
            "success" => true,
            "settings" => $settings
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "updateSettings") {
        $settings = $_POST["settings"];
        $settings["for_all_product"] = isset($settings["for_all_product"]) ? $settings["for_all_product"] : 1;
        $affectedRows = dbUpdate($table_zipcode_settings, $settings, "shop = '$shop'");
        $settings = fetchDbObject("SELECT * FROM $table_zipcode_settings WHERE shop = '$shop'");
        $response = [
            "success" => $affectedRows > 0,
            "settings" => $settings
        ];
        if ($affectedRows === 0) {
            $response["error"] = "Nothing change";
        }
        echo json_encode($response);
    }
}
