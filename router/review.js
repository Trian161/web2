const express = require('express')
const router = express.Router({mergeParams : true});
const Review = require('../models/review')
const Book = require('../models/book')
const catchAsync = require('../utils/CatchAsync')
const {validateReview , isLoggedIn , ValidateReviewOwner} = require('../middleware')
const reviews = require('../controllers/review')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn , ValidateReviewOwner, catchAsync(reviews.deleteReview))

module.exports = router