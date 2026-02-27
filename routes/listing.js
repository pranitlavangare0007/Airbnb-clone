const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const listingController = require('../controllers/listings.js')

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));

router.get("/new", isLoggedIn, listingController.renderNewForm)

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditform))

module.exports = router;
