// import CustomError from "./CustomError.class.js";
// import DBClient from "./DBClient.class.js";
// import config from "../utils/config.js";
// import logger from "../utils/logger.js";
// import mongoose from "mongoose";

// class MongoAtlasClient extends DBClient {
//   constructor() {
//     super();
//     this.connected = false;
//     this.client = mongoose;
//   }

//   async connect() {
//     try {
//       await this.client.connect(config.mongodb.url);
//       this.connected = true;

//       logger.info("Connected to database: Mongo Atlas");
//     } catch (error) {
//       throw new CustomError(500, "Error connecting to Mongo Atlas", "error");
//     }
//   }

//   async disconnect() {
//     try {
//       await this.client.connection.close();
//       this.connected = false;
      
//       logger.info("Disconnected from database: Mongo Atlas");
//     } catch (error) {
//       throw new CustomError(500, "Error disconnecting from Mongo Atlas", error);
//     }
//   }
// }

// export default MongoAtlasClient;