<?php
//Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;

header('Content-type: application/json; charset=utf-8');
//ここからメイン

$games = glob("./games/*l.json");
$lid = $_GET['loid'];
$aa = 0;
if (empty($games)){
}else{
	for($i = 0; $i < count($games);$i++){
        if(substr($games[$i],8,4) == $lid){
            $kae = file_get_contents($games[$i]);
            if($kae != false){
                $gjson = json_decode($kae,true);
                if ($gjson["turn"] == 0){
                    $aa = 1;
                    $url = $games[$i];
                }
            }
        }
	}
}
if($aa == 1){
    $p2date = strtotime((string)date('Y-m-d H:i:s'));
    $nai = json_decode(file_get_contents($url));
    $nai -> p2t = $p2date;
    $nai -> turn = 1;
    $json = json_encode($nai);
    file_put_contents($url, $json);
}
echo json_encode(['aa' => $aa]);