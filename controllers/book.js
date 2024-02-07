const Book = require('../models/book')
const {cloudinary} = require('../cloudinary')

module.exports.index = async(req,res) =>{
    const books = await Book.find({})
    res.render('BookStore/index', {books}) 
}

module.exports.renderNewForm = (req,res)=>{
    res.render('BookStore/new')
}

module.exports.createBook = async(req,res,next)=>{
    // if(!req.body.book) throw new ExpressError('invalid book', 400)
    const book = await new Book(req.body.book)
    book.images = req.files.map(f => ({url : f.path , filename: f.filename}))
    book.owner = req.user._id
    await book.save()
    req.flash('success', 'successfully made a new book!')
    res.redirect(`/bookStore/${book._id}`)
}

module.exports.showBook = async(req,res) =>{
    const book = await Book.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'owner'
        }
    }).populate('owner')
    if(!book){
        req.flash('error', 'Cannot find the book')
        res.redirect('/bookstore')
    }
    res.render('BookStore/show', {book})
}

module.exports.renderEditForm = async(req,res)=>{
    const book = await Book.findById(req.params.id)
    if(!book){
        req.flash('error', 'Cannot find the book')
        res.redirect('/bookstore')
    }
    res.render('BookStore/edit', {book})
}

module.exports.updateBook = async(req,res)=>{
    const {id} = req.params
    const book = await Book.findByIdAndUpdate(id , {...req.body.book})
    if(book.images > 0){
    const imgs = req.files.map(f => ({url : f.path , filename: f.filename}))
    book.images.push(...imgs)
    }
    await book.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await book.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'successfully updated book!')
    res.redirect(`/bookStore/${book._id}`)
}

module.exports.deleteBook = async(req,res)=>{
    const {id} =req.params;
    const book = await Book.findByIdAndDelete(id);
    for (let img of book.images){
        await cloudinary.uploader.destroy(img)
    }
    req.flash('success', 'successfully deleted book!')
    res.redirect('/bookStore')
}