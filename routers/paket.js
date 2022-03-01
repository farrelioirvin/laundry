const { response, request, application } = require("express")
const express = require("express")
const app = express()

// membaca request dari body dengan tipe json
app.use(express.json())

// panggil models
const models = require("../models/index")

// panggil model "paket"
const paket = models.paket

//panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

// endpoint for get all paket
app.get("/", async (request,response) => {
    let dataPaket = await paket.findAll()

    return response.json(dataPaket)
})

// endpoint add new paket
app.post("/", (request,response) => {
    let newPaket = {
        jenis_paket : request.body.jenis_paket,
        harga: request.body.harga
    }
    paket.create(newPaket)
    .then(result => {
        return response.json({
            message: 'Data Berhasil Ditambahkan'
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

// endpoint update data paket
app.put("/:id_paket", (request,response) => {
    // tampung data yang akan diubah
    let dataPaket = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }

    let parameter = {
        id_paket: request.params.id_paket
    }

    // proses update
    paket.update(dataPaket, {where: parameter})
    .then(result => {
        return response.json({
            message: 'Data Berhasil Diubah',
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

// endpoint hapus data paket
app.delete("/:id_paket", (request,response) => {
    // tampung data yang akan dihapus
    let parameter = {
        id_paket: request.params.id_paket
    }

    // proses hapus
    paket.destroy({where: parameter})
    .then(result => {
        return response.json({
            message: 'Data Berhasil Dihapus'
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app