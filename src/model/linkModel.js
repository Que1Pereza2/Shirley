// Import Sequelize to define the data base table.
import {Sequelize} from "sequelize";
// Import the database connection.
import db from "../config/database.js"

// Data types that sequelize recognizes to define the table columns data types.
const {DataTypes} = Sequelize;

// Data base table definition for Link.
var Link = db.define('link', {
    weather:{
        type: DataTypes.INTEGER
    }
    ,airTraficCongestion:{
        type: DataTypes.INTEGER
    }
    ,wildlifeCrossings:{
        type: DataTypes.BOOLEAN
    }
    ,idStart:{
        type:DataTypes.INTEGER
        ,allowNull:false
        ,references:{
            model:'city'
            ,key:'id'
        }
    }
    ,idFinish:{
        type:DataTypes.INTEGER
        ,allowNull:false
        ,references:{
            model:'city'
            ,key:'id'
        }
    }
},{

    // Removes the autogenerated timestamps from sequelize.
    timestamps: false
    // Stops sequelize from pluralizing the table names.
    ,freezeTableName: true
});

// Syncs the database to create the table based on the model.
await db.sync()

// Exports the class so it can be used in other classes.
export default Link;