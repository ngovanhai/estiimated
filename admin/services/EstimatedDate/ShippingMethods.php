<?php
require("../_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action === "get") {
        $methods = fetchDbArray("SELECT * FROM $table_estimated_shipping_methods WHERE shop = '$shop' ORDER BY position ASC");
        echo json_encode([
            "success" => true,
            "methods" => $methods
        ]);
    }
    if ($action === "delete") {
        $id = $_GET["id"];
        $deleteMethodStatus = $db->query("DELETE FROM $table_estimated_shipping_methods WHERE shop = '$shop' AND id = '$id'");
        $deleteRulesStatus = $db->query("DELETE FROM $table_estimated_date_specific_rules WHERE shop = '$shop' AND shipping_method_id = '$id'");
        $deleteTargetsStatus = $db->query("DELETE FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND shipping_method_id = '$id'");
        echo json_encode([
            "success" => $deleteMethodStatus && $deleteRulesStatus && $deleteTargetsStatus
        ]);
    }
    if ($action === "countRelatedRules") {
        $id = $_GET["id"];
        $query = fetchDbObject("SELECT COUNT(shipping_method_id) AS count FROM $table_estimated_date_specific_rules WHERE shop = '$shop' AND shipping_method_id = $id");
        echo json_encode([
            "success" => true,
            "count" => $query["count"]
        ]);
    }
}

if (isset($_POST["action"])) {
    $action = $_POST["action"];
    $shop = $_POST["shop"];
    if ($action == "create") {
        $method = $_POST["method"];
        $method["shop"] = $shop;
        $maxPosition = fetchDbObject("SELECT MAX(position) as max FROM $table_estimated_shipping_methods WHERE shop = '$shop'");
        $method["position"] = $maxPosition["max"] + 1;
        $method['estimated_text'] = str_replace('"',"'",$method['estimated_text']);
        $id = dbInsert($table_estimated_shipping_methods, $method);
        $newMethod = fetchDbObject("SELECT * FROM $table_estimated_shipping_methods WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => true,
            "method" => $newMethod
        ]);
    }
    if ($action == "update") {
        $method = $_POST["method"];
        $id = $method["id"]; 
        $method['estimated_text'] = str_replace('"',"'",$method['estimated_text']);
        $result = dbUpdate($table_estimated_shipping_methods, $method, "shop = '$shop' AND id = '$id'");
        $method = fetchDbObject("SELECT * FROM $table_estimated_shipping_methods WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => true,
            "method" => $method
        ]);
    }
    if ($action == "updatePosition") {
        $methods = $_POST["methods"];
        foreach ($methods as $position => $id) {
            $method = [
                "position" => $position + 1
            ];
            $result = dbUpdate($table_estimated_shipping_methods, $method, "shop = '$shop' AND id = '$id'");
        }
        echo json_encode([
            "success" => true
        ]);
    }
}

