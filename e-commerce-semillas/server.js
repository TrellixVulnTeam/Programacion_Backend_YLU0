/* -------------------------------- Modulos -------------------------------- */
const express = require("express");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const logger = require('./src/utils/logger.js');

//const routerProducts = express.Router();
const ProductsRouter = require("./src/routes/products.routes");
const CartRouter = require("./src/routes/cart.routes");
const RegisterRouter = require("./src/routes/Register.routes");
const LoginRouter = require("./src/routes/login.routes");

/* -------------------------------- Instancia de Express ------------------------ */
const app = express();

/* -------------------------------- Middlewares -------------------------------- */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/* -------------------------------- Motor de plantillas -------------------------------- */
app.set('views', path.join(__dirname, 'views'));

//Config extra para lo que es HBS
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: 'hbs'
}));
//------------------------------------
app.set('view engine', 'ejs');

/* -------------------------------- Server -------------------------------- */
const MODO_CLUSTER = process.argv[2] == 'CLUSTER'

if (MODO_CLUSTER && cluster.isMaster) {
  logger.info(`num cpus: ${numCPUs}`);
  for (let index = 0; index < numCPUs; index++) {
      cluster.fork();
  }

  cluster.on('exit', worker=>{
      logger.info(`Worker ${process.pid} finalizo ${new Date().toLocaleString()}`);
      cluster.fork()
  });
} else {
  // console.log('Proceso hijo')
  const PORT = parseInt(process.argv[2]) || 8080;
  // const PORT = 8080;

  const server = app.listen(PORT, () => {
    logger.info(`Server running on express, Home can see it on http://localhost:${PORT} - PID WORKER ${process.pid} 
    - Date ${new Date().toLocaleString()}`);
  });
    server.on("error", (err) => {
    logger.warn(`Error en el servidor: ${err}`);
  });

}

/* -------------------------------- Rutas -------------------------------- */
/* Agregamos routers a la app */
app.use("/api/productos", (new ProductsRouter()).start());
app.use("/api/carrito", (new CartRouter()).start());

//modifique las carpetas de api
app.use("/register", (new RegisterRouter()).start());
app.use("/login", (new LoginRouter()).start());

// Ruta inicio
app.get("/", (req, res) => {
  res.render('pages/login');
});

/* -------------------------- FORK ---------------------------- */
// node server.js FORK
// npm start FORK
// artillery quick -c 50 -n 50 "http://localhost:8080/api/productos" > artillery_fork.txt
/* ----------------------------------------------------------- */

// /* -------------------------- CLUSTER ---------------------------- */
// node server.js CLUSTER
// npm start CLUSTER
// artillery quick -c 50 -n 50 "http://localhost:8080/productos" > artillery_cluster.txt
// /* ----------------------------------------------------------- */