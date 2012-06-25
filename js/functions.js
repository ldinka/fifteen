var x_size = 4;
var y_size = 4;
var tile_matrix  = [];
var step_counter = 0;
window.onload = Init;

function Init() {
    document.getElementById("new_game").onclick = function(){
        newGame();
        step_counter = 0;
        document.getElementById("step_counter").innerHTML = step_counter;
    };
    document.getElementById("find_solution").onclick = function(){
        findSolution();
    };
    var array_length = x_size * y_size - 1;
    var right_array = [];
    for (var i = 0; i < array_length; i++) {
        right_array[i] = i + 1;
    }
    right_array[array_length] = 0;
    window.right_array  = right_array;

    var right_matrix = [];
    for (var y = 0; y < y_size; y++) {
        right_matrix[y] =  right_array.slice(y * x_size, (y + 1) * x_size);
    }
    window.right_matrix = right_matrix;

    newGame();
}

function newGame() {
    var right_array = window.right_array;
    var tile_array = right_array.slice(0);
    shuffle(tile_array);
    if (checkSolution(tile_array) == 0) {
        newGame(); // если нет решения
    } else {
        for (var y = 0; y < y_size; y++) {
            tile_matrix[y] =  tile_array.slice(y * x_size, (y + 1) * x_size);
        }
        var tiles = [];
        var coords_matrix = [];
        for (var y = 0, k = 0; y < y_size; y++) {
            tiles[y] = [];
            for (var x = 0; x < x_size; x++, k++) {
                if (k + 1 == x_size * y_size) {
                    coords_matrix[0] = [y, x];
                } else {
                    coords_matrix[k + 1] = [y, x];
                }
                var value = tile_array[k];
                var tile = document.getElementById("position_" + (k + 1));
                tile.x = x;
                tile.y = y;
                tile.value = value;
                if (tile.value == 0) {
                    tile.innerHTML = "";
                    tile.setAttribute("class", "space");
                    window.space = tile;
                } else {
                    tile.innerHTML = value;
                    tile.setAttribute("class", "");
                }
                tiles[y][x] =  tile;
                tile.onclick = function(){checkTile(this)};
            }
        }
        window.tiles = tiles;
        window.coords_matrix = coords_matrix;
    }
}

function checkTile(tile) {
    var tiles = window.tiles;
    var x = tile.x;
    var y = tile.y;
    if (y > 0 && tiles[y-1][x].value == 0) {
        moveTile(tile, tiles[y-1][x]);
    } else if (x < x_size-1 && tiles[y][x+1].value == 0) {
        moveTile(tile, tiles[y][x+1]);
    } else if (y < y_size-1 && tiles[y+1][x].value == 0) {
        moveTile(tile, tiles[y+1][x]);
    } else if (x > 0 && tiles[y][x-1].value == 0) {
        moveTile(tile, tiles[y][x-1]);
    }
    window.tiles = tiles;
}

function moveTile(tile, space) {
    var x_old = tile.x;
    var y_old = tile.y;
    var value = tile.value;
    var x_new = space.x;
    var y_new = space.y;
    tile_matrix[y_old][x_old] = 0;
    tile_matrix[y_new][x_new] = value;
    tile.value = 0;
    tile.innerHTML = "";
    tile.setAttribute("class", "space");
    window.space = tile;
    space.value = value;
    space.innerHTML = value;
    space.setAttribute("class", "");
    stepCounter();
    window.last_moved_value = value;
    if (tile_matrix.toString() == window.right_matrix.toString()) {
        alert("Победа!");
    }
}

function shuffle(arr)
{
    var rand_var, temp_var, arr_length = arr.length;
    for (i = 0; i < arr_length; i++) {
        rand_var = parseInt(Math.random() * i);
        temp_var = arr[i];
        arr[i] = arr[rand_var];
        arr[rand_var] = temp_var;
    }
    return arr;
}

function stepCounter() {
    step_counter++;
    document.getElementById("step_counter").innerHTML = step_counter;
}

function checkSolution(tile_array) {
    var array_length = tile_array.length;
    var check_sum = 0;
    var space_position;
    for (var i = 0; i < array_length; i++) {
        var cur_val = tile_array[i];
        if (cur_val != 0) {
            for (var j = i + 1; j < array_length; j++) {
                if (cur_val > tile_array[j] && tile_array[j] != 0) {
                    check_sum++;
                }
            }
        } else {
            space_position = i;
        }
    }
    var row_number = Math.ceil((1 + space_position) / x_size);
    check_sum += row_number;
    if (check_sum % 2 == 0) {
        return 1;
    } else {
        return 0;
    }
}

function findSolution() {
    var coords_matrix = window.coords_matrix;
    var x = window.space.x;
    var y = window.space.y;
    var good_list = [];
    var bad_list = [];
    if (x > 0) {
        var tile1 = window.tiles[y][x-1];
        var t1_old_dis = Math.abs(y - coords_matrix[tile1.value][0]) +
                         Math.abs(x - coords_matrix[tile1.value][1] - 1);
        var t1_new_dis = Math.abs(y - coords_matrix[tile1.value][0]) +
                         Math.abs(x - coords_matrix[tile1.value][1]);
        if (t1_new_dis <= t1_old_dis) {
            good_list.push([t1_new_dis, tile1]);
        } else {
            bad_list.push([t1_old_dis, tile1]);
        }



        console.log(tile1.value + ": " + t1_old_dis + "->" + t1_new_dis);
    }
    if (x < x_size - 1) {
        var tile2 = window.tiles[y][x+1];
        var t2_old_dis = Math.abs(y - coords_matrix[tile2.value][0]) +
                         Math.abs(x - coords_matrix[tile2.value][1] + 1);
        var t2_new_dis = Math.abs(y - coords_matrix[tile2.value][0]) +
                         Math.abs(x - coords_matrix[tile2.value][1]);
        if (t2_new_dis <= t2_old_dis) {
            good_list.push([t2_new_dis, tile2]);
        } else {
            bad_list.push([t2_old_dis, tile2]);
        }


        console.log(tile2.value + ": " + t2_old_dis + "->" + t2_new_dis);
    }
    if (y > 0) {
        var tile3 = window.tiles[y-1][x];
        var t3_old_dis = Math.abs(y - coords_matrix[tile3.value][0] - 1) +
                         Math.abs(x - coords_matrix[tile3.value][1]);
        var t3_new_dis = Math.abs(y - coords_matrix[tile3.value][0]) +
                         Math.abs(x - coords_matrix[tile3.value][1]);
        if (t3_new_dis <= t3_old_dis) {
            good_list.push([t3_new_dis, tile3]);
        } else {
            bad_list.push([t3_old_dis, tile3]);
        }


        console.log(tile3.value + ": " + t3_old_dis + "->" + t3_new_dis);
    }
    if (y < y_size - 1) {
        var tile4 = window.tiles[y+1][x];
        var t4_old_dis = Math.abs(y - coords_matrix[tile4.value][0] + 1) +
                         Math.abs(x - coords_matrix[tile4.value][1]);
        var t4_new_dis = Math.abs(y - coords_matrix[tile4.value][0]) +
                         Math.abs(x - coords_matrix[tile4.value][1]);
        if (t4_new_dis <= t4_old_dis) {
            good_list.push([t4_new_dis, tile4]);
        } else {
            bad_list.push([t4_old_dis, tile4]);
        }


        console.log(tile4.value + ": " + t4_old_dis + "->" + t4_new_dis);
    }

    var g_length = good_list.length;
    var the_best;
    if (g_length > 1 || (g_length == 1 && good_list[0].value != window.last_moved_value)) {
        the_best = good_list[0];
        if (g_length > 1) {
            for (var i = 1; i < g_length; i++) {
                if (good_list[i][0] > the_best[0]) {
                    the_best = good_list[i];
                }
            }
        }
    } else {
        var b_length = bad_list.length;
        the_best = bad_list[0];
        if (b_length > 1) {
            for (var i = 1; i < b_length; i++) {
                console.log("bad", the_best[i].value, window.last_moved_value);
                if (bad_list[i][0] < the_best[0] && the_best[i].value != window.last_moved_value) {
                    the_best = bad_list[i];
                }
            }
        }
    }

    console.log(the_best[1].value, window.last_moved_value);
    if (the_best[1]) {
        moveTile(the_best[1], window.space);
    }
    console.log(the_best);

    console.log(good_list);
    console.log(bad_list);
}





















