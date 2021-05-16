<?php
// Ajax以外からのアクセスを遮断
//$request = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
//    ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
//if($request !== 'xmlhttprequest') exit;

//ここからメイン

$games = glob("../games/*l.json");
$a = 0;
while($a == 0){
	$a = 1;
	$rand = mt_rand(1000,9999);
	if (empty($games)){
	}else{
		for($i = 0; $i < count($games);$i++){
			if (substr($games[$i],9,4) == $rand){
				$a = 0;
			}
		}
	}
}

$p1date = strtotime((string)date('Y-m-d H:i:s'));

$array = Array (
	"loomid" => $rand,
    "p1t" => $p1date,
    "p2t" => 0,
	"turn" => 0,
	"kati" => 0,
	"shoin" => 0,
    "koma" => [
		[0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
	],
    "sol" => [
		[0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
	]
);
$json = json_encode($array);
file_put_contents("../games/${rand}l.json", $json);

header('Content-type: application/json; charset=utf-8');
echo json_encode(['loomid' => $rand]);