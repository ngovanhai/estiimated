<?php
require("../_mixins.php");
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    $shop = $_GET["shop"];
    if ($action == "get") {
        if(isset($_GET['searchByCountryName'])){
            $searchByCountryName = $_GET['searchByCountryName'];
            $where = "AND `name` LIKE '%$searchByCountryName%'";
        }else{
            $where = "";
        }
        $rules = fetchDbArray("SELECT * FROM $table_country_list WHERE shop = '$shop' $where  ORDER BY Ordering ASC");
        echo json_encode([
            "success" => true,
            "rules" => $rules
        ]);
    }
    if ($action == "delete") {
        $od = $_GET["od"];
        $country = fetchDbObject("SELECT * FROM $table_country_list WHERE shop = '$shop' AND od = '$od'");
        $country_id = $country["id"];
        $query1 = $db->query("DELETE FROM $table_country_list WHERE shop = '$shop' AND od = '$od'");
        $query2 = $db->query("DELETE FROM $table_country_specific_products WHERE shop = '$shop' AND country_id = '$country_id'");
        echo json_encode([
            "success" => $query1 && $query2
        ]);
    }
}

if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "create") {
        $country    = $_POST["country"];
        $countryId  = $country["id"];
        $existedCountry = fetchDbObject("SELECT * FROM $table_country_list WHERE shop = '$shop' AND id = '$countryId'");
        if ($existedCountry) {
            echo json_encode([
                "success" => false,
                "error" => [
                    "message" => "Rule has been created."
                ]
            ]);
        } else { 
            unset($country["od"]);
            $country["shop"] = $shop;
            $country["provinces"] = isset($country["provinces"]) ? json_encode($country["provinces"]) : json_encode(array());
            $id     = dbInsert($table_country_list, $country);
            echo json_encode([
                "success" => true,
                "od"    => $id
            ]);
        }
    }

    if ($action == "update") {
        $country    = $_POST["country"];
        $country["provinces"] = isset($country["provinces"]) ? json_encode($country["provinces"]) : json_encode(array());
        $od         = $country["od"];
        $query      = dbUpdate($table_country_list, $country, "shop = '$shop' AND od='$od'");
        echo json_encode([
            "success" => $query
        ]);
    }
}

