//jshint esversion:6
const express = require("express");
const ejs = require ("ejs");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
require("dotenv").config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res){
  res.render("home");
});

app.post("/", function(req, res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailAddress = req.body.email;

  //https://mailchimp.com/developer/reference/lists/#post_/lists/-list_id-
  var memberData = {
    members: [{
      email_address: emailAddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  var jsonMemberData = JSON.stringify(memberData);

  //POST to url/list/{list-id}
  var options = {
    url: "https://us3.api.mailchimp.com/3.0/lists/" + process.env.MAILCHIMP_AUDIENCE_ID,
    method: "POST",
    headers: {
      Authorization: "anyUserName " + process.env.MAILCHIMP_API_KEY
    },
    body: jsonMemberData
  };

  //Makes the request to the URL in options variable.
  request(options, function (err, response, body){
    if (err) {
      console.log(err);
      console.log(response.statusCode);
      res.send("There was an error, please try again.");
    } else {
      if (response.statusCode === 200) {
        res.send("You've now signed up! This will redirect you to a success page when developed.");
      } else {
        res.send("There was some kind of error. You should try again");
      }
      console.log(response.statusCode);
    }
  });


}); //end app.post()


//Listening on environment-defined port or port 3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started on port " + port);
});
