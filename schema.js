const Joi = require('joi');
// backend validation

// Listing schema
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

// Review schema
const reviewSchema = Joi.object({
  review: Joi.object({ 
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});

module.exports = {
  listingSchema,
  reviewSchema
};
