/*
* 对于表的一些通用方法
* */

function sumFunc(param) { // 表合计行的方法 只在最后一行有效
    let {columns, data} = param, sums;
    sums = new Array(columns.length).fill('')
    sums[0] = '合计'
    sums[columns.length - 1] = data.reduce(
        (accumulator, currentValue) =>
         !!currentValue.count ? accumulator + parseInt(currentValue.count) : accumulator
        , 0)
    return sums;
}

function delRow(data, index, callback) { // 表删除行的方法
    data.splice(index, 1);
    callback && callback();
}

export {sumFunc, delRow}