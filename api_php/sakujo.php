<?php
// Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') exit;

//ここからメイン

//削除処理
$games = glob("../games/*l.json");
$lid = $_GET['loid'];
if (empty($games)){
}else{
    $i = 0;
	while($i < count($games) && substr($games[$i],9,4) != $lid){
        $i++;
	}
    if($i < count($games)){
        unlink($games[$i]);
    }
}

header('Content-type: application/json; charset=utf-8');
echo json_encode("end");