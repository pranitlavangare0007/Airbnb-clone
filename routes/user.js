const express = require('express')
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { savedRedirecturl } = require('../middleware.js');
const userController = require('../controllers/users.js')

router
    .route("/signup")
    .get(userController.rendernSignupForm)
    .post(wrapAsync(userController.signUp))

router
    .route("/login")
    .get(userController.renderLoginForm)

    .post(savedRedirecturl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.login)

router.get("/logout", userController.logOut)

module.exports = router;