<?php
require("./_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "getSettings") {
        $settings = fetchDbObject("SELECT * FROM $table_general_settings WHERE shop = '$shop'");
        echo json_encode([
            "success" => true,
            "settings" => $settings,
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "saveSettings") {
        $settings = $_POST["settings"];
        $listCountryRules = fetchDbArray("SELECT * FROM $table_country_list WHERE shop = '$shop'");
        if ($settings["layout"] == 3 && (!$listCountryRules || count($listCountryRules) == 0)) {
            $settings = fetchDbObject("SELECT * FROM $table_general_settings WHERE shop = '$shop'");
            $response = [
                "success" => false,
                "error" => "You must set up at least one Country Rule in Tab Countries",
                "settings" => $settings
            ];
            echo json_encode($response);
        } else {
            $settings["specific_day_off"] = isset($settings["specific_day_off"]) ? json_encode($settings["specific_day_off"]) : json_encode(array());
            $settings["week_working_days"] = isset($settings["week_working_days"]) ? json_encode($settings["week_working_days"]) : json_encode(array());
            $settings["show_on_pages"] = is_array($settings["show_on_pages"]) ? implode(",", $settings["show_on_pages"]) : $settings["show_on_pages"];
            $settings["date_timezone_offset"] = isset($settings["date_timezone_offset"]) ? $settings["date_timezone_offset"] : NULL;
            $affectedRows = dbUpdate($table_general_settings, $settings, "shop = '$shop'");
            $settings = fetchDbObject("SELECT * FROM $table_general_settings WHERE shop = '$shop'");
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
}
