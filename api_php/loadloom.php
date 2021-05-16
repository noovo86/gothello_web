<?php
// Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;

//ここからメイン

//削除処理
$games = glob("../games/*l.json");
if (empty($games)){
}else{
	for($i = 0; $i < count($games);$i++){
		$gjson = json_decode(file_get_contents($games[$i]),true);
		$t1 = strtotime((string)date('Y-m-d H:i:s')) - $gjson["p1t"];
		$t2 = 0;
		if ($gjson["turn"] != 0){
			$t2 = strtotime((string)date('Y-m-d H:i:s')) - $gjson["p2t"];
		}
		if ($t2 >= 20 || $t1 >= 20){
			unlink($games[$i]);
		}
	}
}

//ファイル名をルーム番号にし、プレイヤーが１名のみのルーム以外削除
$games = glob("../games/*l.json");
if (empty($games)){
}else{
	$fo = count($games);
    for($i = 0; $i < $fo; $i++){
		$gjson = json_decode(file_get_contents($games[$i]),true);
		if ($gjson["turn"] != 0){
			unset($games[$i]);
		}
    }
}
$games = array_values($games);
if (empty($games)){
}else{
    for($i = 0; $i < count($games);$i++){
		$games[$i] = substr($games[$i],9,4);
    }
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($games);