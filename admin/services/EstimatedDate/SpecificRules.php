<?php
require("../_mixins.php");
$shop = "";

$payloadSchema = [
    "product" => [],
    "collection" => [],
    "vendor" => []
];

if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "get") {
        $page = $_GET["page"];
        $limit = $_GET["limit"];
        $start = ($page-1) * $limit;
        $groupBy = $_GET["group_by"]; // enum["method","target"]
        $values = isset($_GET["values"]) ? $_GET["values"] : [];
        $result = [];
        switch ($groupBy) {
            case 'method': 
                $result = getRulesByMethodGrouping($shop, $start, $limit, $values);
                break; 
            default:
                $result = getRulesByTargetGrouping($shop, $start, $limit, $values);
                break;
        }
        $result = [
            "success" => true,
            "total" => $result["total"],
            "rules" => $result["rules"]
        ];
        echo json_encode($result);
    }

    if ($action == "getById") {
        $id = $_GET["id"];
        $rule = fetchDbObject("SELECT * FROM $table_estimated_date_specific_rules WHERE shop = '$shop' AND id = $id");
        $targets = getExistingPayload($id);
        $rule["targets"] = $targets;
        echo json_encode([
            "success" => true,
            "rule" => $rule
        ]);
    }

    if ($action === "getPreviewData") {
        $id = $_GET["id"];
        $targets = getExistingPayload($id);
        echo json_encode([
            "success" => true,
            "targets" => $targets
        ]);
    }

    if ($action == "deleteById") {
        $id = $_GET["id"];
        $deleteRuleStatus = $db->query("DELETE FROM $table_estimated_date_specific_rules WHERE shop = '$shop' AND id = '$id'");
        $deleteTargetsStatus = $db->query("DELETE FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND rule_id = '$id'");
        echo json_encode([
            "success" => $deleteRuleStatus && $deleteTargetsStatus
        ]);
    }
}

if (isset($_POST["action"])) {
    $action = $_POST["action"];
    $shop = $_POST["shop"];
    if ($action == "create") {
        $rule = $_POST["rule"];
        $rule["id"] = createRule($rule);
        $targets = updateTargets($rule);
        echo json_encode([
            "success" => true,
            "rule" => $rule
        ]);
    }
    if ($action == "update") {
        $rule = $_POST["rule"];
        
        $updateStatus = updateRule($rule);
        $targets = updateTargets($rule);
        echo json_encode([
            "success" => true,
            "rule" => $rule
        ]);
    }
}

function getRulesByMethodGrouping($shop, $start, $limit, $values) {
    global $table_estimated_date_specific_rules;
    global $table_estimated_date_specific_rule_targets;
    if (count($values) === 0) {
        $rules = fetchDbArray("
            SELECT *
            FROM $table_estimated_date_specific_rules
            WHERE shop = '$shop'
            LIMIT $start, $limit
        ");
        
        foreach ($rules as $key => &$rule) {
            $ruleId = $rule["id"];
            $rule["targets_count"] = fetchDbArray("
                SELECT COUNT(*) as total, target.type
                FROM $table_estimated_date_specific_rule_targets AS target
                WHERE target.rule_id = $ruleId
                GROUP BY target.type
            "); 
        }
         $total = fetchDbObject("SELECT COUNT(id) as total FROM $table_estimated_date_specific_rules WHERE shop = '$shop'");
    } else {
        $values = implode("','",$values);
        $targets = fetchDbArray("
            SELECT GROUP_CONCAT(rule_id SEPARATOR ' ') as rule_ids
            FROM $table_estimated_date_specific_rule_targets
            WHERE shop = '$shop' AND value IN ('".$values."')
            GROUP BY value
            ORDER BY value ASC
        ");

        $ruleIds = [];
        foreach ($targets as $key => $target) {
            $targetRuleIds = array_map('intval', explode(' ', $target["rule_ids"]));
            foreach ($targetRuleIds as $key => $ruleId) {
                array_push($ruleIds, $ruleId);
            }
        }
        $ruleIds = implode("','",$ruleIds);

        $rules = fetchDbArray("
            SELECT *
            FROM $table_estimated_date_specific_rules
            WHERE shop = '$shop' AND id IN ('".$ruleIds."')
            LIMIT $start, $limit
        "); 
        
        foreach ($rules as $key => &$rule) {
            $ruleId = $rule["id"];
            $rule["targets_count"] = fetchDbArray("
                SELECT COUNT(*) as total, target.type
                FROM $table_estimated_date_specific_rule_targets AS target
                WHERE target.rule_id = $ruleId
                GROUP BY target.type
            ");
        }

        $total = fetchDbObject("
            SELECT COUNT(id) as total
            FROM $table_estimated_date_specific_rules
            WHERE shop = '$shop' AND id IN ('".$ruleIds."')
        ");
    } 
    return [
        "rules" => $rules,
        "total" => $total["total"]
    ];
}

function getRulesByTargetGrouping($shop, $start, $limit, $values) {
    global $table_estimated_date_specific_rules;
    global $table_estimated_date_specific_rule_targets;
    if (count($values) === 0) {
        $targets = fetchDbArray("
            SELECT type, value, GROUP_CONCAT(rule_id SEPARATOR ' ') as rule_ids
            FROM $table_estimated_date_specific_rule_targets
            WHERE shop = '$shop'
            GROUP BY value
            ORDER BY value ASC
            LIMIT $start, $limit
        ");
        $total = fetchDbObject("SELECT COUNT(value) as total FROM (
            SELECT value FROM $table_estimated_date_specific_rule_targets
            WHERE shop = '$shop'
            GROUP BY value
        ) as t");
    } else {
        $values = implode("','",$values);
        $targets = fetchDbArray("
            SELECT type, value, GROUP_CONCAT(rule_id SEPARATOR ' ') as rule_ids
            FROM $table_estimated_date_specific_rule_targets
            WHERE shop = '$shop' AND value IN ('".$values."')
            GROUP BY value
            ORDER BY value ASC
            LIMIT $start, $limit
        ");
        $total = fetchDbObject("SELECT COUNT(value) as total FROM (
            SELECT value FROM $table_estimated_date_specific_rule_targets
            WHERE shop = '$shop' AND value IN ('".$values."')
            GROUP BY value
        ) as t");
    }
    
    $rules = [];
    foreach ($targets as $key => $target) {
        $ruleIds = array_map('intval', explode(' ', $target["rule_ids"]));
        $ruleIds = implode("','",$ruleIds);
        $targetRules = fetchDbArray("
            SELECT *
            FROM $table_estimated_date_specific_rules
            WHERE id IN ('".$ruleIds."')
        ");
        foreach ($targetRules as $key => $rule) {
            $rule["value"] = $target["value"];
            $rule["type"] = $target["type"];
            array_push($rules, $rule);
        }
        $target["rules"] = $targetRules;
    }
    return [
        "rules" => $rules,
        "total" => $total["total"]
    ];
}

function createRule($rule) {
    global $shop;
    global $db;
    global $table_estimated_date_specific_rules;
    $newRule = [
        "shop" => $shop,
        "shipping_method_id" => $rule["shipping_method_id"],
        "enable" => $rule["enable"],
        "minimum_days" => $rule["minimum_days"],
        "estimated_days" => $rule["estimated_days"],
        "estimated_text" => $rule["estimated_text"],
        "custom_text" => $rule["custom_text"]
    ];
    if (!$newRule["custom_text"] || $newRule["custom_text"] === "") {
        // unset($newRule["custom_text"]);
    }
    $id = dbInsert($table_estimated_date_specific_rules, $newRule);
    return $id;
}

function updateRule($rule) {
    global $shop;
    global $table_estimated_date_specific_rules;
    $ruleId = $rule["id"];
    $updateRule = [
        "shop" => $shop,
        "shipping_method_id" => $rule["shipping_method_id"],
        "enable" => $rule["enable"],
        "minimum_days" => $rule["minimum_days"],
        "estimated_days" => $rule["estimated_days"],
        "estimated_text" => $rule["estimated_text"],
        "custom_text" => $rule["custom_text"]
    ];
    if (!$updateRule["custom_text"] || $updateRule["custom_text"] === "") {
        // unset($updateRule["custom_text"]);
    }
    $query = dbUpdate($table_estimated_date_specific_rules, $updateRule, "shop = '$shop' and id = $ruleId");
    return $query;
}

function updateTargets($rule) {
    global $shop;
    global $table_estimated_date_specific_rule_targets;
    $ruleId = $rule["id"];
    $shippingMethodId = $rule["shipping_method_id"];
    $targets = $rule["targets"];
    $inputPayload = getInputPayload($targets); 
    $existingPayload = getExistingPayload($ruleId);
    $payloadForCreation = getDiffPayload($inputPayload, $existingPayload); 
    $payloadForDeletion = getDiffPayload($existingPayload, $inputPayload); 
    $createdPayload = createPayload($ruleId, $shippingMethodId, $payloadForCreation);
    $deletedSuccess = deletePayload($ruleId, $payloadForDeletion);
    return $createdPayload;
}

function getInputPayload($targets) {
    global $payloadSchema;
    $payload = $payloadSchema;
    foreach ($targets as $key => $target) {
        $items = array_key_exists("items", $target) ? $target["items"] : [];
        foreach ($items as $key => $item) {
            switch ($target["type"]) {
                case "product":
                    array_push($payload[$target["type"]], $item["id"]);
                    break;
                case "collection":
                    array_push($payload[$target["type"]], $item["id"]);
                    break;
                case "vendor":
                    array_push($payload[$target["type"]], $item);
                    break;
                default:
                    break;
            }
        }
    }
    
    return $payload;
}

function getExistingPayload($ruleId) {
    global $shop;
    global $table_estimated_date_specific_rule_targets;
    global $payloadSchema;
    $payload = $payloadSchema;
    $sql = "SELECT type,GROUP_CONCAT(value SEPARATOR ',') as items FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND rule_id = $ruleId GROUP BY rule_id, type";
    $result = fetchDbArray($sql);
    foreach ($result as $key => $data) {
        $type = $data["type"];
        $items = explode(",", $data["items"]);
        foreach ($items as $key => &$item) {
            if (is_numeric($item)) {
                $item = (int)$item;
            }
        }
        $payload[$type] = $items;
    }
    return $payload;
}

function getDiffPayload($payloadCompareFrom, $payloadCompareAgainst) {
    global $payloadSchema;
    $payload = $payloadSchema;
    foreach ($payload as $type => &$item) {
        $item = array_diff($payloadCompareFrom[$type], $payloadCompareAgainst[$type]);
    }
    return $payload;
}

function createPayload($ruleId, $shippingMethodId, $payload) {
    global $shop;
    global $table_estimated_date_specific_rule_targets;
    $results = [];
    foreach ($payload as $type => $items) {
        foreach ($items as $index => $value) {
            $newTarget = [
                "shop" => $shop,
                "rule_id" => $ruleId,
                "shipping_method_id" => $shippingMethodId,
                "type" => $type,
                "value" => $value
            ];
            $id = dbDuplicate($table_estimated_date_specific_rule_targets, $newTarget, "rule_id = $ruleId");
            $newTarget["id"] = $id;
            array_push($results, $newTarget);
        }
    }
    return $results;
}

function deletePayload($ruleId, $payload) {
    global $shop;
    global $db;
    global $table_estimated_date_specific_rule_targets;
    $count = 0;
    foreach ($payload as $type => $items) {
        foreach ($items as $index => $value) {
            $query = $db->query("DELETE FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop' AND rule_id = '$ruleId' AND value = '$value'");
            $count += 1;
        }
    }
    return $count;
}
