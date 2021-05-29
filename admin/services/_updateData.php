<?php
require("./_mixins.php");
date_default_timezone_set('UTC');
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    switch ($action) {
        case 'migrateData';
            $sql = "SELECT *, COUNT(shop) as count FROM $table_estimated_date_specific_rule_targets GROUP BY shop, shipping_method_id, type, value ORDER BY count DESC";
            $original = fetchDbArray($sql);
            $filtered = array_filter($original, "moreThanOne");
            foreach ($filtered as $key => $target) {
                $value = $target["value"];
                $shop = $target["shop"];
                $sql = "SELECT * FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND value = '$value'";
                $data = fetchDbArray($sql);
                $keepTarget = $data[0];
                $keepTargetId = $keepTarget["id"];
                foreach ($data as $key => $target) {
                    $targetId = $target["id"];
                    if ($targetId !== $keepTargetId) {
                        $sql = "DELETE FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND id = '$targetId'";
                        $status = $db->query($sql);
                    }
                }
            }

            echo json_encode([
                "success" => true
            ]);
            break;
        default:
            break;
    }
}

function moreThanOne($element) {
    return $element["count"] > 1;
}