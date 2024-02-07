const User = require('../models/user')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res,next)=>{
    try{
        const {username , email , password} = req.body
        const user = new User({username , email})
        const registerUser = await User.register(user, password)
        req.login(registerUser, err =>{
            if(err) return next(err)
            req.flash('success', 'success create a user')
            res.redirect('/bookstore')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success', 'welcome back')
    res.redirect('/bookstore')
}

module.exports.logout = async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success', 'Good Bye')
        res.redirect('/bookstore')
    });
}