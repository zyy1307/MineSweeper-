window.onload = function() {
    // 所有全局变量
    const ul = document.querySelector('.sweepers');
    const smile = document.querySelector('.smile');
    // 剩余雷的数量
    let count = 10;
    const counter = document.querySelectorAll('.timer')[0];
    // 计时器
    let timeCount = 0;
    let gameTime;
    const timerScreen = document.querySelectorAll('.timer')[1];
    // 格子的当前行列值:number type
    let r;
    let c;
    // 九宫格
    let checkMine = [];
    // 二维数组
    let rows = [];
    // 随机雷
    let mineArr = [];
    // 所有函数
    // 获得随机数
    function getRandomMine(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // 铺雷
    function putMines() {
        // 生成随机雷
        while (mineArr.length != 10) {
            let ind = getRandomMine(0, 99);
            if (mineArr.indexOf(ind) == -1) {
                mineArr.push(ind);
            }
        }
        console.log(mineArr);
        // 铺好雷
        mineArr.forEach((val) => {
            ul.children[val].setAttribute('isMine', 1);
        });
        return mineArr;
    }
    // 获得九宫格列表
    function getCheckMine(y, x) {
        // 头列
        if (x == 0) {
            checkMine = [
                [y - 1, x],
                [y - 1, x + 1],
                [y, x + 1],
                [y + 1, x],
                [y + 1, x + 1]
            ];
        }
        // 尾列
        else if (x == rows.length - 1) {
            checkMine = [
                [y - 1, x - 1],
                [y - 1, x],
                [y, x - 1],
                [y + 1, x - 1],
                [y + 1, x]
            ];
        } else {
            checkMine = [
                [y - 1, x - 1],
                [y - 1, x],
                [y - 1, x + 1],
                [y, x - 1],
                [y, x + 1],
                [y + 1, x - 1],
                [y + 1, x],
                [y + 1, x + 1]
            ];
        }
        return checkMine;
    };

    function recur(r, c) {
        // 拿到当前行列值，写在函数外面
        // r = parseInt(this.getAttribute('rows'));
        // c = parseInt(this.getAttribute('cols'));
        // 拿到这个格子周围九宫格的坐标
        rows[r][c].setAttribute('open', 1);
        rows[r][c].className = 'mousedown';
        getCheckMine(r, c);
        let arr = [];
        for (let k = 0; k < checkMine.length; k++) {
            let val = checkMine[k]; // 迭代九宫格:val是一个包含横纵坐标的数组
            let cur; //cur是当前格子
            if (val[0] >= 0 && val[0] <= rows.length - 1) { //检查是否合法，剔除头列尾列
                cur = rows[val[0]][val[1]];
                if (cur.getAttribute('mineNum') != 0 && cur.getAttribute('isMine') == 0) {
                    cur.setAttribute('open', 1); //只要合法就打开
                    cur.className = 'mousedown';
                    cur.innerHTML = cur.getAttribute('mineNum');
                } else if (cur.getAttribute('flag') == 0 && cur.getAttribute('isMine') == 0 && cur.getAttribute('open') == 0) {
                    cur.className = 'mousedown';
                    cur.setAttribute('open', 1); //打开再递归
                    arr.push([val[0], val[1]]);
                }
            }
        }
        arr.forEach((val) => {
            recur(val[0], val[1]);
        }); //成功了 我哭了 不过估计要再优化
    }
    // 统计周围雷-迭代数组
    function setMineAttr() {
        // 双层循环整个数组
        for (let y = 0; y < rows.length; y++) {
            for (let x = 0; x < rows[0].length; x++) {
                // 本身不为雷
                if (rows[y][x].getAttribute('isMine') != 1) {
                    // 声明一个变量统计雷的数量：局部变量，绑好在属性上就行
                    let sum = 0;
                    // 得到需要检查的列表九宫格
                    getCheckMine(y, x);
                    checkMine.forEach((val) => { //迭代九宫格
                            // 头行和尾行溢出则返回
                            if (val[0] < 0 || val[0] > rows.length - 1) {
                                return;
                            }
                            // 此格有雷，总数+1
                            if (rows[val[0]][val[1]].getAttribute('isMine') == 1) {
                                sum++;
                            }
                        })
                        // 定义一个标签记录它周围雷的数量
                    rows[y][x].setAttribute('mineNum', sum);
                }
            }
        }
    }
    //  计时器函数
    function handler() {
        gameTime = setInterval(function() {
            timeCount++;
            timerScreen.innerHTML = timeCount;
        }, 1000);
        ul.removeEventListener('click', handler);
    }
    // 失败状态函数
    function defeat() {
        mineArr.forEach((v) => ul.children[v].innerHTML = '❤');
        smile.innerHTML = '😢';
        let sI = document.querySelectorAll('.init');
        let sM = document.querySelectorAll('.mousedown');
        sI.forEach((val) => {
            val.removeEventListener('mousedown', lrclick);
            val.removeEventListener('mouseup', upLeft);
        });
        sM.forEach((val) => {
            val.removeEventListener('mousedown', lrclick);
            val.removeEventListener('mouseup', upLeft);
        });
        alert('你失败了,要请我吃谭鸭血');
        clearInterval(gameTime);
    }

    function lrclick(e) {
        // 左键
        if (e.button == 0) {
            if (this.getAttribute('flag') == 1) { return; } //已经插旗，就直接禁用左键事件了
            if (this.getAttribute('open') == 0) {
                this.className = 'mousedown';
                this.setAttribute('open', 1);
                // 雷，失败
                if (this.getAttribute('isMine') == 1) {
                    defeat();
                } else if (this.getAttribute('mineNum') != 0) {
                    this.innerHTML = this.getAttribute('mineNum');
                } else { //此时说明minesum==0，需要递归检查
                    r = parseInt(this.getAttribute('rows'));
                    c = parseInt(this.getAttribute('cols'));
                    recur(r, c);
                }
            } else { //已经被打开的情况
                if (this.getAttribute('minenum') != 0) { //等于0就不管了
                    r = parseInt(this.getAttribute('rows'));
                    c = parseInt(this.getAttribute('cols'));
                    getCheckMine(r, c);
                    let flagNum = 0; //统计当前flag数量
                    checkMine.forEach((val) => {
                        let cur; //cur是当前格子
                        if (val[0] >= 0 && val[0] <= rows.length - 1) {
                            cur = rows[val[0]][val[1]];
                        }
                        if (cur != undefined && cur.getAttribute('flag') == 1) {
                            flagNum++;
                        } else if (cur != undefined && cur.getAttribute('open') == 0) {
                            cur.className = 'mousedown';
                        }
                    })
                    if (flagNum != 0 && this.getAttribute('mineNum') == flagNum) {
                        checkMine.forEach((val) => {
                            let cur; //cur是当前格子
                            if (val[0] >= 0 && val[0] <= rows.length - 1) { cur = rows[val[0]][val[1]]; }
                            if (cur != undefined && cur.getAttribute('isMine') != cur.getAttribute('flag')) {
                                defeat();
                            } else if (cur != undefined && cur.getAttribute('open') == 0 && cur.getAttribute('flag') == 0 && cur.getAttribute('isMine') == 0) {
                                if (cur.getAttribute('mineNum') != 0) {
                                    cur.innerHTML = cur.getAttribute('mineNum');
                                    cur.setAttribute('open', 1);
                                    cur.className = 'mousedown';
                                } else {
                                    recur(val[0], val[1]);
                                }
                            }
                        });
                    }
                }
                success();
            }
        } else if (e.button == 2) { // 右键
            if (this.getAttribute('open') == 1) {
                return;
            } else {
                if (this.getAttribute('flag') == 1) {
                    this.innerHTML = '';
                    this.setAttribute('flag', 0);
                    // 撤销棋子，剩余雷数量++
                    // 最多添10面旗，只要保证添旗合法，不会超过
                    count++;
                    if (count == 10) {
                        counter.innerHTML = '0' + count;
                    } else { counter.innerHTML = '00' + count; }
                } else { //没被open也没被flag过,即将添旗
                    if (count > 0) { //检验剩余雷数量是否合法
                        this.setAttribute('flag', 1);
                        this.innerHTML = '🚩';
                        count--;
                        counter.innerHTML = '00' + count;
                    } else { return; } //剩余雷数量等于0个，不准添旗
                }
            }
        }
    }
    // 监听mouseup事件
    function upLeft(e) {
        if (e.button == 0) {
            r = parseInt(this.getAttribute('rows'));
            c = parseInt(this.getAttribute('cols'));
            getCheckMine(r, c);
            checkMine.forEach((val) => {
                let cur;
                if (val[0] >= 0 && val[0] <= rows.length - 1) {
                    cur = rows[val[0]][val[1]];
                }
                if (cur != undefined && cur.getAttribute('open') == 0) {
                    cur.className = 'init';
                }
            })
        }
    }
    // 监听成功事件:所有非雷方格都被打开
    function success() {
        const grid = ul.children;
        for (let k = 0; k < grid.length; k++) {
            if (grid[k].getAttribute('isMine') == grid[k].getAttribute('open')) {
                return;
            }
        }
        alert('哟！你赢了！');
        clearInterval(gameTime);
        smile.innerHTML = '😎';
        mineArr.forEach((v) => ul.children[v].innerHTML = '🚩');
        let sI = document.querySelectorAll('.init');
        let sM = document.querySelectorAll('.mousedown');
        sI.forEach((val) => {
            val.removeEventListener('mousedown', lrclick);
            val.removeEventListener('mouseup', upLeft);
        });
        sM.forEach((val) => {
            val.removeEventListener('mousedown', lrclick);
            val.removeEventListener('mouseup', upLeft);
        });
    }
    // 目前只用一次的upTab初始化：禁止右键、计数器函数、笑脸重置
    ul.oncontextmenu = function(event) {
        event.preventDefault();
    };
    ul.addEventListener('click', handler);
    smile.addEventListener('click', function() { window.location.reload(true) });
    // 初始化生成雷区并铺好雷：
    for (let i = 0; i < 10; i++) {
        let cols = [];
        for (let j = 0; j < 10; j++) {
            let span = document.createElement('span');
            span.className = 'init';
            // 绑好属性
            span.setAttribute('index', i * 10 + j);
            span.setAttribute('rows', i);
            span.setAttribute('cols', j);
            span.setAttribute('flag', 0);
            // 是否被打开过
            span.setAttribute('open', 0);
            span.setAttribute('isMine', 0);
            // 绑好点击事件
            span.addEventListener('mousedown', lrclick);
            span.addEventListener('mouseup', upLeft);
            // 设置好就放入雷区
            cols.push(span);
            ul.appendChild(span);
        }
        rows.push(cols);
    }
    //生成雷铺好雷：绑上雷属性和周围雷的数量
    putMines();
    setMineAttr();
}