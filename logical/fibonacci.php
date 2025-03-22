<?php
function fibonacci($n) {
    $fib = [1, 1];
    for ($i = 2; $i < $n; $i++) {
        $fib[$i] = $fib[$i - 1] + $fib[$i - 2];
    }
    return implode(',', array_slice($fib, 0, $n));
}

echo fibonacci(7); 

?>