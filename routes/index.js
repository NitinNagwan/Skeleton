const express = require('express')
const passport = require('passport');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const router = express.Router()
const LoginController = require('../controllers/LoginController')

/**
 * @swagger
 * components:
 *      schemas:
 *          user:
 *             type: object
 *             required:
 *                email
 *                password
 *             properties:
 *                 id: 
 *                   type: string
 *                   description: auto generated id for a user
 *                 email:
 *                   type: string
 *                   description: valid and unique email    
 *                 password:
 *                    type: string
 *                    description: passwword min 8 character long
 *             example:
 *                 id: HY62fHWu
 *                 email: example@gmail.com
 *                 password: Raj@123
 */

/**
 * @swagger
 * /v1/api/:
 *      get:
 *         summary: returns the list of users
 *         responses:
 *          200:
 *            description: the list or users 
 *            content:
 *               application/json:
 *                  schema:
 *                      type: array
 *                      items: 
 *                          $ref: '#/components/schemas/user'
 *        
 */
router.get('/', async  (req,res)=>{
        try {
            const users = await User.find();
            res.status(200).send(users);
          } catch (err) {
            res.send("Error " + err);
          }
    }
    )


/**
 * @swagger
 * /v1/api/signup:
 *      post:
 *          summary: registering a user
 *          tags: [users]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                          schema:
 *                              $ref: '#components/schemas/user'  
 *          responses:
 *              200:
 *                 description: The user was successfully created
 *                 content:
 *                     application/json:
 *                              schema:
 *                                 $ref: '#/components/schemas/user'
 *              500:
 *                 description: server error occured
 * 
 *              401:
 *                 description: please insert data properly
 * 
 */

// router.post('/register', LoginController.register)
router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
      res.json({
        message: 'Signup successful',
        user: req.user
      });
    }
  );


/**
 * @swagger
 * /v1/api/login:
 *        post:
 *            summary: sign in
 *            tags: [users]
 *            requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                          schema:
 *                              $ref: '#components/schemas/user'  
 *            responses:
 *              200:
 *                 description: The user was successfully created
 *                 content:
 *                     application/json:
 *                              schema:
 *                                 $ref: '#/components/schemas/user'
 *              500:
 *                 description: server error occured
 * 
 *              401:
 *                 description: please insert data properly
 */



router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {

            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);


module.exports = router