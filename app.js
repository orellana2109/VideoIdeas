const express = require('express'); // server
const exphbs = require('express-handlebars'); // view engine
const methodOverride = require('method-override'); // allows the PUT request in a form
const mongoose = require('mongoose'); // MongoDB queries
const bodyParser = require('body-parser');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true // get rid of a deprecated message
  })
  .then(() => console.log('Mongodb connected')) //.connect returns a promise
  .catch((err) => console.log(err)); // if can't connect send the error

// Load in my idea model
require('./models/Idea');
const Idea = mongoose.model('ideas'); //assign a variable to the model 'ideas' comes from the last line of code in Idea.js

// Handlebars middleware (this code is from the documentation)
app.engine('handlebars', exphbs({ // params - using handlebars, passing variable name for handlebars
  defaultLayout: 'main' // this is the wrapper that will hold all duplicate things that go on every page
}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.urlencoded({
  extended: false
})); // bodyparser is used to catch the data from the post request 
app.use(bodyParser.json());
// method override middleware
app.use(methodOverride('_method'));

//**************ROUTES************************* */

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title
  });

});
//******************************************* */

//About Route
app.get('/about', (req, res) => {
  res.render('about');
})

//******************************************** */

// Idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//******************************************** */

//Add Idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
});

//****************************************** */

// Edit Ideas
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOneAndUpdate({
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
app.post('/ideas', (req, res) => {
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
    res.render('ideas/add', { //send back the page with any fields already filled out
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
              res.redirect('/ideas')   // then redirect to the ideas path
          });
        } // end of else
      });
    
//******************************************************** */

// Edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOneAndUpdate({
    _id: req.params.id
  })
    .then(idea => {
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          res.redirect('/ideas');
        })
    });
  
});

//Delete idea
app.delete('/ideas/:id', (req, res) => {
  Idea.findByIdAndRemove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas');
    })
})
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${5000}`)
});