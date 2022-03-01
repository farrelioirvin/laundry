const express = require("express")
const app = express()
const md5 = require("md5")
app.use(express.json())

const models = require("../models/index")
const users = models.users

//panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

app.get("/", async (request,response) => {
    let dataUsers = await users.findAll()

    return response.json(dataUsers)
})
app.post("/", (request,response) => {
    let newUsers = {
        nama: request.body.nama,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }
    users.create(newUsers)
    .then(result => {
        return response.json({
            message: `Data berhasil ditambahakan`,
            result: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint update users
app.put("/:id_user", (request,response) => {
    let data = {
        nama: request.body.nama,
        username: request.body.username,
        role: request.body.role
    }
    if (request.body.password) {
        data.password = md5(request.body.password)
    }
    let parameter = {
        id_user: request.params.id_user
    }

    //proses update
    users.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: 'Data berhasil diubah',
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint hapus data user
app.delete("/:id_user", (request,response) => {
    //tampung data yang akan dihapus
    let parameter = {
        id_user: request.params.id_user
    }

    //proses hapus 
    users.destroy({where: parameter})
    .then(result => {
        return response.json({
            message: 'Data berhasil dihapus'
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app