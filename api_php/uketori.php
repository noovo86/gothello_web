<?php
// Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;

header('Content-type: application/json; charset=utf-8');

//ここからメイン
$lid = $_POST["loid"];
$a = 1;
while($a == 1){
    $a = 0;
    $kae = file_get_contents("../games/${lid}l.json");
    if($kae == false){
        $a = 1;
    }
}
$nai = json_decode($kae);

if(isset($_POST["turn"])){
    $turn = $_POST["turn"];
    $nai -> turn = $turn;
}
if(isset($_POST["kati"])){
    $kati = $_POST["kati"];
    $nai -> kati = $kati;
}
if(isset($_POST["shoin"])){
    $shoin = $_POST["shoin"];
    $nai -> shoin = $shoin;
}
if(isset($_POST["koma"])){
    $koma = $_POST["koma"];
    $nai -> koma = $koma;
}
if(isset($_POST["sol"])){
    $sol = $_POST["sol"];
    $nai -> sol = $sol;
}
$json = json_encode($nai);

$a = 1;
while($a == 1){
    $a = 0;
    $er = file_put_contents("../games/${lid}l.json", $json);
    if($er == false){
        $a = 1;
    }
}

$a = 1;
while($a == 1){
    $a = 0;
    $kae = file_get_contents("../games/${lid}l.json");
    if($kae == false){
        $a = 1;
    }
}
$nai = json_decode($kae);

echo json_encode($nai);