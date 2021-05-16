let err = 0;
let turn = 0;
let pnum = 0;
let kati = 0;
let shoin = 0;
let hajimete = 0;
let tustop = 0;
let tyokuretu = 0;
let stcount = 0;
let komas = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
let sol = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let lood_game_interval;

function stopg() { clearInterval(lood_game_interval); }

function startg() {
    lood_game_interval = setInterval(function() {
        if (tyokuretu == 0) {
            tyokuretu = 1;
            if (tustop == 0) {
                $.ajax({
                    type: "GET",
                    url: "./api_php/gaming.php",
                    crossDomain: false,
                    dataType: "json",
                    data: {
                        loid: loomid,
                        pnum: pnum,
                    },
                }).done(function(data) {
                    if (tustop == 0) {
                        console.log(data);
                        if (data.turn == 442) {
                            stopg();
                            alert("切断されました。");
                            window.location.reload();
                        }
                        if (turn != pnum) {
                            if (pnum == data.turn) {
                                turn = data.turn;
                                komas = data.koma;
                                sol = data.sol;
                                byoga();
                                document.getElementById("loading").style.display = "none";
                                document.getElementById("bokasi").style.display = "none";
                                document.getElementById("waiting").style.display = "none";
                            }
                        }
                        if (data.kati != 0) {
                            document.getElementById("bokasi").style.display = "block";
                            kati = data.kati;
                            shoin = data.shoin;
                            shuryo();
                        }
                    }
                }).fail();
            }
            tyokuretu = 0;
        }
        tustop = 0;
    }, 1927);
}

function touryo() {
    if (window.confirm('投了します。よろしいですか？')) {
        if (loomid == 0) {
            shoin = 1;
            if (turn == 1) {
                kati = 2;
            } else if (turn == 2) {
                kati = 1;
            }
            shuryo();
        } else if (turn == pnum) {
            shoin = 1;
            if (turn == 1) {
                kati = 2;
            } else if (turn == 2) {
                kati = 1;
            }
            $.ajax({
                type: "POST",
                url: "./api_php/uketori.php",
                crossDomain: false,
                dataType: "json",
                data: {
                    loid: loomid,
                    kati: kati,
                    shoin: shoin,
                },
            }).done().fail();
            shuryo();
        }
    }
}

function shuryo() {
    stopg();
    if (kati == 0) {
        window.location.reload();
    } else {
        console.log("勝敗が決定しました");
        let a = "有象無象";
        let b = "有象無象";
        if (loomid == 0) {
            document.getElementById("offver").style.display = "block";
            if (kati == 1) {
                a = "P2";
                b = "P1";
            } else {
                a = "P1";
                b = "P2";
            }
        } else {
            if (kati == pnum) {
                document.getElementById("kati").style.display = "block";
                a = "相手";
                b = "あなた";
            } else {
                document.getElementById("make").style.display = "block";
                a = "あなた";
                b = "相手";
            }
        }
        if (shoin == 1) {
            document.getElementById("kshousai").textContent = `${a}が投了したので${b}の勝利です。`;
            document.getElementById("kekka").style.display = "block";
        } else if (shoin == 2) {
            document.getElementById("kshousai").textContent = `${b}の駒が５つ並んだので${b}の勝利です。`;
            setTimeout(function() {
                document.getElementById("kekka").style.display = "block";
            }, 2000);
        }
    }
}

function koma_click(ele) {
    let id = Number(ele.id.slice(-2));
    let posy = ((id - id % 10) / 10) - 1;
    let posx = (id % 10) - 1;
    console.log(`${posx + 1}:${posy + 1}`)
    document.getElementById("bokasi").style.display = "block";
    console.log(`turn:${turn}`);
    if (loomid == 0) {
        shori(posx, posy);
        if (err == 0) {
            turn++;
            if (turn > 2) turn = 1;
            console.log("ターンを変更しました");
        }
        if (kati == 0) {
            document.getElementById("bokasi").style.display = "none";
        }
    } else if (turn == pnum) {
        tustop = 1;
        shori(posx, posy);
        if (err == 0) {
            turn++;
            if (turn > 2) turn = 1;
            console.log("ターンを変更しました");
            document.getElementById("bokasi").style.display = "block";
            if (kati == 0) {
                document.getElementById("waiting").style.display = "block";
            }
            let ca = 1;
            while (ca == 1) {
                ca = 0;
                $.ajax({
                    type: "POST",
                    url: "./api_php/uketori.php",
                    crossDomain: false,
                    dataType: "json",
                    data: {
                        loid: loomid,
                        kati: kati,
                        shoin: shoin,
                        turn: turn,
                        koma: komas,
                        sol: sol,
                    },
                }).done(function(data) {
                    if (data.turn != turn || data.kati != kati || data.shoin != shoin) {
                        ca = 1;
                        console.log("再度通信");
                    }
                    turn = data.turn;
                    komas = data.koma;
                    sol = data.sol;
                    if (turn != pnum) {
                        document.getElementById("bokasi").style.display = "block";
                        document.getElementById("waiting").style.display = "block";
                    }
                }).fail(function(data) {
                    ca = 1;
                });
            }
        } else {
            if (turn == pnum) {
                document.getElementById("bokasi").style.display = "none";
            }
        }
    }
    tustop = 1;
    byoga();
    tustop = 1;
}

function byoga() {
    for (let y = 0; y < 9; ++y) {
        for (let x = 0; x < 9; ++x) {
            document.getElementById(`k${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#dddddd";
            document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#dddddd";
            document.getElementById(`k${String(y + 1)}${String(x + 1)}`).style.border = "solid 1px #dddddd";
            if (sol[x][y] > 1) {
                sol[x][y] = 1;
            }
            if (komas[x][y] == 1) {
                document.getElementById(`k${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#ffffff";
                document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#ffffff";
                document.getElementById(`k${String(y + 1)}${String(x + 1)}`).style.border = "solid 1px #aaaaaa";
                if (sol[x][y] == 1) {
                    document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#464646";
                } else {
                    document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#ffffff";
                }
            } else if (komas[x][y] == 2) {
                document.getElementById(`k${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#464646";
                document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#464646";
                document.getElementById(`k${String(y + 1)}${String(x + 1)}`).style.border = "solid 1px #aaaaaa";
                if (sol[x][y] == 1) {
                    document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#ffffff";
                } else {
                    document.getElementById(`s${String(y + 1)}${String(x + 1)}`).style.backgroundColor = "#464646";
                }
            }
        }
    }
}

function shori(posx, posy) {
    err = 0;
    let backup = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    for (let ssy = 0; ssy < 9; ++ssy) {
        for (let ssx = 0; ssx < 9; ++ssx) {
            backup[ssx][ssy] = komas[ssx][ssy];
        }
    }
    let teki = 0;
    if (turn == 1) teki = 2;
    if (turn == 2) teki = 1;
    let shouri = 0;

    if (backup[posx][posy] == turn && sol[posx][posy] == 0) {
        sol[posx][posy] = 1;
        console.log("アップしました");
    } else if (backup[posx][posy] == 0) {
        let hikkuri = 0;
        let a;
        let b;
        let x;
        let y;
        let v;
        let z;

        //左上（１）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx - b;
            y = posy - b;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx - b;
                y = posy - b;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //上（２）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx;
            y = posy - b;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx;
                y = posy - b;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //右上（３）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx + b;
            y = posy - b;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx + b;
                y = posy - b;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //左（４）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx - b;
            y = posy;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx - b;
                y = posy;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //右（５）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx + b;
            y = posy;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx + b;
                y = posy;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //左下（６）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx - b;
            y = posy + b;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx - b;
                y = posy + b;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //下（７）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx;
            y = posy + b;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx;
                y = posy + b;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }

        //右下（８）
        a = 0;
        b = 1;
        x = 0;
        y = 0;
        v = 0;
        z = 0;
        while (a == 0) {
            //↓ここだけ変える
            x = posx + b;
            y = posy + b;
            //↑ここだけ！！
            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                if (backup[x][y] == turn) {
                    a = 1;
                    if (v == 1) {
                        err = 1;
                        return;
                    } else if (b > 1) {
                        z = 1;
                    };
                } else if (backup[x][y] == 0) {
                    a = 1;
                    z = 0;
                } else if (backup[x][y] == teki && sol[x][y] != 0) {
                    v = 1;
                }
            } else {
                a = 1;
                z = 0;
            }
            b++;
        }
        if (z == 1) {
            a = 0;
            b = 1;
            hikkuri = 1;
            while (a == 0) {
                //↓ここだけ変える
                x = posx + b;
                y = posy + b;
                //↑ここだけ！！
                if (backup[x][y] == turn) {
                    a = 1;
                } else {
                    backup[x][y] = turn;
                }
                b++;
            }
        }
        backup[posx][posy] = turn;
        if (turn == 2 && hajimete == 0) {
            sol[posx][posy] = 1;
            hajimete = 1;
        }

        let ka = 0;
        let kb = 1;
        x = 0;
        y = 0;
        for (let ky = 0; ky < 9; ++ky) {
            for (let kx = 0; kx < 9; ++kx) {
                if (backup[kx][ky] == turn) {
                    for (let kz = 1; kz < 9; ++kz) {
                        ka = 0;
                        kb = 1;
                        while (ka == 0) {
                            ka = 1;
                            switch (kz) {
                                case 1:
                                    x = kx - kb;
                                    y = ky - kb;
                                    break;
                                case 2:
                                    x = kx;
                                    y = ky - kb;
                                    break;
                                case 3:
                                    x = kx + kb;
                                    y = ky - kb;
                                    break;
                                case 4:
                                    x = kx - kb;
                                    y = ky;
                                    break;
                                case 5:
                                    x = kx + kb;
                                    y = ky;
                                    break;
                                case 6:
                                    x = kx - kb;
                                    y = ky + kb;
                                    break;
                                case 7:
                                    x = kx;
                                    y = ky + kb;
                                    break;
                                case 8:
                                    x = kx + kb;
                                    y = ky + kb;
                                    break;
                            }
                            if (x >= 0 && y >= 0 && x < 9 && y < 9) {
                                if (backup[x][y] == turn) {
                                    ka = 0;
                                }
                            }
                            kb++;
                        }
                        if (kb > 5) {
                            shouri = 1;
                        }
                    }
                }
            }
        }

        if (hikkuri == 1 && shouri == 1) {
            console.log("置けません");
            err = 1;
        } else if (shouri == 1) {
            //勝ったときの処理
            console.log("勝ちました");
            kati = turn;
            shoin = 2;
            shuryo();
        } else {
            if (hikkuri == 1) {
                console.log("ひっくり返しました");
            } else {
                console.log("駒を置きました");
            }
        }
    } else {
        err = 1;
    }
    if (err == 0) {
        komas = backup;
    }
}