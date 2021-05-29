<?php
require("./_mixins.php");
date_default_timezone_set('UTC');
$shop = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
    if (isset($_GET["shop"])) {
        $shop = $_GET["shop"];
        $shopify = shopifyInit($db, $shop, $appId);
        if ($action == "generate") {
            $result = _generateJson();
            echo json_encode($result);
        }
    }
    if ($action == "getAllShops") {
        $shops = fetchDbArray("SELECT settings.id,settings.shop,user.* FROM $table_general_settings as settings JOIN tbl_usersettings as user ON settings.shop = user.store_name WHERE user.status = 'active' AND user.app_id = $appId ");
        echo json_encode([
            "shops" => $shops
        ]);
    }

    if ($action == "updateScriptTag") {
        $scriptTags = $shopify('GET', APIVERSION . 'script_tags.json');
        echo json_encode($scriptTags);
    }

    if ($action == "updateFreePlan") {
        $scriptTags = $shopify('GET', APIVERSION . 'recurring_application_charges.json');
        $scriptTagID = getScriptTagsByID($scriptTags);
        if ($scriptTagID != NULL) {
            $recu = $shopify("DELETE", APIVERSION . "recurring_application_charges/$scriptTagID.json");
            pr($recu);
            $charge = array(
                "recurring_application_charge" => array(
                    "name" => $chargeTitle,
                    "price" => $price,
                    "return_url" => "$rootLink/charge.php?shop=$shop",
                    "test" => $testMode,
                    "trial_days" => $trialTime
                )
            );
        
            if ($chargeType == "one-time") {
                $recu = $shopify("POST", APIVERSION."application_charges.json", $charge);
                $confirmation_url = $recu["confirmation_url"];
            } else {
                $recu = $shopify("POST", APIVERSION."recurring_application_charges.json", $charge);
                $confirmation_url = $recu["confirmation_url"];
            }
            pr($recu);
        }
        die();
    }
    if ($action == "getScriptTags") {
        $scriptTags = $shopify('GET', APIVERSION . 'recurring_application_charges.json');
        pr($scriptTags);
        die();
    }
}
function getScriptTagsByID($scriptags)
{
    foreach ($scriptags as $script) {
        if ($script['name'] == "Estimated Shipping Date Monthly charge") {
            pr($script);
            return $script['id'];
        }
    }
    return null;
}
function _generateJson()
{
    global $rootLink;
    global $db;
    global $shop;
    global $shopify;

    global $table_general_settings;
    global $table_estimated_shipping_methods;

    global $table_estimated_date_settings;
    global $table_estimated_date_specific_rules;
    global $table_estimated_date_specific_rule_targets;

    global $table_zipcode_settings;
    global $table_zipcode_list;
    global $table_zipcode_specific_products;
    global $table_zipcode_specific_collections;
    global $table_zipcode_specific_vendors;

    global $table_country_list;
    global $table_country_specific_products;
    global $table_country_specific_collections;
    // General settings
    $generalSettings = fetchDbObject("SELECT * FROM $table_general_settings WHERE shop = '$shop'");
    if ($generalSettings['clientJsUrl'] == "development") {
        $clientJsUrl = $rootLink . "/client/estimated-shipping.js";
    } else {
        $clientJsUrl = $rootLink . "/client/estimated-shipping.min.js";
    }
    if (!$generalSettings["script_tag_id"] || !isset($generalSettings["script_tag_id"])) {
        return [
            "success" => false,
            "error" => [
                "message" => "Missing Script Tag Id"
            ]
        ];
    }
    $position = getPosition($generalSettings["position_code"], $rootLink, $shopify);
    $generalSettings["position"] = $position;
    // Shipping methods
    $shippingMethods = fetchDbArray("SELECT * FROM $table_estimated_shipping_methods WHERE shop = '$shop' ORDER BY position ASC");
    // Estimated Date
    $estimatedDateSettings = fetchDbObject("SELECT * FROM $table_estimated_date_settings WHERE shop = '$shop'");
    $estimatedDateSpecificRules = fetchDbArray("SELECT * FROM $table_estimated_date_specific_rules WHERE shop = '$shop' AND enable = 1");
    $estimatedDateSpecificRuleTargets = fetchDbArray("SELECT * FROM $table_estimated_date_specific_rule_targets WHERE shop = '$shop'");
    // Zipcode
    $zipcodeSettings = fetchDbObject("SELECT * FROM $table_zipcode_settings WHERE shop = '$shop'");
    $zipcodeList = fetchDbArray("SELECT * FROM $table_zipcode_list WHERE shop = '$shop'");
    $zipcodeSpecificProducts = fetchDbArray("SELECT * FROM $table_zipcode_specific_products WHERE shop = '$shop'");
    $zipcodeSpecificCollections = fetchDbArray("SELECT * FROM $table_zipcode_specific_collections WHERE shop = '$shop'");
    $zipcodeSpecificVendors = fetchDbArray("SELECT * FROM $table_zipcode_specific_vendors WHERE shop = '$shop'");
    // Country 
    $countryList = fetchDbArray("SELECT * FROM $table_country_list WHERE shop = '$shop' ORDER BY Ordering ASC");
    $countrySpecificProducts = fetchDbArray("SELECT * FROM $table_country_specific_products WHERE shop = '$shop'");
    $countrySpecificCollections = fetchDbArray("SELECT * FROM $table_country_specific_collections WHERE shop = '$shop'");
    $data = [
        "app" => [
            "settings" => $generalSettings,
            "shippingMethods" => $shippingMethods,
            "estimatedDate" => [
                "settings" => $estimatedDateSettings,
                "specificRules" => $estimatedDateSpecificRules,
                "specificRuleTargets" => $estimatedDateSpecificRuleTargets
            ],
            "country" => [
                "listCountries" => $countryList,
                "specificProducts" => $countrySpecificProducts,
                "specificCollections" => $countrySpecificCollections
            ],
            "zipcode" => [
                "settings" => $zipcodeSettings
            ]
        ]
    ];
    $dataZipcode = [
        "app" => [
            "zipcode" => [
                "listZipcodes" => $zipcodeList,
                "specificProducts" => $zipcodeSpecificProducts,
                "specificCollections" => $zipcodeSpecificCollections,
                "specificVendors" => $zipcodeSpecificVendors
            ]
        ]
    ];
    // Define path into shop's json file 
    $storeDataFolder = STORE_DATA_PATH . $shop;
    $storeDataFile = $storeDataFolder . '/data.json';
    $storeDataFileZipcode = $storeDataFolder . "/dataZipcode.json";
    if (!file_exists($storeDataFolder))  mkdir($storeDataFolder, 0777, true);

    file_put_contents($storeDataFile, is_array($data) ? json_encode($data) : $data);
    file_put_contents($storeDataFileZipcode, is_array($dataZipcode) ? json_encode($dataZipcode) : $dataZipcode);

    $scriptTagId = $generalSettings["script_tag_id"];
    $updatedScriptTag = $shopify("PUT", APIVERSION . "script_tags/" . $scriptTagId . ".json", [
        "script_tag" => [
            "id" => $scriptTagId,
            "src" => $clientJsUrl . "?v=" . time()
        ]
    ]);
    return [
        "success" => true
    ];
}

function getPosition($type, $rootLink, $shopify)
{
    $theme = strtolower(getMainTheme($shopify));
    $themeLists = file_get_contents(dirname(__FILE__) . "/../../checkTheme.json");
    $themeLists = json_decode($themeLists);
    $position = "form[action^='/cart/add']:first";
    foreach ($themeLists as $value) {
        if (strpos($theme, $value->name) !== false) {
            if ($type == '1') {
                $position = $value->product_description;
            } else if ($type == '2') {
                $position = $value->product_addcart;
            } else if ($type == '3') {
                $position = $value->product_price;
            } else if ($type == '4') {
                $position = $value->product_title;
            }
        }
    }
    return $position;
}

function getMainTheme($shopify)
{
    $themes = $shopify('GET', APIVERSION . 'themes.json');
    $themes = is_array($themes) ? $themes : [];
    $result = "";
    foreach ($themes as $theme) {
        if ($theme["role"] == 'main') $result = $theme["name"];
    }
    return $result;
}
