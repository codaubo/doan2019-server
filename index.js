const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const cors = require('cors');
const userRouter = require('./api/users/userRoutes');
const postRouter = require('./api/posts/postRoutes');

 
const bootstrap = async () => {
    try {
        //init app
        const app = express();

        // connect mongodb
        await mongoose.connect('mongodb://admin:admin1@ds257698.mlab.com:57698/doan2019');

        // use middlewares + routers
        app.use(cors({
            origin: ['http://localhost:3000','http://localhost:3002', 'http://localhost:3001', 'https://notarized-backend.herokuapp.com', 'https://notarized-file.now.sh', 'https://notarized.now.sh'],
            credentials: true,
        }));
        // app.use(cors())
        app.use(expressSession({
            secret: 'cobaudeptrai',
            resave: false,
            saveUninitialized: true,
            // cookie: { secure: true } // dinh dang HTTPS gui thi moi tra ve cookie
        })); 
        app.use(express.static(__dirname + '/public'));
        app.use(bodyParser.urlencoded({limit: '200mb', extended: false}));
        app.use(bodyParser.json({limit: '200mb'}));

        app.use('/api/posts', postRouter);
        app.use('/api/users', userRouter);

        // start server
        await app.listen(process.env.PORT || 3001);
        console.log(`Server start success on PORT ${process.env.PORT || 3001} ...`);
    } catch (error) {
        console.log('Error happen: ', error)
    }
}

bootstrap();