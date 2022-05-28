const mongoose = require('mongoose');

// Membuat Schema
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    //todo Apabila hanya membutuhkan tipe data maka bisa juga dituliskan seperti nohp : String 
    nohp: {
        type: String,
    },
})

module.exports = {
    Contact
}