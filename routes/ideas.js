const express = require('express');
const mongoose = require('mongoose'); // MongoDB queries
const router = express.Router(); // this is the module that lets me have different routes for the router.js file

// Load in my idea model
require('../models/Idea');
const Idea = mongoose.model('ideas'); //assign a variable to the model 'ideas' comes from the last line of code in Idea.js

//******************************************** */

// Idea index page
router.get('/', (req, res) => {
    Idea.find({})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//******************************************** */

//Add Idea form
router.get('/add', (req, res) => {
    res.render('ideas/add')
});

//****************************************** */

// Edit Ideas
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});

//******************************************* */

//Process the form
router.post('/', (req, res) => {
    let errors = [];

    // form handling to make sure data has been inputted in the form
    if (!req.body.title) { //if the title section is empty
        errors.push({
            text: 'Please add a title'
        }); //push this error into the errors array
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add a detail'
        });
    }

    // check the array and if there is at least one error then
    if (errors.length > 0) {
        res.render('/add', { //send back the page with any fields already filled out
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = { // created this variable to hold object from req(title & details)
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => { // new Idea is from the model pass in the newUser to save
                req.flash('success_msg', 'Video idea added')
                res.redirect('/ideas') // then redirect to the ideas path
            });
    } // end of else
});

//******************************************************** */

// Edit form process
router.put('/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated')
                    res.redirect('/ideas');
                })
        });

});

//Delete idea
router.delete('/:id', (req, res) => {
    Idea.findByIdAndRemove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Video idea removed')
            res.redirect('/ideas');
        });
});








module.exports = router;