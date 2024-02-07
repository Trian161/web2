const mongoose = require('mongoose')
const dataBook = require('./book')
const Book = require('../models/book')

main().catch(err => {
    console.log('error')
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/Book-Store');
  console.log('Database Connected')
}

const seedDB = async() =>{
    await Book.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random50 = Math.floor(Math.random() * 50)
        const price = Math.floor(Math.random() * 20) + 10;
        const Books = new Book({
            owner : '636b33829dc5d34ae2397a13', 
            title : `${dataBook[random50].title}`,
            author: `${dataBook[random50].author}`,
            categories: `${dataBook[random50].categories}`,
            description: `${dataBook[random50].description}`,
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dpoxgligk/image/upload/v1668396801/bookStore/glekzzqv9qqzt3xc2yha.jpg',
                  filename: 'bookStore/glekzzqv9qqzt3xc2yha',
                },
                {
                  url: 'https://res.cloudinary.com/dpoxgligk/image/upload/v1668396801/bookStore/lfa7rgh2btiewaerpomt.jpg',
                  filename: 'bookStore/lfa7rgh2btiewaerpomt',
                }
              ]
        })

        await Books.save()
    }
}

seedDB().then( () => {
    mongoose.connection.close();
});