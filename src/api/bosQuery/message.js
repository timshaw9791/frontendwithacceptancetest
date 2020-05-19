export var message = {
    "jpql": "select ms from Message ms where ms.userId = ?1 order by ms.newStar desc, ms.status desc, ms.createTime desc",
    "returnType": "ARRAY",
    "params": [
        JSON.parse(localStorage.getItem('user')).id
    ]
}