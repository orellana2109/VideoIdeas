const express = require('express'); // server
const path = require('path'); // core module doesn't get installed 
const exphbs = require('express-handlebars'); // view engine
const methodOverride = require('method-override'); // allows the PUT request in a form
const mongoose = require('mongoose'); // MongoDB queries
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true // get rid of a deprecated message
  })
  .then(() => console.log('Mongodb connected')) //.connect returns a promise
  .catch((err) => console.log(err)); // if can't connect send the error


// Handlebars middleware (this code is from the documentation)
app.engine('handlebars', exphbs({ // params - using handlebars, passing variable name for handlebars
  defaultLayout: 'main' // this is the wrapper that will hold all duplicate things that go on every page
}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser middleware
app.use(bodyParser.urlencoded({
  extended: false
})); // bodyparser is used to catch the data from the post request 
app.use(bodyParser.json());
// method override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  }));

app.use(flash());

// globabl variable
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})
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



//Use Routes
app.use('/ideas', ideas); // brings in all the routes from the /ideas directory
app.use('/users', users); // brings in all the user routes from /users

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${5000}`)
});