const { error } = require("console");
const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) =>{
    return jwt.sign({id}, "kishan shet super secret key", {
        expiresIn: maxAge,
    })
}

// const handleErrors = (err) =>{
//     let errors = {email: "", password: ""};

//     if(err.message === "incorrect Email")
//         errors.email = " That email is not registered";

//     if(err.message === "incorrect password")
//         errors.email = " That password is incorrect";

//     if(err.code === 11000){
//         errors.email = "Email is already registered";
//         return errors;
//     }

//     if(err.message.includes("Users validation failed")){
//         Object.values(err.errors).forEach(({properties})=>{
//             errors[properties.path] = properties.message;

//         });
//     }

//     return errors;
// }

const handleErrors = (err) => {
    let errors = { email: "", password: "" };
  
    console.log(err);
    if (err.message === "incorrect email") {
      errors.email = "That email is not registered";
    }

    if(err.message === "Email and password are required."){
        errors.email = "Email and password both are required."
    }
  
    if (err.message === "incorrect password") {
      errors.password = "That password is incorrect";
    }
  
    if (err.message === 11000) {
      errors.email = "Email is already registered";
      return errors;
    }
  
    if (err.message.includes("Users validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  };

module.exports.register = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            // Throw an error with the message "Email and password are required."
            throw new Error("Email and password are required.");
        }
        
        // If email and password are provided, continue with the rest of the code
        // ...
        
        const user = await UserModel.create({email, password});
        const token = createToken(user._id);

        res.cookie("jwt", token, {
            withCrdentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });
        res.status(201).json({user: user._id, created: true});
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({errors, created: false});
    }
};

module.exports.login = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);

        res.cookie("jwt", token, {
            withCrdentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });
        res.status(200).json({user: user._id, created: true});
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({errors, created: false});
    }
};