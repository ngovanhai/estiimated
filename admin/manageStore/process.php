<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL);
define("SWITCH_PATH", dirname(__FILE__) . "/");
header('Content-Type: application/json');
require  '../../vendor/autoload.php';

use sandeepshetty\shopify_api;

require SWITCH_PATH . '../../conn-shopify.php';
require  'help.php';

if (isset($_GET["action"])) {
    $action = $_GET["action"];
    if($action == "execQuery"){
        if(!isset($_GET['queryDB']) || !isset($_GET['typeQuery'])) return [];
        $typeQuery = $_GET['typeQuery'];
        $queryDB = $_GET['queryDB'];
        $result = execQuery($typeQuery,$queryDB);
        echo json_encode($result);
        exit();
    }
    if ($action == "getAllShops") {
        $data = fetchDbArray("select * from shop_installed where app_id = $appId ORDER BY id DESC");
        foreach ($data as $key => &$value) {
            $value['stt'] = $key + 1;
            $shop = $value['shop'];
            $user = fetchDbObject("select * from tbl_usersettings where store_name = '$shop' AND app_id = $appId");
            $value['install'] = (empty($user)) ? "uninstall" : "install";
            $value['date_installed'] = date("d/m/Y H:i:s", strtotime($value['date_installed']));
        }
        echo json_encode($data);
        exit;
    }
    if($action == "saveNoteStore"){
        if(!isset($_GET['note']) || !isset($_GET['shop'])  )  return false;
        $note = $_GET['note'];
        $shop = $_GET['shop'];
        dbUpdate("shop_installed", [
            'note' => $note
        ], "shop = '$shop' AND app_id = $appId");

        echo json_encode(true);
        exit;
    }
}
if (isset($_POST["action"])) {
    $action = $_POST["action"]; 
    if($action == "saveContentEmailTemplate"){
        if(!isset($_POST['emailEdit'])) return [];
        $emailEdit = $_POST['emailEdit'];
        $id = $emailEdit['id'];
        $title = $emailEdit['title'];
        $content = $emailEdit['content'];
        dbUpdate("quantity_template_email",[
            "title" => $title,
            "content" => $content,
        ],"id = $id");
        $listEmailTemplate = getAllListTemplate();
        echo json_encode($listEmailTemplate);
        exit();
    }
    if($action == "saveSettings"){
        if(!isset($_POST['shop'])) return false;
        $shop = $_POST['shop'];
        $settings = $_POST['settings'];
        $data = array( 
            'enableApp'            => $settings['enableApp'], 
            'customCss'            => $settings['customCss'], 
            'useAjaxCart'            => $settings['useAjaxCart']
         );
        $response = dbUpdate("custom_order_settings",$data,"shop = '$shop'");
        echo json_encode(true);
    }
    
}
function execQuery($typeQuery,$queryDB){
    if($typeQuery == "get"){ 
        $result = fetchDbArray($queryDB);
        return $result;
    } else{
        return db_query($queryDB);
    } 
}
function getAllListTemplate(){
    $listEmailTemplate = fetchDbArray("SELECT * FROM quantity_template_email");
    return $listEmailTemplate;
}
 