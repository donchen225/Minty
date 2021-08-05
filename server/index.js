const app = require('./app');

const config = require('dotenv').config()

const port = process.env.PORT || 1200; // This variable will be automatically set by Heroku if we are deploying on Heroku. If it doesn't exist, we can default to 1200 on local machine.   

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
