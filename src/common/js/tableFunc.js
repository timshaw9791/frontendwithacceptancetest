function sumFunc(param) { // 表格合并行计算方法
    let {columns, data} = param, sums;
    sums = new Array(columns.length).fill('')
    sums[0] = '合计'
    sums[columns.length - 1] = data.reduce(
        (accumulator, currentValue) =>
         !!currentValue.count ? accumulator + parseInt(currentValue.count) : accumulator
        , 0)
    return sums;
}

function delRow(data, index, callback) {
    data.splice(index, 1);
    callback && callback();
}

export {sumFunc, delRow}