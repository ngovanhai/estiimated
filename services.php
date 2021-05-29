<?php
$dir    = './assets/flags/4x3';
$files = scandir($dir);
// The following lines will remove values from the first two indexes.
unset($files[0]);
unset($files[1]);
// This line will re-set the indexes (the above just nullifies the values...) and make a     new array without the original first two slots.
$files = array_values($files);
foreach ($files as $key => $file) {
    $flag = str_replace(".svg", "", $file);
    echo ".flag-icon-$flag {";
    echo "<br/>";
    echo "\t";
    echo "background-image: url(./4x3/$flag.svg);";
    echo "<br/>";
    echo "}";
    echo "<br/>";
    echo ".flag-icon-$flag.flag-icon-squared {";
    echo "<br/>";
    echo "\t";
    echo "background-image: url(./1x1/$flag.svg);";
    echo "<br/>";
    echo "}";
    echo "<br/>";
    echo "<br/>";
}
?>

<!-- .flag-icon-es {
    background-image: url(../flags/4x3/es.svg);
}

.flag-icon-es.flag-icon-squared {
    background-image: url(../flags/1x1/es.svg);
} -->