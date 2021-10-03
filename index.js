//Module list 

const
    bodyParser = require('body-parser'),
    express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid');

const app = express();

let users = [
    {   
        id: 2,
        name: "testguy",
        pass: "collect200"
    }
];
const directors = [
    {
        name: "JJ Camerons",
        birth_year: 3033,
        death_year: 1337,
        bio: "That's the guy who made Avatar! I think."
    },
    {
        name: "Alfred Spielburg",
        birth_year: 2020,
        death_year: 2020,
        bio: "I want to say... Silence of the Lambs? That sounds right."
    }
];
const genres = [
    {
        name: "Action",
        description: "BOOM BANG BOOOSH!"
    },
    {
        name: "Adventure",
        description: "Like Action but they talk a lot more"
    },
    {
        name: "😴", 
        description: "Just wanted to see if that emoji would actually work"
    }

];
const movies = [
    {
        name: "The Untouchables",
        genre: ["Crime","Drama","Thriller"],
        release_year: 1987,
        director: "Brian De Palma"
    },
    {
        name: "The Lord of the Rings : The Two Towers",
        genre: ["Action","Adventure","Drama"],
        release_year: 2002,
        director: "Peter Jackson"
    },
    {
        name: "48 Hrs.",
        genre: ["Action","Comedy","Crime"],
        release_year: 1982,
        director: "Walter Hill"
    },
    {
        name: "Terminator 3: Rise of the Machines",
        genre: ["Action","Sci-Fi"],
        release_year: 2003,
        director: "Jonathan Mostow"
    },
    {
        name: "The Lost World: Jurassic Park",
        genre: ["Action","Adventure","Sci-Fi"],
        release_year: 1997,
        director: "Steven Spielberg" 
    },
    {
        name: "The Day After Tomorrow",
        genre: ["Action","Adventure","Sci-Fi","Thriller"],
        release_year: 2004,
        director: "Roland Emmerich"
    },
    {
        name: "21 Grams",
        genre: ["Crime","Drama","Thriller"],
        release_year: 2003,
        director: "Alejandro G. Iñárritu"
    },
    {
        name: "From Dusk Till Dawn",
        genre: ["Action","Crime","Horror"],
        release_year: 1996,
        director: "Robert Rodriguez" 
    },
    {
        name: "Evil Dead 2",
        genre: ["Comedy","Horror"],
        release_year: 1987,
        director: "Sam Raimi"
    },
    {
        name: "Django Unchained",
        genre: ["Drama", "Western"],
        release_year: 2012,
        director: "Quentin Tarantino" }
]

//Middle men

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

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
app.get('/movies', (req, res) => {
    res.json(movies);
});

//Get a movie by name
app.get('/movies/:name', (req, res) => {
    res.json(movies.find((mov) => {
        return mov.name === req.params.name
    }));
});

// Get Genre list 
app.get('/genres', (req, res) => {
    res.json(genres);
});

//Get Genre by name
app.get('/genres/:name', (req, res) => {
    res.json(genres.find((gen) => {
        return gen.name === req.params.name
    }));
});

//Get Directors
app.get('/directors', (req, res) => {
    res.json(directors);
});

//Get Director by name
app.get('/directors/:name', (req, res) => {
    res.json(directors.find((dire) => {
        return dire.name === req.params.name
    }));
});

//Get a movie by name
app.get('/movies/:name', (req, res) => {
    res.json(movies.find((mov) => {
        return mov.name === req.params.name
    }));
});

//register username & password

app.post('/user', (req, res) => {
    let newUser = req.body;
    if (!newUser.name || !newUser.pass) {
        const message = 'Please fill required fields';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

//deregister
app.delete('/user/:id', (req, res) => {
    res.send('Successful DEL removing user.(This message is a test)')
  });

//update username

app.put('/user/change/:name1/:name2', (req, res) => {
    res.send('Successful PUT changing users name.(This message is a test)')
});

//Add movie to favorites

app.post('/user/favorite/:name', (req, res) => {
    res.send('Successful POST adding movies to the favorites list.(This message is a test)')
});

//Remove movie from favorites

app.delete('/user/favorite/:name', (req, res) => {
    res.send('Successful DELETE removing movies from the favorites list.(This message is a test)')
})

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops x_x')
});

// Listen for requests
let port =  8080
app.listen(port, () =>{
  console.log('Your app is listening on port ' + port +'.');
});