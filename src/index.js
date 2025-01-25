// Import express so we can use the framework to create a web app.
import express from 'express'
// Import morgan so we can log the HTTP requests.
import morgan from 'morgan'
// Import the data base connection so we can sync the database after defining 
// the foreign keys.
import db from './config/database.js';
// Import the general controller so we can access the logic of the app.
import getRoutes from './controller/generalController.js';
// Import the Link and City model so we can define the forign keys.
import Link from './model/linkModel.js';
import City from './model/cityModel.js';

const app = express();

// Configuration for the port and JSON settings.
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Middleware settings.
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Route for the post request at "/".
app.post('/',async (req,res) => {
    return  res.json( await getRoutes(req.query));
});

// Foreign key for the Link table.
City.belongsToMany(City, {
    through:Link
    ,as:'Links'
    ,foreignKey:"idStart"
    ,otherKey:'idFinish'
});

// Saving the foreign keys in the data base.
db.sync();

// Launching the application.
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});