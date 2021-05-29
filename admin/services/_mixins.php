<?php
ini_set('display_errors', TRUE);
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
error_reporting(E_ALL);
require(dirname(__FILE__) . "/../../vendor/autoload.php");
require(dirname(__FILE__) . "/../../conn-shopify.php");
ini_set('memory_limit', '1024M');
set_time_limit(25);
use sandeepshetty\shopify_api;

function fetchDbObject($sql)
{
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

function fetchDbArray($sql)
{
    global $db;
    global $shop;
    $result = [];
    $query = $db->query($sql);
    while ($row = mysqli_fetch_assoc($query)) {
        $result[] = $row;
    }
    return $result;
}

function shopifyInit($db, $shop, $appId)
{
    $select_settings = $db->query("SELECT * FROM tbl_appsettings WHERE id = $appId");
    $app_settings = $select_settings->fetch_object();
    $shop_data = $db->query("SELECT * FROM tbl_usersettings WHERE store_name = '" . $shop . "' and app_id = $appId");
    $shop_data = $shop_data->fetch_object();
    if (!isset($shop_data->access_token)) {
        echo json_encode([
            "error" => [
                "message" => "Init Shopify failed"
            ]
        ]);
        die();
    }
    $shopify = shopify_api\client(
        $shop,
        $shop_data->access_token,
        $app_settings->api_key,
        $app_settings->shared_secret
    );
    return $shopify;
}

function dbInsert($table, $data)
{
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

function dbUpdate($table, $data, $where)
{
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

function dbQuery($query_string)
{
    global $db;
    $result = mysqli_query($db, $query_string);
    if (!$result) {
        echo ('Query Error' . $query_string);
    }
    return $result;
}

function pr($data)
{
    if (is_array($data)) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    } else {
        var_dump($data);
    }
}

function dbDuplicate($table, $data, $content_duplicate)
{
    global $db;
    $fields = "(" . implode(", ", array_keys($data)) . ")";
    $values = "(";

    foreach ($data as $field => $value) {
        if ($value === NULL) {
            $values .= "NULL, ";
        } elseif ($value === TRUE || $value === FALSE) {
            $values .= "$value, ";
        } else {
            $value = $db->real_escape_string($value);
            $values .= "'" . $value . "',";
        }
    }

    $values = rtrim($values, ',');
    $values .= ")";
    $query = "INSERT INTO $table  $fields  VALUES $values ON DUPLICATE KEY UPDATE $content_duplicate";
    dbQuery($query);
    return  mysqli_insert_id($db);
}
