<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);

require '../../vendor/autoload.php';
use sandeepshetty\shopify_api;
 
function fetchDbObject ($sql) {
    global $db;
    global $shop;
    $query = $db->query($sql);
    $object = array();
    if ($query && mysqli_num_rows($query) > 0) {
        while ($row = $query->fetch_assoc()) {
            $object = $row;
        }
    }
    return $object;
}

function fetchDbArray ($sql) {
    global $db;
    global $shop;
    $result = [];
    $query = $db->query($sql);
    while ($row = mysqli_fetch_assoc($query)) {
        $result[] = $row;
    }
    return $result;
}
function pr($data) {
    if (is_array($data)) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }else{
        var_dump($data);
    }
} 
function shopifyInit($db, $shop, $appId) {
    $select_settings = $db->query("SELECT * FROM tbl_appsettings WHERE id = $appId");
    $app_settings = $select_settings->fetch_object();
    $shop_data = $db->query("SELECT * FROM tbl_usersettings WHERE store_name = '" . $shop . "' and app_id = $appId");
    $shop_data = $shop_data->fetch_object();
    if(!isset($shop_data->access_token)){ die();}
        $shopify = shopify_api\client(
            $shop, $shop_data->access_token, $app_settings->api_key, $app_settings->shared_secret
        );
        return $shopify;
}

function dbInsert($table, $data) {
    global $db;
    $fields = "(" . implode(", ", array_keys($data)) . ")";
    $values = "";

    foreach ($data as $field => $value) {
        if ($value === NULL) {
            $values .= "NULL, ";
        } elseif (is_numeric($value)) {
            $values .= $value . ", ";
        } elseif ($value == 'true' || $value == 'false') {
            $values .= $value . ", ";
        } else {
            $value = $db->real_escape_string($value);
            $values .= "'" . $value . "', ";
        }
    }
    $values = substr($values, 0, -2);
    dbQuery("
            INSERT INTO $table $fields
            VALUES($values)
        ");
    return mysqli_insert_id($db);
}

function dbUpdate($table, $data, $where) {
    global $db;
    $sql = "";
    foreach ($data as $field => $value) {
        if ($value === NULL) {
            $sql .= "$field=NULL, ";
        } elseif (is_numeric($value)) {
            $sql .= "$field=" . addslashes($value) . ", ";
        } elseif ($value == 'true' || $value == 'false') {
            $sql .= "$field=" . addslashes($value) . ", ";
        } else
            $value = $db->real_escape_string($value);
            $sql .= "$field='" . $value . "', ";
    }
    $sql = substr($sql, 0, -2); 
    dbQuery("
        UPDATE `$table`
        SET $sql
        WHERE $where
    ");
    return mysqli_affected_rows($db);
}

function dbQuery($query_string) {
    global $db;
    $result = mysqli_query($db, $query_string);
    if (!$result) {
        echo ('Query Error' . $query_string);
    }
    return $result;
}

function showArray($data) {
    if (is_array($data)) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }
}

function saveScriptTagId($shop, $shopify, $table) {
    $scriptTags = $shopify("GET", APIVERSION."script_tags.json");
    $scriptTag = $scriptTags[0];
    $scriptTagId = $scriptTag["id"];
    $settings = fetchDbObject("SELECT * FROM $table WHERE shop = '$shop'");
    $settings["script_tag_id"] = $scriptTagId;
    $query = dbUpdate($table, $settings, "shop = '$shop'");
    return $scriptTagId;
}

function getJsonData($shop, $shopify) {
    global $table_settings;
    global $table_specific_products;
    global $table_holidays;
    global $table_specific_collections;

    $settings = fetchDbObject("SELECT * FROM $table_settings WHERE shop = '$shop'");
    if (!$settings["script_tag_id"] || !isset($settings["script_tag_id"])) {
        return [
            "success" => false,
            "error" => [
                "message" => "Missing Script Tag Id"
            ]
        ];
    } 
    $productPosition = getProductPosition($settings["position_product_page"], $shopify);
    $settings["position_product_page"] = $productPosition;
    $settings["date_format_moment"] = convertPHPToMomentFormat($settings["date_format"]);
    $specificProducts = fetchDbArray("SELECT * FROM $table_specific_products WHERE shop = '$shop'");
    $specificCollections = fetchDbArray("SELECT * FROM $table_specific_collections WHERE shop = '$shop'");
    $holidays = fetchDbArray("SELECT * FROM $table_holidays WHERE shop = '$shop'");
    $data = [
        "settings" => $settings,
        "specificProducts" => $specificProducts,
        "specificCollections" => $specificCollections,
        "holidays" => $holidays
    ];
    return $data;
}

function updateJsonFile($shop, $jsonData) {
    $storeDataFolder = STORE_DATA_PATH . $shop;
    if (!file_exists($storeDataFolder)) {
        mkdir($storeDataFolder, 0777, true);
    }
    $storeDataFile = $storeDataFolder . '/data.json';
    file_put_contents($storeDataFile, is_array($jsonData) ? json_encode($jsonData) : $jsonData);

    return $storeDataFile;
}

function updateScriptTag($shopify, $settings, $clientJsUrl) {
    $date = new DateTime();
    $newVersion = $date->format('ymdHis');
    $scriptTagId = $settings["script_tag_id"];
    $updatedScriptTag = $shopify("PUT", APIVERSION."script_tags/$scriptTagId.json", [
        "script_tag"=> [
            "id" => $scriptTagId,
            "src" => $clientJsUrl . "?v=" .$newVersion
        ]
    ]);
    return $updatedScriptTag;
}

function getProductPosition($productPosition, $shopify) {
    $theme = strtolower(getMainTheme($shopify));
    $themeLists = file_get_contents(dirname(__FILE__)."/../themes.json");
    $themeLists = json_decode($themeLists);
    $position = "form[action^='/cart/add']";
    foreach ($themeLists as $value) {
        if(strpos($theme, $value->name) !== false){
            if ($productPosition == 'under_product_description') {
                $position = $value->product_description;
            }
            else if ($productPosition == 'under_product_add_to_cart') {
                $position = $value->product_addcart;
            }
            else if ($productPosition == 'under_product_title') {
                $position = $value->product_title;
            }
            else if ($productPosition == 'under_product_price') {
                $position = $value->product_price;
            }
        }
    }
    return $position;
}

function getMainTheme($shopify) {
    $themes = $shopify('GET', APIVERSION.'themes.json');
    $themes = is_array($themes) ? $themes : [];
    $result = "";
    foreach ($themes as $theme){
        if($theme["role"] == 'main') $result = $theme["name"];
    }
    return $result;
}

function convertPHPToMomentFormat($format) {
    $replacements = [
        'd' => 'DD',
        'D' => 'ddd',
        'j' => 'D',
        'l' => 'dddd',
        'N' => 'E',
        'S' => 'o',
        'w' => 'e',
        'z' => 'DDD',
        'W' => 'W',
        'F' => 'MMMM',
        'm' => 'MM',
        'M' => 'MMM',
        'n' => 'M',
        't' => '', // no equivalent
        'L' => '', // no equivalent
        'o' => 'YYYY',
        'Y' => 'YYYY',
        'y' => 'YY',
        'a' => 'a',
        'A' => 'A',
        'B' => '', // no equivalent
        'g' => 'h',
        'G' => 'H',
        'h' => 'hh',
        'H' => 'HH',
        'i' => 'mm',
        's' => 'ss',
        'u' => 'SSS',
        'e' => 'zz', // deprecated since version 1.6.0 of moment.js
        'I' => '', // no equivalent
        'O' => '', // no equivalent
        'P' => '', // no equivalent
        'T' => '', // no equivalent
        'Z' => '', // no equivalent
        'c' => '', // no equivalent
        'r' => '', // no equivalent
        'U' => 'X',
    ];
    $momentFormat = strtr($format, $replacements);
    return $momentFormat;
}