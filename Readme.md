(POST) => http://localhost:4000/api/users/signup

{
   "firstName": "Rama",
   "lastName": "Qattam",
   "password": "123",
   "phoneNumber": "+962780780133",
   "profileImage": "https://example.com/image.jpg",
   "address": {
       "street": "Main Street",
       "city": "Amman",
       "state": "Amman",
       "zipCode": "11181",
       "country": "Jordan"
   }
}


(POST) => http://localhost:4000/api/users/signin
{
   "phoneNumber": "+962780780133",
   "password": "123"
}


(GET) => http://localhost:4000/api/users
error (401) {
    "message": "Authorization token required"
}
then we have a Headers:
Authorization: Bearer JWT_TOKEN_HERE



(PATCH)=>http://localhost:4000/api/users/:userId
TO UPDATE DATA
Headers:
Authorization: Bearer JWT_TOKEN_HERE

Body → form-data:
firstName: UpdatedName
profileImage: newImage


(DELETE) =>http://localhost:3000/api/users/:userId
Headers:
Authorization: Bearer JWT_TOKEN_HERE


(PATCH) =>http://localhost:3000/api/users/:userId
TO ACTIVATE USER
Headers:
Authorization: Bearer JWT_TOKEN_HERE (admin)
The result:
 {
    "message": "User activated successfully"
}
  

  





