
let attr = {
    'UserID':14,
    'CreatedAt':'12/12/2024 09:09:09 AM',
    'Address':'450 Theodore St, San Marcos, CA 91912',
    'Email':'fake4@mail.com',
    'DateJoined':'12/12/2024',
    'Logged':false,
    'CredentialID':13141297
}

/* attr = {
    'id':123234987,
    'created_at':'Some data that',
    'value':"Some Value WOWWWW!"
}*/

let user = new User()
user.SetAttributes(attr)
//let res = user.Create()
let res = user.Delete()
console.log(res)