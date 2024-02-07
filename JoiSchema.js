const baseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) =>({
    type : 'string',
    base : joi.string(),
    messages: {
        'string.escapeHTML' : '{{#label}} must not include HTML'
    },
    rules:{
        escapeHTML: {
            validate(value,helpers){
                const filtered = sanitizeHTML(value ,{
                    allowedAttributes : false ,
                    allowedTags : false
                })
                const clean = sanitizeHTML(filtered,{
                    allowedTags :[],
                    allowedAttributes : {}
                })
                if(clean !== filtered) return helpers.error('string.escapeHTML', {value})
                return clean
            }
        }
    }
})

const joi = baseJoi.extend(extension)

module.exports.bookJoiSchema =joi.object({
        book: joi.object({
            title: joi.string().required().escapeHTML(),
            categories: joi.string().required().escapeHTML(),
            // image: joi.string().required(),
            description: joi.string().required().escapeHTML(),
            author: joi.string().required().escapeHTML(),
            price: joi.number().min(0).required()
        }).required(),
        deleteImages : joi.array()
    })

module.exports.reviewJoiSchema = joi.object({
    review: joi.object({
        rating : joi.number().min(1).max(5).required(),
        body : joi.string().required().escapeHTML()
    }).required()
})