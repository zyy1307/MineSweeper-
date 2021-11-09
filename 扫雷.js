const ul = document.querySelector('.sweepers');

function init() {
    for (let i = 0; i < 99; i++) {
        let span = document.createElement('span');
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

window.onload = function() {
    // 初始化
    init();
    getRandomMine(0, 100);
    const grid = ul.children;
    // 铺好雷
    mineArr.forEach((val) => grid[val].innerHTML = "雷");
    // 计算每个格子旁边的雷数量
    grid.forEach((val, index) => {
        // 检验是否undefine，累加+-1,9,10,11格子中的雷数量
        let sum = 0;
        // 不为零时，把数量写在格子里
        if (sum != 0) {
            val.innerHTML = sum;
        }
    })
}