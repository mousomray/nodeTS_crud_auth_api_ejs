import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./app/config/db"
import ApiRouter from "./app/router/Api.routes"
import AuthRouter from "./app/router/Auth.routes"

// For to Handle cookie and flash message 
// const session = require('express-session'); // Import session 
// const cookieParser = require('cookie-parser'); // Import cookie 
// const flash = require('connect-flash'); // Import flash  

dotenv.config(); // .env with config
const app = express();
connectDB()

/**setup cookie and session for to use flash */
// app.use(cookieParser());
// app.use(session({
//     cookie: { maxAge: 60000 },
//     secret: 'myprojectwebskitters',
//     resave: false,
//     saveUninitialized: false
// }))
// app.use(flash()); // Use Flash

//globaly variable set for operation (like sucess , error) message
// app.use((req, res, next) => {
//     res.locals.sucess = req.flash('sucess'),
//         res.locals.err = req.flash('err')
//     next()
// })

// For to View ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json()); // use Express
app.use(express.urlencoded({ extended: true })); // For to add data in form
// app.use((cors())); // Use Cors  

// Make uploads and public file static
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api', ApiRouter)
app.use('/auth', AuthRouter)

const port = 3004
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});