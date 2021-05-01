<?php
// Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;

//ここからメイン
$ok = 0;
$err = 0;
$lid = $_GET["loid"];
$pnum = $_GET["pnum"];
$games = glob("./games/*l.json");
for($i = 0; $i < count($games);$i++){
    if(substr($games[$i],8,4) == $lid){
        $ok = 1;
        $url = $games[$i];
    }
}
if($ok == 1){
    $kae = file_get_contents("./games/${lid}l.json");
    if($kae != false){
        $time = strtotime((string)date('Y-m-d H:i:s'));
        $nai = json_decode(file_get_contents($url));
        if($pnum == 1){
            $nai -> p1t = $time;
        }else if($pnum == 2){
            $nai -> p2t = $time;
        }
        $json = json_encode($nai);
        file_put_contents($url, $json);
    }
}else{
    $nai = Array ("turn" => 442);
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($nai);