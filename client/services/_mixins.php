<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require(dirname(__FILE__)."/../../vendor/autoload.php");
require(dirname(__FILE__)."/../../conn-shopify.php");
use sandeepshetty\shopify_api;

function fetchDbObject ($sql) {
    global $db;
    global $shop;
    $query = $db->query($sql);
    $object = array();
    if ($query) {
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

function shopifyInit($shop) {
    global $db;
    global $appId;
    $appSettings = fetchDbObject("SELECT * FROM tbl_appsettings WHERE id = $appId");
    $shopData = fetchDbObject("SELECT * FROM tbl_usersettings WHERE store_name = '$shop' and app_id = $appId");
    if ($shopData) {
        $shopify = shopify_api\client(
            $shop, $shopData["access_token"], $appSettings["api_key"], $appSettings["shared_secret"]
        );
        return $shopify;
    } else { 
        die();
    }
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

function show_array($data) {
    if (is_array($data)) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }
}
