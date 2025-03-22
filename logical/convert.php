<?php
function numberToWords($number) {
    $words = [ "", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
    $levels = ["", "Ribu", "Juta", "Miliar", "Triliun"];
    
    if ($number == 0) return "Nol";

    $numStr = strrev($number);
    $chunks = str_split($numStr, 3);
    
    $result = [];
    foreach ($chunks as $i => $chunk) {
        $chunk = strrev($chunk);
        $num = (int)$chunk;
        if ($num > 0) {
            $result[] = threeDigitsToWords($num, $words) . " " . $levels[$i];
        }
    }
    
    return trim(implode(" ", array_reverse($result)));
}

function threeDigitsToWords($num, $words) {
    $hundred = (int)($num / 100);
    $remainder = $num % 100;
    $tens = (int)($remainder / 10);
    $ones = $remainder % 10;
    
    $result = "";
    
    if ($hundred > 0) {
        $result .= ($hundred == 1 ? "Seratus" : $words[$hundred] . " Ratus") . " ";
    }
    
    if ($remainder > 0) {
        if ($tens == 1) {
            if ($ones == 0) $result .= "Sepuluh";
            elseif ($ones == 1) $result .= "Sebelas";
            else $result .= $words[$ones] . " Belas";
        } else {
            if ($tens > 1) $result .= $words[$tens] . " Puluh ";
            if ($ones > 0) $result .= $words[$ones];
        }
    }
    
    return trim($result);
}

echo numberToWords(2500000); 

?>
