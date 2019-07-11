var t = {
    "role": {
        "message": "Role should be defined",
        "name": "ValidatorError",
        "properties": {
            "message": "Role should be defined",
            "type": "required",
            "path": "role",
            "value": ""
        },
        "kind": "required",
        "path": "role",
        "value": ""
    }
}

Object.keys(t).map(k=>{
console.log(t[k].message)
})