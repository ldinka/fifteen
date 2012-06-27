var wait_minutes = 10; // Время ожидания, минуты

//var user_matrix = [[1, 2, 3, 4], [5, 6, 0, 7], [9, 10, 12, 8], [13, 14, 11, 15]]; // имеет решение
//var user_matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 15, 14, 0]]; // не имеет решение

var x_size = 4;
var y_size = 4;
var tile_matrix  = [];
var step_counter = 0;
window.onload = Init;
var counter_steps = 0;

function Init() {
    document.getElementById("new_game").onclick = function(){
        newGame("click");
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

    newGame("init");
}

function newGame(act) {
    document.getElementById("found_solution").innerHTML = "";
    document.getElementById("play_solution").style.display = "none";
    var right_array = window.right_array;
    var user_matrix = window.user_matrix || false;

    if (user_matrix && act == "init") {
        var tile_array = [];
        for (var y = 0; y < y_size; y++) {
            for (var x = 0; x < x_size; x++) {
                tile_array.push(user_matrix[y][x]);
            }
        }
    } else {
        var tile_array = right_array.slice(0);
        shuffle(tile_array);
    }

    window.tile_array = tile_array;
    var check_solution = checkSolution(tile_array);
    if (check_solution == 0 && user_matrix && act == "init") {
        alert("Матрица не имеет решения");
    }
    if (check_solution == 0 && (!user_matrix || act == "click")) {
            newGame(); // если нет решения
    } else {
        if (user_matrix && act == "init") {
            tile_matrix = user_matrix;
        } else {
            for (var y = 0; y < y_size; y++) {
                tile_matrix[y] =  tile_array.slice(y * x_size, (y + 1) * x_size);
            }
        }
        var tiles = [];
        var coords_matrix = [];
        var tile_value_matrix = [];
        for (var y = 0, k = 0; y < y_size; y++) {
            tiles[y] = [];
            for (var x = 0; x < x_size; x++, k++) {
                if (k + 1 == x_size * y_size) {
                    coords_matrix[0] = [y, x];
                } else {
                    coords_matrix[k + 1] = [y, x];
                }
                var value = tile_array[k];
                tile_value_matrix[value] = [y, x];
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
        window.tile_value_matrix = tile_value_matrix;
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
        setTimeout(function(){alert("Победа!")}, 750);
    }
}

function shuffle(arr) {
    var rand_var, temp_var, arr_length = arr.length;
    for (var i = 0; i < arr_length; i++) {
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
    if (checkSolution(window.tile_array)) {
        document.getElementById("please_wait").style.display = "block"
        setTimeout(function(){
            var x_space = window.space.x;
            var y_space = window.space.y;
            var limit = getHeuristic(tile_matrix);
            var array_path;
            var time_start = new Date().valueOf() * 0.001;
            var gone_time = 0;
            do {
                array_path = getSolution(limit, [], cloneMatrix(tile_matrix), y_space, x_space);
                limit++;
                gone_time = new Date().valueOf() * 0.001 - time_start;
                console.log("limit: ", limit, ", time: ", gone_time);
            }
            while (!array_path && gone_time < wait_minutes * 60);
            console.log(array_path);
            console.log(new Date().valueOf() * 0.001 - time_start);
            document.getElementById("please_wait").style.display = "none"
            if (array_path) {
                document.getElementById("found_solution").innerHTML = "Решение: " + array_path.toString() + " (" + array_path.length + " ходов)";
                var play_solution = document.getElementById("play_solution");
                play_solution.style.display = "inline-block"
                play_solution.onclick = function(){playSolution(array_path)};
            } else {
                document.getElementById("found_solution").innerHTML = "Слишком сложная комбинация";
            }
        }, 10);
    } else {
        alert("Игра не имеет решения");
    }
}

function getSolution(limit, array_path, matrix, y_space, x_space) {
    var steps = array_path.length;
    var last_value;
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
        if (left_heuristic <= limit && new_matrix[y_space][x_space] != new_array_path[steps-1]) {
            new_array_path.push(new_matrix[y_space][x_space]);
            last_value = new_matrix[y_space][x_space];
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space, x_space-1);
            if (solution_path) {
                return solution_path;
            }
        }
        new_matrix = [];
        new_array_path = [];
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
        if (right_heuristic <= limit && new_matrix[y_space][x_space] != new_array_path[steps-1]) {
            new_array_path.push(new_matrix[y_space][x_space]);
            last_value = new_matrix[y_space][x_space];
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space, x_space+1);
            if (solution_path) {
                return solution_path;
            }
        }
        new_matrix = [];
        new_array_path = [];
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
        if (up_heuristic <= limit && new_matrix[y_space][x_space] != new_array_path[steps-1]) {
            new_array_path.push(new_matrix[y_space][x_space]);
            last_value = new_matrix[y_space][x_space];
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space-1, x_space);
            if (solution_path) {
                return solution_path;
            }
        }
        new_matrix = [];
        new_array_path = [];
    }
    if (y_space < y_size-1) {
        var new_matrix = cloneMatrix(matrix);
        var new_array_path = array_path.slice(0);
        new_matrix[y_space][x_space] = matrix[y_space+1][x_space];
        new_matrix[y_space+1][x_space] = 0;
        var down_heuristic = getHeuristic(new_matrix);
        if (down_heuristic == 0) {
            new_array_path.push(new_matrix[y_space][x_space]);
            return new_array_path;
        }
        down_heuristic += steps;
        if (down_heuristic <= limit && new_matrix[y_space][x_space] != new_array_path[steps-1]) {
            new_array_path.push(new_matrix[y_space][x_space]);
            last_value = new_matrix[y_space][x_space];
            var solution_path = getSolution(limit, new_array_path, new_matrix, y_space+1, x_space);
            if (solution_path) {
                return solution_path;
            }
        }
        new_matrix = [];
        new_array_path = [];
    }
}

function getHeuristic(matrix) {
    var coords_matrix = window.coords_matrix;
    var right_columns = window.right_columns;
    var manhattan_distance = 0;
    var linear_conflict = 0;
    var linear_conflicts = [];
    var corner_conflict = 0;
    for (var y = 0; y < y_size; y++) {
        for (var x = 0; x < y_size; x++) {
            var value = matrix[y][x];
            if (value > 0) {
                var y_home = coords_matrix[value][0];
                var x_home = coords_matrix[value][1];
                manhattan_distance += Math.abs(x_home - x) + Math.abs(y_home - y);

                if (x >= y && value > 1) {
                    if (y == y_home) {
                        var right_row = right_matrix[y_home];
                        for (var z = x; z < x_size; z++) {
                            var conflict_value = matrix[y_home][z];
                            if (conflict_value != 0 && conflict_value < value && inArray(conflict_value, right_row)) {
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
                                linear_conflict += 2;
                                linear_conflicts.push(conflict_value, value);
                            }
                        }
                    }
                }
            }
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
    if (matrix[y_size-2][x_size-1] == right_matrix[y_size-2][x_size-1] &&
        matrix[y_size-1][x_size-2] == right_matrix[y_size-1][x_size-2] &&
        matrix[y_size-1][x_size-1] != right_matrix[y_size-1][x_size-1] &&
        !inArray(matrix[y_size-2][0], linear_conflicts) &&
        !inArray(matrix[y_size-1][1], linear_conflicts)) {
        corner_conflict += 2;
    }
    var heuristic = manhattan_distance + linear_conflict + corner_conflict;
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

function playSolution(solution_path) {
    document.getElementById("play_solution").style.display = "none";
    var solution_length = solution_path.length;
    var i = 0;
    var play_solution = window.setInterval(function(){
        if (i < solution_path.length) {
            playIteration(solution_path, i);
            i++;
        } else {
            window.clearInterval(play_solution);
        };
    }, 750);
}

function playIteration(solution_path, i){
    var value = solution_path[i];
    var tile_y = tile_value_matrix[value][0];
    var tile_x = tile_value_matrix[value][1];
    var space_y = tile_value_matrix[0][0];
    var space_x = tile_value_matrix[0][1];
    moveTile(window.tiles[tile_y][tile_x], window.tiles[space_y][space_x]);
    tile_value_matrix[value] = [space_y, space_x];
    tile_value_matrix[0] = [tile_y, tile_x];
}



















