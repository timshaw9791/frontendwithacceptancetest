/*根据报废单的category生成enumContent*/
function transScrapCategory(data) {
    switch (data.category) {
        case 0: {
            data.categoryContent = '维修报废'
            break
        }
        case 1: {
            data.categoryContent = '到期报废'
            break
        }
        case 2: {
            data.categoryContent = '盘点报废'
            break
        }
        case 3: {
            data.categoryContent = '常规报废'
            break
        }
    }
    return data;
}

export default transScrapCategory