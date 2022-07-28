const passport = require('passport');
const logger = require('../logger');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users');

// const LoginController = {
//   async getUsers(req,res){
//         try {
//             const users = await User.find();
//             res.status(200).send(users);
//           } catch (err) {
//             res.send("Error " + err);
//           }
//     },

  //  async register(req,res){
  //      console.log(req.body)

  //      try {
  //            const {email,password} = req.body
  //           const newUser = new User({
  //             email: email,
  //             password: password
  //           })

  //            await newUser.save((err,user)=>{
  //             if(err){
  //                 res.send({
  //                     success: false,
  //                     message: 'unknown error occured',
  //                     error: err
  //                 })
  //             }
  //             res.status(200).send({
  //                 success: true,
  //                 message: 'user created scccessfully',
  //                 data : user
  //               })
  //           })
           
  //         } catch (error) {
  //           res.status(500).send({
  //             success: false,
  //             message: 'cannot process the request',
  //             error: error
  //           })
  //         }
  //       }
    //    passport.use(
    //        'signup',
    //        new localStrategy(
    //            {
    //             email : req.body.email,
    //             password: req.body.password
    //             // email: 'email',
    //             // passwordField: 'password'
    //           },
    //           async (email, password) => {
                
    //         )
    //       );
    // }


    // ...

// }




// module.exports = LoginController


// ...

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        User.findOne({email: email}).exec(async (err,user) =>{
          if(err){
            logger.error(err)
          }
          
          if(user){
            logger.warn({message: 'User with email alreadt exsist'})
            return done(null,false, {message: 'User with email alreadt exsist'})
          }
          else{
            const newUser = await User.create({ email, password });
            return done(null, newUser);
          }
          
        })
        

      } catch (error) {
        done(error);
      }
    }
  )
);



passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        var  validate = false
        if(password === user.password){
          validate = true
        }
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);