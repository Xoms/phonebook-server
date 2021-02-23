# Phonebook API
## routes

- POST /api/contacts/ - creates new contact with provided body (multipart/form-data)
{
    name: string, required
    surname: string, required
    phone: string, required
    description: string
    avatar: file (mime image/*)
}

- GET /api/contacts - returns array of contacts 

[
    {
        _id: string
        name: string
        surname: string
        phone: string
        description?: string
        avatarURL?: string
        __v: number
    }
]

- PATCH /api/contacts/:id - updates existing contact with _id === id, field are the same as in POST but not required,
returns modified contact

- DELETE /api/contacts/:id - deletes existing contact with _id === id, returns nothing (status 200)

## Stack

- NodeJs + Express
- MongoDB + mongoose
- Multer, imagemin
- joi validations
- Cloudinary storage https://cloudinary.com/

