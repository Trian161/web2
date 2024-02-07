const express = require('express')
const router = express.Router();
const books = require('../controllers/book')
const Book = require('../models/book')
const catchAsync = require('../utils/CatchAsync')
const {isLoggedIn , validateBook , ValidateOwner} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(books.index))
    .post(isLoggedIn, upload.array('images'), validateBook, catchAsync(books.createBook))
    
router.get('/new', isLoggedIn, books.renderNewForm)

router.route('/:id')
    .get(catchAsync(books.showBook))
    .put(isLoggedIn, ValidateOwner, upload.array('images'), validateBook, catchAsync(books.updateBook))
    .delete(isLoggedIn, ValidateOwner, catchAsync(books.deleteBook))

router.get('/:id/edit', isLoggedIn, ValidateOwner, catchAsync(books.renderEditForm))

module.exports = router