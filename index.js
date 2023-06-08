// jshint esversion:6

const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")

const app = express()

app.use(express.static(__dirname + "/assets"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res){
    const email = req.body.email_ID
    const url = 'https://us17.api.mailchimp.com/3.0/lists/83a08e405c'
    
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed'
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    options= {
        method: "POST",
        auth: "socket101:8689b74991350e511ee8bbddf74e6d8c-us17"
    }
    
    var request= https.request(url, options, function(response) {
        
        response.on("data", function(data){
            var postData = JSON.parse(data)
            var errorCode = postData.error_count
            console.log(postData)
            console.log(errorCode)

            if (errorCode === 0) {
                res.sendFile(__dirname + "/success.html")
            }else{
                res.sendFile(__dirname + "/failure.html")
            }
        })
    })

    request.write(jsonData)
    request.end()

})

app.post("/success", function(req, res) {
    res.redirect("/newsletter")
})

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is active on port 3000.")
})