<?php 

function angkaPiramid() {
    $rows = 5;
    for ($i = 1; $i <= $rows; $i++) {
        for ($j = 1; $j <= $i; $j++) {
            echo $j . " ";
        }
        echo "\n";
    }
    for ($i = $rows - 1; $i >= 1; $i--) {
        for ($j = 1; $j <= $i; $j++) {
            echo $j . " ";
        }
        echo "\n";
    }
}

angkaPiramid();

?>
