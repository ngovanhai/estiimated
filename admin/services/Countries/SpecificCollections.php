<?php
require("../_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "get") {
        $page = $_GET["page"];
        $limit = $_GET["limit"];
        $start = ($page - 1) * $limit;
        $where = "";
        if (isset($_GET['searchCollection']) && $_GET['searchCollection'] != "") {
            $searchCollectionTitle = $_GET['searchCollection'];
            $where .= "AND ( collection_title like '%$searchCollectionTitle%')";
        }
        if (isset($_GET['filterCountry']) && $_GET['filterCountry'] != "") {
            $filterCountry = $_GET['filterCountry'];
            $where .= " AND country_id =  '$filterCountry' ";
        }
        if ($where != "") {
            $limit = "";
        } else {
            $limit = "LIMIT $start, $limit";
        }
        $rules = fetchDbArray("
            SELECT * FROM $table_country_specific_collections
            WHERE shop = '$shop' $where
                AND collection_id IN ( SELECT * FROM (
                    SELECT collection_id FROM $table_country_specific_collections
                    WHERE shop = '$shop'
                    GROUP BY collection_id
                    ORDER BY collection_id $limit
                ) as t)
            ORDER BY collection_id
        ");


        $total = fetchDbObject("SELECT COUNT(collection_id) as total FROM (
            SELECT collection_id FROM $table_country_specific_collections
            WHERE shop = '$shop' $where     
            GROUP BY collection_id
        ) as t");
        echo json_encode([
            "success" => true,
            "rules" => $rules,
            "count" => $total["total"]
        ]);
    }
    if ($action == "delete") {
        $id = $_GET["id"];
        $query = $db->query("DELETE FROM $table_country_specific_collections WHERE shop = '$shop' AND id = '$id'");
        echo json_encode([
            "success" => $query
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "create") {
        $rule                   = $_POST['rule'];
        $collectionId              = $rule["collection_id"];
        $countryId              = $rule["country_id"];
        $existedRule            = fetchDbObject("SELECT * FROM $table_country_specific_collections WHERE shop = '$shop' AND collection_id = '$collectionId' AND country_id = '$countryId'");
        if ($existedRule) {
            $rule['id']         = $existedRule['id'];
            $query              = dbUpdate($table_country_specific_collections, $rule, "shop = '$shop' AND collection_id = '$collectionId' AND country_id = '$countryId'");
            echo json_encode([
                "success" => true,
                "is_duplicated" => true,
                "rule" => $rule
            ]);
        } else {
            $rule["shop"] = $shop;
            $id = dbInsert($table_country_specific_collections, $rule);
            $rule["id"] = $id;
            echo json_encode([
                "success" => true,
                "is_duplicated" => false,
                "rule" => $rule
            ]);
        }
        exit();
    }
    if ($action == "update") {
        $rule       = $_POST["rule"];
        $collectionId  = $rule["collection_id"];
        $countryId  = $rule["country_id"];
        $query      = dbUpdate($table_country_specific_collections, [
            "collection_id" => $rule["collection_id"],
            "collection_title" => $rule["collection_title"],
            "country_id" => $rule["country_id"],
            "minimum_days" => $rule["minimum_days"],
            "estimated_days" => $rule["estimated_days"],
            "custom_text" => $rule["custom_text"],
        ], "shop = '$shop' AND collection_id = '$collectionId' AND country_id = '$countryId'");
        echo json_encode([
            "success" => true
        ]);
        exit();
    }
}
