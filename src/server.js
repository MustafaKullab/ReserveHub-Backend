require("dotenv").config();
const app = require("../src/app.js");
const mongoose = require("mongoose");

const startServer = async () =>{
    try {

        await mongoose.connect(process.env.MONGO_URL);
        
        app.listen(process.env.PORT , () => {
            console.log(`Server is Listening now on port ${process.env.PORT}`);
            
        })
    }catch(error){
        console.log(`Something went wrong: ${error.message}`);
        
    }
}

startServer();