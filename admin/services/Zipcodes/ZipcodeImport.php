<?php
require("../_mixins.php");
use PhpOffice\PhpSpreadsheet\IOFactory;
ini_set('memory_limit', '-1'); 
 
 
if (isset($_FILES['fileZipcode']['name'])) {
    $shop = $_POST['shop'];
    $shopify = shopifyInit($db, $shop, $appId);
    $rand = rand(0, 10000);
    $filename = $_FILES['fileZipcode']['name'];
    $tmpname  = $_FILES['fileZipcode']['tmp_name'];
    $filename = $rand.'_'.FixSpecialChars($filename);
    $tmpname = FixSpecialChars($tmpname);
    $target_file =  APP_PATH . "/upload/" . basename($filename);
    move_uploaded_file ( $tmpname, $target_file );
    $inputFileType = ucfirst(pathinfo($filename, PATHINFO_EXTENSION));
    $inputFileName = $target_file;
    
    $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);

    $worksheetData = $reader->listWorksheetInfo($inputFileName);
    $sheetName = $worksheetData[0]['worksheetName'];
    $totalRows = $worksheetData[0]['totalRows'];
    $totalColumns = $worksheetData[0]['totalColumns']; 
    /**  Load $inputFileName to a Spreadsheet Object  **/
    $reader->setLoadSheetsOnly($sheetName);
    $spreadsheet = $reader->load($inputFileName); 
    $worksheet = $spreadsheet->getActiveSheet();
    $rowData = $worksheet->toArray();
  
    $data = [] ;
    foreach($rowData as $k=>$v){
        if($k > 1){
            if(empty($v['0']) || empty($v['1']) || empty($v['2']) || empty($v['3'])) break;
            $data = [
                "name" => $v[0],
                "zipcode_list" => $v[1],
                "estimated_days" => $v[3],
                "minimum_days" => $v[2],
                "shop" => $shop

            ]; 
            dbInsert($table_zipcode_list, $data);
        }
    }
    $remove = unlink($inputFileName); 
    echo json_encode(true);
    exit();
}  
if (isset($_POST["action"])) {
    $action  = $_POST["action"];
    $shop    = $_POST["shop"];
    if ($action == "importZipcode") {  
        if(!isset($_POST['listZipCodeImport'])) return false;
        $listZipCodeImport = $_POST['listZipCodeImport'];
        foreach($listZipCodeImport as $v){
            $data = [
                "name" => $v[0],
                "zipcode_list" => $v[1],
                "estimated_days" => $v[2],
                "minimum_days" => $v[3],
                "shop" => $shop

            ];

            dbInsert($table_zipcode_list, $data);
         }
        echo json_encode(true);
    }
}

function FixSpecialChars($text){
    $map = array(array("\ufffd", ""),
            array("�", ""),
            array(" ", "_"),
            array("&", "_"),
            array("!", "_"),
            array("%", "_"),
            array("#", "_"),
            array("@", "_"),
            array("%", "_"),
            array("^", "_"),
            array("*", "_"),
            array("(", "_"),
            array(")", "_"),
            array("+", "_"),
            array("=", "_"),
            array("~", "_"),
            array("?", "_"),
            array("<", "_"),
            array(">", "_"),
            array("�", "")
            );
    if (is_array($map))
    {
        foreach ($map as $pair)
            $text = str_replace($pair[0], $pair[1], $text);
    }
    return $text;
}