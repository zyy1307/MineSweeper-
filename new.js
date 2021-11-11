window.onload = function() {
    // 所有全局变量
    const ul = document.querySelector('.sweepers');
    const smile = document.querySelector('.smile');
    let count = 10;
    const counter = document.querySelectorAll('.timer')[0];
    // 格子的当前行列值:number type
    let r;
    let c;
    // 九宫格
    let checkMine = [];
    // 二维数组
    let rows = [];
    // 随机雷
    let mineArr = new Set();
    // 所有函数
    // 获得随机数
    function getRandomMine(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // 铺雷
    function putMines() {
        // 生成随机雷
        while (mineArr.size != 10) {
            // 生成行、列两个随机数
            let arr = [getRandomMine(0, 9), getRandomMine(0, 9)];
            mineArr.add(arr);
        }
        // 铺好雷
        mineArr.forEach((val) => rows[val[0]][val[1]].setAttribute('isMine', 1));
        return mineArr;
    }
    // 获得九宫格列表
    function getCheckMine(y, x) {
        // 头列
        if (x == 0) {
            checkMine = [
                [y, x + 1],
                [y - 1, x + 1],
                [y - 1, x],
                [y + 1, x],
                [y + 1, x + 1]
            ];
        }
        // 尾列
        else if (x == rows.length - 1) {
            checkMine = [
                [y, x - 1],
                [y - 1, x - 1],
                [y - 1, x],
                [y + 1, x],
                [y + 1, x - 1]
            ];
        } else {
            checkMine = [
                [y, x + 1],
                [y, x - 1],
                [y - 1, x + 1],
                [y - 1, x],
                [y - 1, x - 1],
                [y + 1, x],
                [y + 1, x + 1],
                [y + 1, x - 1]
            ];
        }
        return checkMine;
    };
    // 递归检查
    function recur(r, c) {
        // 拿到这个格子周围九宫格的坐标
        // 给当前这个格子打标签
        if (!rows[r][c].getAttribute('checked')) {
            rows[r][c].setAttribute('checked', 1);
        }
        getCheckMine(r, c);
        // 迭代九宫格:val是一个包含横纵坐标的数组
        for (let k = 0; k < checkMine.length; k++) {
            let val = checkMine[k];
            // 处理头行尾行的情况，少看一行
            if (val[0] < 0 || val[0] > rows.length - 1) {
                return;
            }
            // 检查附近的雷有没有标错，标错了游戏结束
            // 为了这个检查条件，所有的都要绑flag和isMine
            if (rows[val[0]][val[1]].getAttribute('flag') != rows[val[0]][val[1]].getAttribute('isMine')) {
                mineArr.forEach((v) => rows[v[0]][v[1]].innerHTML = '❤');
                // 变成哭脸
                smile.innerHTML = '😢';
                return;
            }
            // 如果这个格子周围有雷，递归停止，且显示雷的数量
            else if (rows[val[0]][val[1]].getAttribute('mineNum') != 0) {
                // 不递归的就不打标签了
                return rows[val[0]][val[1]].innerHTML = rows[val[0]][val[1]].getAttribute('mineNum');

            } else {
                // 如果这个格子没有雷，那么应该基于这个格子继续扩散迭代九宫格
                // 这个格子检查过了就直接退出
                if (rows[val[0]][val[1]].getAttribute('checked')) {
                    return;
                }
                // 没有的话再递归周围
                // 为了避免循环，给check过的打个标签吧
                rows[val[0]][val[1]].setAttribute('checked', 1);
                recur(val[0], val[1]);
            }
        }
    }
    // 生成二维数组
    for (let i = 0; i < 10; i++) {
        let cols = [];
        for (let j = 0; j < 10; j++) {
            let span = document.createElement('span');
            span.setAttribute('index', i * 10 + j);
            span.setAttribute('flag', 0);
            // 默认都不是雷
            span.setAttribute('isMine', 0);
            span.setAttribute('rows', i);
            span.setAttribute('cols', j);
            // 左键
            span.addEventListener('click', function() {
                // 如果踩到雷
                if (this.getAttribute('isMine') == 1) {
                    // 游戏结束
                    // 所有雷暴露
                    mineArr.forEach((v) => rows[v[0]][v[1]].innerHTML = '❤');
                    // 变成哭脸
                    smile.innerHTML = '😢';
                } else if (this.innerHTML == this.getAttribute('mineNum')) {
                    r = parseInt(this.getAttribute('rows'));
                    c = parseInt(this.getAttribute('cols'));
                    recur(r, c);
                } else if (this.getAttribute('mineNum') != 0) {
                    this.innerHTML = this.getAttribute('mineNum');
                } else {
                    //递归翻开,拿到当前行列值
                    r = parseInt(this.getAttribute('rows'));
                    c = parseInt(this.getAttribute('cols'));
                    // 传入递归函数
                    recur(r, c);
                }
            });
            // 右键
            span.addEventListener('mousedown', function(e) {
                if (e.button == 2) {
                    if (this.getAttribute('flag') == 1) {
                        this.setAttribute('flag', 0);
                        this.innerHTML = '';
                        count++;
                        if (count == 10) {
                            counter.innerHTML = '0' + count;
                        } else { counter.innerHTML = '00' + count; }

                    } else {
                        if (count <= 10 && count > 0) {
                            this.setAttribute('flag', 1);
                            this.innerHTML = '🚩';
                            count--;
                            counter.innerHTML = '00' + count;
                        }
                        return;
                    }
                }
            })
            cols.push(span);
            ul.appendChild(span);
        }
        rows.push(cols);
    }
    // 雷区内阻止右键默认事件
    ul.oncontextmenu = function(event) {
        event.preventDefault();
    };
    // 重置游戏
    smile.addEventListener('click', function() { window.location.reload(true) });
    // 铺好雷
    putMines();
    // 统计周围雷-迭代数组
    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[0].length; x++) {
            // 计算每个格子旁边的雷数量
            // 本身不为雷的才需要检验
            if (rows[y][x].getAttribute('isMine') != 1) {
                // 声明一个变量统计雷的数量
                let sum = 0;
                // 需要检查的列表
                getCheckMine(y, x);
                checkMine.forEach((val) => {
                        // 头行和尾行处理完了
                        if (val[0] < 0 || val[0] > rows.length - 1) {
                            return;
                        }
                        // 此格有雷
                        if (rows[val[0]][val[1]].getAttribute('isMine') == 1) {
                            sum++;
                        }
                    })
                    // 定义一个标签记录它周围雷的数量
                if (rows[y][x] != undefined) {
                    rows[y][x].setAttribute('mineNum', sum);
                }
            }
        }
    }
}