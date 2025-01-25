/*
    This controller returns the fastest route that the airplane can take based
on the current readings(weights).

    This controller needs the Graph made up by the cities which are the nodes
and are linked between themselves by the links which are the edges, whose weight 
is calculated using the parameters.
*/

// Imports the model for city.
import City from "../model/cityModel.js";
// Imports Graph to use Dijkstra's algorithm. 
import Graph from "node-dijkstra";


/**
 *  This function loads the graph with the cities anr the links with their 
 * weights. Every time the funtion is called the graph is recreated and it's 
 * loaded with the values pulled from the database right before it's called.
 *  This function calls the Graph method used to calculate the route and returns
 * the route with the cost of the route.
 *   
 * @param {query} req This json contains the user inputs, the cities and their 
 * asotiated links with weights.
 * @param {*} res 
 * @returns This method returns a JSON that contains the cities that form the 
 * route in the order that the user needs to pass trough them and the cost of 
 * the route. 
*/
const loadGraph = (req, res) => {
    // Creates the graph that uses Dijkstra's algorithm.
    const route = new Graph();

    // The city where the user is located.
    let start = req.userInputs.start
    // The city where the user desires to go.
    let finish = req.userInputs.finish 
    
    /*
    For loop that iterates trought the recieved json to pull the cities and 
    the links, then uses them to create the nodes and the edges with the
    calculated weight. 
     */
    for(let i = 0; i < Object.keys(req.data).length; i++){
        route.addNode(req.data[i].startCity, req.data[i].edges)
    }

    // Calls the graph method that calculates the route and returns a JSON with 
    // the route and the cost of the route.
    return route.path(start, finish, {cost:true})
}


/**
 *  This function retrieves the data pulled from the database as a JSON and 
 * calls the function calculateWeights in order to get the weights for the 
 * links.
 * 
 *  Then it creates a JSON that contains an array of calculated weights and an
 * array of cities and their links, which is sent to the function 
 * "translateToGraph" so the JSON recieved form said function can be finally 
 * sent to the "loadGraph" function.
 * 
 *  Once the "loadGraph" function has finished this function returns the JSON
 * recieved that contains the route and weight.
 *    
 * @param {query} req Recieves a JSON that contains the user's inputs (where the
 *  user if and where the user wants to go). 
 * @param {*} res 
 * @returns This function returns a JSON containing the final route and the 
 * weight of the route.
 */
const getRoutes = async(req, res) =>{
    // Retrieves the JSON of the database. 
    const citiesAndLinks = await getDBData();
    // Calculates the weights of each link.
    const linksAndWeights = calculateWeights({links : citiesAndLinks[1]});
    
    // Creates the JSON that will be sent to "translateToGraph".
    let unpreparedData = {
        cities:citiesAndLinks[0]
        ,links:linksAndWeights
    }
    
    // Creates the JSON that will be sent to the graph.
    const preparedData = {}
    preparedData.data = translateToGraph(unpreparedData);
    preparedData.userInputs = req;

    // Retrieves the route from the graph.
    const finalRoute = loadGraph(preparedData);

    // returs the route with it's weight to the index.
    return finalRoute;
    
}

/**
 * This function retrieves the cities and links from the database and separates
 * them in different arrays for ease of use, once they are separated they are 
 * then merged into an array so they can be returned.
 * 
 * @param {*} req
 * @param {*} res 
 * @returns  This function returns the database data as a JSON once the cities 
 * and links are handled.
 */
const getDBData = async(req, res) => {

    // This retrieves the cities from the database and includes the links 
    // asociated with every city. 
    let dbData = await City.findAll({include : ['Links']});
    
    let cities = [];
    let links = [];

    let citiesAndLinks = [];
    
    dbData.forEach(element => {
        
        // This takes the cities and puts them in the array.
        cities.push({
            id : element.id
            ,name : element.name
            ,state : element.state
            ,km2 : element.km2
        });
        
        // This separates the links from the cities and puts them in the array.
        element.Links.forEach( element => {
            links.push(element.link)
        });
    });
    
    // This merges the cities and links into one list so the function can 
    // return one array.
    citiesAndLinks.push(cities, links)
    
    //Returns the JSON with the handled database table data.
    return citiesAndLinks;
};

/**
 *  This method calculates the weight of the links and puts them into a final 
 * array with their respective links so that they can be easier to work with.
 * 
 * @param {links} req 
 * @param {*} res 
 * @returns 
 */
const calculateWeights = (req, res) => {
    // Final array that will be returned containing the id's of the links and 
    // their respective weights.
    let linksAndWeights = []

    // Iterates trough every link and calculates the weight of each.
    req.links.forEach(element => {

        let weight = element.airTraficCongestion + element.weather;
        
        if(element.wildlifeCrossings)
            weight *= 2
        
        // Temporary JSON so the data insertion is easier.
        let tLAW = {
            idStart : element.idStart
            ,idFinish : element.idFinish
            ,weight : weight
        }

        // Loads the JSON that will be returned.
        linksAndWeights.push(tLAW) 
    });

    return linksAndWeights
};

/**
 * This function recieves the cities array and the links array and returns a
 * single array containing only the information the graph requires.
 * 
 * @param {unpreparedData} req 
 * @param {*} res 
 * @returns This function returns a JSON that can be passed to the graph to 
 * create the nodes and links.
 */
const translateToGraph = (req, res) => {
    
    // Instatantiate the array that will be returned.
    const combinedArray= [] 
    
    // Iterate trough the elements of the city table.
    req.cities.forEach(begining => {
        const combineData = {}
        const links = {}
   
        // Iterate trough every links asotiated with the city.
        req.links.forEach(link => {         
            // Check to see if the link's start city ID matches the city's ID.
            if(begining.id == link.idStart){
                // Insert into the temporary JSON the the start city and it's 
                // name so they are identified by name instead of ID.
                combineData.startCity = begining.name
            
                // Check to see if the city ID matches the link's end city ID. 
                req.cities.forEach( end => {
                    if (end.id == link.idFinish)
                        // Inserts into the links JSON the name of the city and
                        // it's calculated weight.
                        links[end.name] = link.weight
                })
                
                // Insert into "combinedData" the links JSON under the name 
                // edges.
                combineData.edges = links
            }
        });

        // Inserts into "combinedArray" the "combinedData". 
        combinedArray.push(combineData);
    });

    // Returns the JSON containing all the cities, with their links and 
    // asociated weights.
    return combinedArray; 
}

// Exports the class so it can be used in other classes.
export default getRoutes;