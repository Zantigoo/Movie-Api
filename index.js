//Module list 
const
    express = require('express'),
    morgan = require('morgan');

const app = express();

const movies = [{
    "The Untouchables" : {},
    "The Lord of the Rings : The Two Towers" : {},
    "48 Hrs." : {},
    "Terminator 3: Rise of the Machines" : {},
    "The Lost World: Jurassic Park" : {},
    "The Day After Tomorrow" : {},
    "21 Grams" : {},
    "From Dusk Till Dawn" : {},
    "Evil Dead 2" : {},
    "Django Unchained" : {},
}]

//Middle men

app.use(morgan('common'));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send("Ain't a thing here...");
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/hiddenstreet', (req, res) => {
    let responseText = 'Hidden Street : Mushroom Stew.';
    res.send(responseText);
});

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