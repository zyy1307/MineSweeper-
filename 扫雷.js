const ul = document.querySelector('.sweepers');
// grid是对象，不能用数组方法
const grid = ul.children;
const smile = document.querySelector('.smile');
let count = 10;
const counter = document.querySelectorAll('.timer')[0];
const timerScreen = document.querySelectorAll('.timer')[1];


function init(num) {
    for (let i = 0; i < num; i++) {
        let span = document.createElement('span');
        span.setAttribute('index', i);
        // flag默认0
        span.setAttribute('flag', 0);
        // 所有格子在生成的时候就绑上监听事件
        span.addEventListener('click', function() {
            // 如果踩到雷
            if (this.getAttribute('isMine') == 1) {
                // 游戏结束
                // 所有雷暴露
                mineArr.forEach((val) => {
                    grid[val].innerHTML = '❤';
                });
                // 变成哭脸
                smile.innerHTML = '😢';
                // 清除定时器
                clearInterval(gameTime);
            } else {
                // 翻开函数
                if (this.getAttribute('mineNum') != 0) {
                    this.innerHTML = this.getAttribute('mineNum');
                }
            }
        });
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
        ul.appendChild(span);
    }
}
// 生成不重复的随机数-雷在哪个格子里
// 因为不重复，所以用set
let mineArr = new Set();

function getRandomMine(min, max) {
    let mine;
    // 生成10个数，放进一个数组
    while (mineArr.size !== 10) {
        mine = Math.floor(Math.random() * (max - min + 1)) + min;
        mineArr.add(mine);
    }
    return mineArr;
}

function checkMines() {
    // 计算每个格子旁边的雷数量
    for (k in grid) {
        // 检验是否undefine，累加+-1,9,10,11格子中的雷数量
        // 本身不为雷的才需要检验
        k = parseInt(k);
        if (!mineArr.has(k)) {
            // 声明一个变量统计雷的数量
            let sum = 0;
            // 需要检查的列表
            let checkMine = [];
            // 头列
            if (k % 10 == 0) {
                checkMine = [k + 1, k - 9, k - 10, k + 10, k + 11];
            }
            // 尾列
            else if ((k + 1) % 10 == 0) {
                checkMine = [k - 11, k - 10, k - 1, k + 10, k + 9];
            } else {
                checkMine = [k - 1, k + 1, k + 9, k - 9, k - 10, k + 10, k - 11, k + 11];
            }
            checkMine.forEach((val) => {
                    // 头行和尾行处理完了
                    if (val < 0 || val > 99) {
                        return;
                    }
                    // 此格有雷
                    if (mineArr.has(val)) {
                        sum++;
                    }
                })
                // 定义一个标签记录它周围雷的数量
            if (grid[k] != undefined) {
                grid[k].setAttribute('mineNum', sum);
            }
        }
    }

}
window.onload = function() {
    // 在雷区中阻止默认右键情况
    ul.oncontextmenu = function(event) {
        event.preventDefault();
    };
    // 初始化
    init(100);
    getRandomMine(0, 99);
    // 铺好雷
    mineArr.forEach((val) => grid[val].setAttribute('isMine', 1));
    checkMines();
    smile.addEventListener('click', function() { window.location.reload(true) });
    let timeCount = 0;
    var gameTime;
    // ul.addEventListener('click', function() {
    //         clearInterval(gameTime);
    //         gameTime = setInterval(function() {
    //             timeCount++;
    //             timerScreen.innerHTML = timeCount;
    //         }, 1000);
    //     })
    // 左键点击-周围八个都空白就放开
    function checkBlank() {
        checkMines();
        if (sum == 0) {
            checkMine.forEach((val) => {
                if (val < 0 || val > 99) {
                    return;
                } else {}
            })
        } else {

        }
    }
    // 双击-雷错就死
    // 双击-对的放开

}