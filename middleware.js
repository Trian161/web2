const ExpressError = require('./utils/ExpressError')
const {bookJoiSchema, reviewJoiSchema} = require('./JoiSchema')
const Book = require('./models/book')
const Review = require('./models/review')


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateBook = (req,res,next) =>{
    const {error} = bookJoiSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.ValidateOwner = async(req,res,next)=>{
    const {id} = req.params
    const book = await Book.findById(id)
    if(!book.owner.equals(req.user._id)){
        req.flash('error' , 'you dont have permission')
        return res.redirect(`/bookstore/${id}`)
    }
    next();
}
module.exports.ValidateReviewOwner = async(req,res,next)=>{
    const {id , reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.owner.equals(req.user._id)){
        req.flash('error' , 'you dont have permission')
        return res.redirect(`/bookstore/${id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next) =>{
    const{error} = reviewJoiSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}