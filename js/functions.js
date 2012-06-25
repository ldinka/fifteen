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
    console.log(right_matrix);
    newGame();
}

function newGame() {
    var right_array = window.right_array;
    var tile_array = right_array.slice(0);
    shuffle(tile_array);
    if (checkSolution(tile_array) == 0) {
        newGame(); // если нет решения
    }
    for (var y = 0; y < y_size; y++) {
        tile_matrix[y] =  tile_array.slice(y * x_size, (y + 1) * x_size);
    }
    console.log(tile_array);
    //tile_array  = [ 13,10,11,6,  5,7,4,8,  1,12,14,9,  3,15,2,0];
    //tile_matrix = [[13,10,11,6],[5,7,4,8],[1,12,14,9],[3,15,2,0]];
    //checkSolution(tile_array);
    var tiles = [];
    for (var y = 0, k = 0; y < y_size; y++) {
        tiles[y] = [];
        for (var x = 0; x < x_size; x++, k++) {
            var value = tile_array[k];
            var tile = document.getElementById("position_" + (k + 1));
            tile.x = x;
            tile.y = y;
            tile.value = value;
            if (tile.value == 0) {
                tile.innerHTML = "";
                tile.setAttribute("class", "space");
            } else {
                tile.innerHTML = value;
                tile.setAttribute("class", "");
            }
            tiles[y][x] =  tile;
            tile.onclick = function(){checkTile(this)};
        }
    }
    window.tiles = tiles;
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
    space.value = value;
    space.innerHTML = value;
    space.setAttribute("class", "");
    stepCounter();
    //console.log(tile_matrix);
    //console.log(window.right_matrix);
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
    for (var i = 0; i < array_length; ++i) {
        var cur_val = tile_array[i];
        if (cur_val != 0) {
            for (var j = i + 1; j < array_length; ++j) {
                if (cur_val > tile_array[j] && tile_array[j] != 0) {
                    ++check_sum;
                }
            }
        } else {
            space_position = i;
        }
    }
    var row_number = Math.floor(1 + space_position / x_size);
    check_sum += row_number;
    console.log((check_sum - row_number) + " + " + row_number + " = " +  check_sum);
    return 1;
    if (check_sum % 2 == 0) {
        return 1;
    } else {
        return 0;
    }
}























