<?php
require("./_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "getSettings") {
        $settings = fetchDbObject("SELECT * FROM $table_estimated_date_settings WHERE shop = '$shop'");
        echo json_encode([
            "success" => true,
            "settings" => $settings
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "saveSettings") {
        $settings = $_POST["settings"];
        $affectedRows = dbUpdate($table_estimated_date_settings, $settings, "shop = '$shop'");
        $settings = fetchDbObject("SELECT * FROM $table_estimated_date_settings WHERE shop = '$shop'");
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

