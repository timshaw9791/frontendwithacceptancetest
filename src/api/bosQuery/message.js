let userJSON = JSON.parse(localStorage.getItem('user')),
    userId = userJSON && userJSON.id || '1';
export var message = {
    "jpql": "select ms from Message ms where ms.userId = ?1 order by ms.newStar desc, ms.status desc, ms.createTime desc",
    "returnType": "ARRAY",
    "params": [
        userId
    ]
}