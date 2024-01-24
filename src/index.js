const express = require('express');
const bodyParser = require('body-parser');
const { PORT, DB_SYNC } = require('./config/server-config');
const apiRoutes = require('./routes/index');
const db = require('./models/index');


const createServer = () => {

    const app = express();


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api', apiRoutes);


    app.listen(PORT, () => {
        console.log(`Server listening at port ${PORT}`);
        if (DB_SYNC) {
            db.sequelize.sync({ alter: true });
        }
    });

}

createServer();