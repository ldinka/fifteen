var x_size = 4;
var y_size = 4;
var tile_matrix  = [];
var step_counter = 0;
window.onload = Init;
var counter_steps = 0;

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

    var right_columns = [];
    for (var x = 0; x < x_size; x++) {
        right_columns[x] = [];
        for (var y = 0; y < y_size; y++) {
            right_columns[x][y] =  right_matrix[y][x];
        }
    }
    window.right_columns = right_columns;

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
        //tile_matrix = [[1, 2, 3, 4], [5, 6, 0, 7], [9, 10, 12, 8], [13, 14, 11, 15]];
        //tile_array  = [ 1, 2, 3, 4,   5, 6, 0, 7,   9, 10, 12, 8,   13, 14, 11, 15];
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
    var x_space = window.space.x;
    var y_space = window.space.y;
    var limit = getHeuristic(tile_matrix);
    var array_path;
    do {
        array_path = getSolution(limit, [], cloneMatrix(tile_matrix), y_space, x_space);
        limit++;
    }
    while (!array_path);
    console.log(array_path);
    /*var x_space = window.space.x;
    var y_space = window.space.y;

    var current_heuristic = getHeuristic(tile_matrix);
    var best_heuristic = current_heuristic;
    var best_tile;

    console.log("tile_matrix", tile_matrix);
    console.log("current_heuristic", current_heuristic);

    if (x_space > 0) {
        console.log("left", tile_matrix[y_space][x_space-1]);
        var new_matrix = cloneMatrix(tile_matrix);
        new_matrix[y_space][x_space] = tile_matrix[y_space][x_space-1];
        new_matrix[y_space][x_space-1] = 0;
        console.log("left_matrix", new_matrix);
        var left_heuristic = getHeuristic(new_matrix);
        console.log("left_heuristic", left_heuristic);
        if (left_heuristic <= best_heuristic) {
            best_heuristic = left_heuristic;
            best_tile = window.tiles[y_space][x_space-1];
        }
    }
    if (x_space < x_size-1) {
        console.log("right", tile_matrix[y_space][x_space+1]);
        var new_matrix = cloneMatrix(tile_matrix);
        new_matrix[y_space][x_space] = tile_matrix[y_space][x_space+1];
        new_matrix[y_space][x_space+1] = 0;
        console.log("right_matrix", new_matrix);
        var right_heuristic = getHeuristic(new_matrix);
        console.log("right_heuristic", right_heuristic);
        if (right_heuristic <= best_heuristic) {
            best_heuristic = right_heuristic;
            best_tile = window.tiles[y_space][x_space+1];
        }
    }
    if (y_space > 0) {
        console.log("up", tile_matrix[y_space-1][x_space]);
        var new_matrix = cloneMatrix(tile_matrix);
        new_matrix[y_space][x_space] = tile_matrix[y_space-1][x_space];
        new_matrix[y_space-1][x_space] = 0;
        console.log("up_matrix", new_matrix);
        var up_heuristic = getHeuristic(new_matrix);
        console.log("up_heuristic", up_heuristic);
        if (up_heuristic <= best_heuristic) {
            best_heuristic = up_heuristic;
            best_tile = window.tiles[y_space-1][x_space];
        }
    }
    if (y_space < y_size-1) {
        console.log("down", tile_matrix[y_space+1][x_space]);
        var new_matrix = cloneMatrix(tile_matrix);
        new_matrix[y_space][x_space] = tile_matrix[y_space+1][x_space];
        new_matrix[y_space+1][x_space] = 0;
        console.log("down_matrix", new_matrix);
        var down_heuristic = getHeuristic(new_matrix);
        console.log("down_heuristic", down_heuristic);
        if (down_heuristic <= best_heuristic) {
            best_heuristic = down_heuristic;
            best_tile = window.tiles[y_space+1][x_space];
        }
    }*/
}

function getSolution(limit, array_path, matrix, y_space, x_space) {
    if (++counter_steps > 10000000) {
        return array_path;
    }

    var steps = array_path.length;
    var best_heuristic;
    var best_coords;
    if (x_space > 0) {
        var new_matrix = cloneMatrix(matrix);
        var new_array_path = array_path.slice(0);
        new_matrix[y_space][x_space] = matrix[y_space][x_space-1];
        new_matrix[y_space][x_space-1] = 0;
        var left_heuristic = getHeuristic(new_matrix);
        if (left_heuristic == 0) {
            new_array_path.push(new_matrix[y_space][x_space]);
            return new_array_path;
        }
        left_heuristic += steps;
        if (left_heuristic <= limit) {
            new_array_path.push(new_matrix[y_space][x_space]);
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space, x_space-1);
            if (solution_path) {
                return solution_path;
            } else {
                new_matrix = [];
                new_array_path = [];
            }
        }
    }
    if (x_space < x_size-1) {
        var new_matrix = cloneMatrix(matrix);
        var new_array_path = array_path.slice(0);
        new_matrix[y_space][x_space] = matrix[y_space][x_space+1];
        new_matrix[y_space][x_space+1] = 0;
        var right_heuristic = getHeuristic(new_matrix);
        if (right_heuristic == 0) {
            new_array_path.push(new_matrix[y_space][x_space]);
            return new_array_path;
        }
        right_heuristic += steps;
        if (right_heuristic <= limit) {
            new_array_path.push(new_matrix[y_space][x_space]);
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space, x_space+1);
            if (solution_path) {
                return solution_path;
            } else {
                new_matrix = [];
                new_array_path = [];
            }
        }
    }
    if (y_space > 0) {
        var new_matrix = cloneMatrix(matrix);
        var new_array_path = array_path.slice(0);
        new_matrix[y_space][x_space] = matrix[y_space-1][x_space];
        new_matrix[y_space-1][x_space] = 0;
        var up_heuristic = getHeuristic(new_matrix);
        if (up_heuristic == 0) {
            new_array_path.push(new_matrix[y_space][x_space]);
            return new_array_path;
        }
        up_heuristic += steps;
        if (up_heuristic <= limit) {
            new_array_path.push(new_matrix[y_space][x_space]);
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space-1, x_space);
            if (solution_path) {
                return solution_path;
            } else {
                new_matrix = [];
                new_array_path = [];
            }
        }
    }
    if (y_space < y_size-1) {
        var new_matrix = cloneMatrix(matrix);
        var new_array_path = array_path.slice(0);
        new_matrix[y_space][x_space] = matrix[y_space+1][x_space];
        new_matrix[y_space+1][x_space] = 0;
        var down_heuristic = steps + getHeuristic(new_matrix);
        if (down_heuristic == 0) {
            new_array_path.push(new_matrix[y_space][x_space]);
            return new_array_path;
        }
        down_heuristic += steps;
        if (down_heuristic <= limit) {
            new_array_path.push(new_matrix[y_space][x_space]);
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space+1, x_space);
            if (solution_path) {
                return solution_path;
            } else {
                new_matrix = [];
                new_array_path = [];
            }
        }
    }
}

function getHeuristic(matrix) {
    var coords_matrix = window.coords_matrix;
    var right_columns = window.right_columns;
    var manhattan_distance = 0;
    var linear_conflict = 0;
    var linear_conflicts = [];
    var corner_conflict = 0;
    var last_move = 0;
    for (var y = 0; y < y_size; y++) {
        for (var x = 0; x < y_size; x++) {
            var value = matrix[y][x];
            var y_home = coords_matrix[value][0];
            var x_home = coords_matrix[value][1];
            manhattan_distance += Math.abs(x_home - x) + Math.abs(y_home - y);

            if (x >= y && value > 1) {
                if (y == y_home) {
                    var right_row = right_matrix[y_home];
                    for (var z = x; z < x_size; z++) {
                        var conflict_value = matrix[y_home][z];
                        if (conflict_value != 0 && conflict_value < value && inArray(conflict_value, right_row)) {
                            //console.log("conflict: ", value, conflict_value);
                            linear_conflict += 2;
                            linear_conflicts.push(conflict_value, value);
                        }
                    }
                }
                if (x == x_home) {
                    var right_column = right_columns[x_home];
                    for (var z = y; z < y_size; z++) {
                        var conflict_value = matrix[z][x_home];
                        if (conflict_value != 0 && conflict_value < value && inArray(conflict_value, right_column)) {
                            //console.log("conflict: ", value, conflict_value);
                            linear_conflict += 2;
                            linear_conflicts.push(conflict_value, value);
                        }
                    }
                }
            }

            /*if ((value == right_matrix[y_size-2][x_size-1] && y != y_size-1)
                ||
                (value == right_matrix[y_size-1][x_size-2] && x != x_size-1)) {
                last_move++;
                //console.log("last_move: ", value);
            }*/
        }
    }
    if (matrix[0][1] == right_matrix[0][1] &&
        matrix[1][0] == right_matrix[1][0] &&
        matrix[0][0] != right_matrix[0][0] &&
        !inArray(matrix[0][1], linear_conflicts) &&
        !inArray(matrix[1][0], linear_conflicts)) {
        corner_conflict += 2;
    }
    if (matrix[0][x_size-2] == right_matrix[0][x_size-2] &&
        matrix[1][x_size-1] == right_matrix[1][x_size-1] &&
        matrix[0][x_size-1] != right_matrix[0][x_size-1] &&
        !inArray(matrix[0][x_size-2], linear_conflicts) &&
        !inArray(matrix[1][x_size-1], linear_conflicts)) {
        corner_conflict += 2;
    }
    if (matrix[y_size-2][0] == right_matrix[y_size-2][0] &&
        matrix[y_size-1][1] == right_matrix[y_size-1][1] &&
        matrix[y_size-1][0] != right_matrix[y_size-1][0] &&
        !inArray(matrix[y_size-2][0], linear_conflicts) &&
        !inArray(matrix[y_size-1][1], linear_conflicts)) {
        corner_conflict += 2;
    }
    //console.log("manhattan_distance: ", manhattan_distance);
    //console.log("linear_conflict: ", linear_conflict);
    //console.log("corner_conflict: ", corner_conflict);
    var heuristic = manhattan_distance + linear_conflict + corner_conflict;
    /*if (heuristic > 0 && last_move == 2) {
        //console.log("last_move: ", last_move);
        heuristic += 2;
    }*/
    //console.log("heuristic: ", heuristic);
    return heuristic;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function cloneMatrix(matrix) {
    var m_length = matrix.length;
    var new_matrix = [];
    for (var i = 0; i < m_length; i++) {
        new_matrix[i] = matrix[i].slice(0);
    }
    return new_matrix;
}
















