const mongoose = require('mongoose');

// Menggunakan ip address local mongodb yaitu 127.0.0.1:27017
mongoose.connect('mongodb://127.0.0.1:27017/node_contact', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Membuat Schema
// const Contact = mongoose.model('Contact', {
//     nama: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
/////    todo Apabila hanya membutuhkan tipe data maka bisa juga dituliskan seperti nohp : String 
//     nohp: {
//         type: String,
//     },
// })

//* Mengisi collection contact 
// const contact1 = new Contact({
//     nama: 'Muhammad Lazuardi Timur',
//     nohp: '081212121212',
//     email: 'lazuardit21@gmail.com',
// });
// const contact2 = new Contact({
//     nama: 'Lazuardi Akbar Rahmawan',
//     nohp: '083434343434',
//     email: 'Akbar@gmail.com',
// });
// const contact3 = new Contact({
//     nama: 'Bhima Endra Wira Yudha',
//     nohp: '085656456565',
//     email: 'Bhima@gmail.com',
// });


//* Menyimpan ke collection 
// contact3.save().then((contact) => console.log(contact));