//Module list 

const
    cors = require('cors');
    bodyParser = require('body-parser'),
    express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    bcrypt = require('bcryptjs');
const 
    { update } = require('lodash'),
    { check, validationResult } = require('express-validator');
const app = express();


//Model import
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director

//Database connection
//mongoose.connect('mongodb://localhost:27017/FlixrDB',
//{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect( process.env.CONNECTION_URI, 
{ useNewUrlParser: true, useUnifiedTopology: true });
//Middle men

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('common'));
app.use(express.static('public'));
app.use(cors());

const auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


// Routes

//Documentation
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});



//Just Redirects to Docs for now.
app.get('/', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

//Get movies list
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//Get a movie by name
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne( { Title: req.params.Title })
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Get Genre list 
app.get('/genres', passport.authenticate('jwt', { session: false }) ,(req, res) => {
    Genres.find()
    .then((directors) => {
        res.status(201).json(directors);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get Genre by name
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.findOne( { Name: req.params.Name })
    .then((genres) => {
        res.status(201).json(genres);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get Directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.find()
    .then((directors) => {
        res.status(201).json(directors);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get Director by name
app.get('/directors/:Name',  passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.Name })
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get User by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


//register username & password
    //Format
    /*{
        ID: Number,
        Username: String,
        Password: String,
        Email: String,
        Birthdate: Date
    }*/

app.post('/users',
    [ //validator entries
        check('Username', 'Username is required').isLength({min: 5}), 
        check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email is invalid').isEmail()
    ], (req, res) => {
    //check validation
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' is already registered');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthdate: req.body.Birthdate
            })
            .then((user) => {res.status(201).json(user)})
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//deregister
app.delete('/user/:Username',  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });

//Update User Info
   //Format
    /*{
        ID: Number,
        Username: String,
        Password: String,
        Email: String,
        Birthdate: Date
    }*/

app.put('/user/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new:true },
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Add movie to favorites

app.post('/users/:Username/movies/:MovieID',  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },{
        $push: { Favmovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Remove movie from favorites

app.delete('/users/:Username/movies/:MovieID',  passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOneAndUpdate({ Username: req.params.Username}, {
       $pull: { Favmovies: req.params.MovieID }
   },
   { new:true },
   (err, updatedUser) => {
       if (err) {
           console.error(err);
           res.status(500).send('Error: ' + err);
       } else {
           res.json(updatedUser);
       }
   });
});

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops x_X')
});

// Listen for requests
const port =  process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () =>{
  console.log('Ear to the ground on port ' + port +'.');
});