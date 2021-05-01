let loomid = 0;
let ganow = 0;
let looms = [];

window.onload = function(){
    let weblocal = location.href.substring(0,4);
    console.log(weblocal);
    if(weblocal == "http"){
        console.log("web connecting");
        $.ajax({
            type: "GET",
            url: "./loadloom.php",
            crossDomain: false,
            dataType : "json",
        }).done(function(data){
            let parent = document.getElementById('looms');
            while(parent.lastChild){
                parent.removeChild(parent.lastChild);
            }
            let loom;
            looms = data;
            for (let i = 0; i < looms.length; ++i) {
                loom = looms[i]
                $("#looms").prepend(`<div id="l${loom}" class="button" onclick="join_loom(this)"><p class="num">${loom}に参加</p></div>`);
            }
        }).fail();
        setInterval(function(){
            looms = [];
            $.ajax({
                type: "GET",
                url: "./loadloom.php",
                crossDomain: false,
                dataType : "json",
            }).done(function(data){
                let parent = document.getElementById('looms');
                while(parent.lastChild){
                    parent.removeChild(parent.lastChild);
                }
                let loom;
                looms = data;
                for (let i = 0; i < looms.length; ++i) {
                    loom = looms[i]
                    $("#looms").prepend(`<div id="l${loom}" class="button" onclick="join_loom(this)"><p class="num">${loom}に参加</p></div>`);
                }
            }).fail();
        }, 1500);
    }else{
        console.log("local running");
        let parent = document.getElementById('looms');
        while(parent.lastChild){
            parent.removeChild(parent.lastChild);
        }
        document.getElementById("nlo").style.display = "none" ;
    }
}


function new_loom() {
    document.getElementById("loading").style.display = "block" ;
    document.getElementById("bokasi").style.display = "block" ;
    $.ajax({
        type: "GET",
        url: "./newgame.php",
        crossDomain: false,
        dataType : "json",
    }).done(function(data){
        ganow = 1;
        pnum = 1;
        loomid = data.loomid;
        document.getElementById("loading").style.display = "none" ;
        //document.getElementById("bokasi").style.display = "none" ;
        document.getElementById("select").style.display = "none" ;
        document.getElementById("waiting").style.display = "block" ;
        document.getElementById("lnum").textContent = `ID:${loomid}`
        document.getElementById("waitaa").textContent = "対戦相手を待っています"
        console.log(`${loomid}を作成しました`);
        startwm();
    }).fail();
};

function join_loom(ele) {
    let lid = Number(ele.id.slice(-4));
    document.getElementById("loading").style.display = "block" ;
    document.getElementById("bokasi").style.display = "block" ;
    $.ajax({
        type: "GET",
        url: "./joingame.php",
        crossDomain: false,
        dataType : "json",
        data: {
            loid: lid,
        },
    }).done(function(data){
        if(data.aa == 0){
            alert('エラーが発生しました。');
            window.location.reload();
        }
        ganow = 1;
        pnum = 2;
        loomid = lid;
        document.getElementById("loading").style.display = "none" ;
        document.getElementById("select").style.display = "none" ;
        document.getElementById("waiting").style.display = "block" ;
        document.getElementById("lnum").textContent = `ID:${lid}`
        console.log(`${loomid}に入室しました`);
        startg();
    }).fail();
}

function offline() {
        ganow = 1;
        turn = 1;
        document.getElementById("loading").style.display = "none" ;
        document.getElementById("bokasi").style.display = "none" ;
        document.getElementById("select").style.display = "none" ;
        document.getElementById("lnum").textContent = ""
        console.log(`ゲームを開始しました。`);
}

function restart(){
    window.location.reload();
}

let waitinngmatch;
function stopwm(){clearInterval(waitinngmatch);}
function startwm(){waitinngmatch=setInterval(() =>{
	$.ajax({
		type: "GET",
		url: "./gaming.php",
		crossDomain: false,
        dataType : "json",
		data: {
            loid: loomid,
			pnum: pnum,
        },
	}).done(function(data){
		if(data.turn == 442){
			stopwm();
			alert("切断されました。");
			window.location.reload();
		}else if(data.turn > 0){
			document.getElementById("loading").style.display = "none" ;
			document.getElementById("bokasi").style.display = "none" ;
			document.getElementById("select").style.display = "none" ;
			document.getElementById("waiting").style.display = "none" ;
            document.getElementById("waitaa").textContent = "相手の行動を待っています"
            console.log("相手が入室しました")
			stopwm();
            turn = 1;
			startg();
		}
	}).fail();
},1477);}
