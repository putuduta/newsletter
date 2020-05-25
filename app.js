//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const requezt = require('request');
const https = require('https');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));

// set css to dynamic
app.use(express.static('public'));

//get req
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});


//post the data
app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);
    //mailchimp api
    const url = "https://us18.api.mailchimp.com/3.0/lists/9dec0cc16a";
    const options = {
        method: 'POST',
        auth: 'putud:6619c8f625a4d13fafde6ab7b7f27e53-us18'
    };
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }


        response.on('data', (data) => {
            console.log(JSON.parse(data));

        });
    });

    request.write(jsonData);
    request.end();
});

//if failure redirect to home
app.post('/failure', (req, res) => {
    res.redirect('/');
});

//server running on 3000
app.listen(port, () => console.log('Server is running on port 3000'));
