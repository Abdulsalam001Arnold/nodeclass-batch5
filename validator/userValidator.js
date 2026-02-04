

import Joi from 'joi'

export const userValidation = Joi.object({
    username: Joi.string().min(3).max(30).allow(""),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).message("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
})