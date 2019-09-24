require('dotenv').config();
const express = require('express');
const path = require('path');
const request = require('request');
const serveStatic = require('serve-static');

const app = express();

const { MC_LIST_ID, MC_API_KEY } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(serveStatic(path.join(__dirname, 'public')));

app.post('/subscribe', (req, res) => {
  const { email, js } = req.body;

  const options = {
    url: 'https://us4.api.mailchimp.com/3.0/lists/' + MC_LIST_ID,
    method: 'POST',
    headers: {
      Authoriration: 'auth ' + MC_API_KEY
    },
    body: JSON.stringify({
      members: [{ email_address: email, status: 'pending' }]
    })
  };

  if (email)
    request(options, (error, response, body) => {
      if (error) res.status(400).send({ error });
      else {
        if (js) res.send();
        else res.redirect('/success.html');
      }
    });
  else res.status(400).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
