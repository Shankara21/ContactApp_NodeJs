// Requirement
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const chalk = require('chalk');
const {
    Contact
} = require('./models/contact');
require('./utils/db');
const {
    body,
    validationResult,
    check
} = require('express-validator');
const methodOverride = require('method-override');

// Setup Application
const app = express();
const port = 3000;
app.use(methodOverride('_method'));

// Setup Flash
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.use(cookieParser('secret'));
app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

// Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

const intro = chalk `{bold.italic {red A}{blue p}{yellow p}{green l}{white i}{cyan c}{magenta a}{red t}{yellow i}{blue o}{green n} {cyan b}{yellow y} {red S}{blue h}{yellow a}{green n}{red k}{magenta a}{blue r}{yellow a}{green 2}1}`
const message = chalk `{bold {blue Mongo} {magenta Contact} {white App} {red |} {yellow.bold listening {red at} {italic.green http://localhost:${port}}}}`

//!  Routing

//? Halaman Index 
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        nama: 'Shankara',
        umur: '20',
        alamat: 'Jl. Kebon Jeruk No.1',
        layout: 'layouts/main'
    })
})

//? Halaman About
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main',
        title: 'About',
    });
})

//? Halaman Contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render('contact', {
        title: 'Contact',
        layout: 'layouts/main',
        contacts,
        msg: req.flash('msg')
    });
})

//? Halaman Create
app.get('/contact/create', (req, res) => {
    res.render('create', {
        layout: 'layouts/main',
        title: 'Create',
    });
})

//? Create Data
app.post('/contact',
    //todo Melakukan process validasi pada inputan user
    [
        check('email', 'Email yang anda masukkan tidak valid!').isEmail(),
        check('nohp', 'Nomor yang anda masukkan tidak valid!').isMobilePhone('id-ID'),
        body('nama').custom(async (value) => {
            const duplicate = await Contact.findOne({
                nama: value
            })
            if (duplicate) {
                throw new Error('Nama yang anda masukkan sudah ada!');
            }
            return true;
        })
    ],
    (req, res) => {
        //todo Mengambil error dari express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('create', {
                layout: 'layouts/main',
                errors: errors.array(),
                title: 'Create',
            })
        } else {
            Contact.insertMany(req.body, (err) => {
                req.flash('msg', 'Data berhasil ditambahkan!');
                res.redirect('/contact');
            })
        }
    })

//? Delete Data
app.delete('/contact', async (req, res) => {
    await Contact.deleteOne({
        nama: req.body.nama
    })
    req.flash('msg', 'Contact deleted');
    res.redirect('/contact');
})

//? Halaman Edit
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({
        nama: req.params.nama
    });
    res.render('edit', {
        layout: 'layouts/main',
        contact,
        title: 'Edit'
    });
})

//? Update Data 
app.put(
    '/contact',
    // Melakukan process validasi pada inputan user
    [
        check('email', 'Email yang anda masukkan tidak valid!').isEmail(),
        check('nohp', 'Nomor yang anda masukkan tidak valid!').isMobilePhone('id-ID'),
        body('nama').custom(async (value, {
            req
        }) => {
            const duplicate = await Contact.findOne({
                nama: value
            });
            if (value !== req.body.oldNama && duplicate) {
                throw new Error('Nama yang anda masukkan sudah ada!');
            }
            return true;
        })
    ],
    (req, res) => {
        // Mengambil error dari express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('edit', {
                layout: 'layouts/main',
                errors: errors.array(),
                contact: req.body,
                title: 'Edit'
            })
        } else {
            Contact.updateOne({
                _id: req.body._id
            }, {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp
                }
            }).then((result) => {
                req.flash('msg', 'Data berhasil diubah!');
                res.redirect('/contact');
            })
        }
    })

//? Halaman Detail
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({
        nama: req.params.nama
    })
    res.render('details', {
        layout: 'layouts/main',
        contact,
        title: 'Details'
    });
})

//! Processing 
app.listen(port, () => {
    console.log(intro);
    console.log(message);
})