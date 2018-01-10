// base route : '/auth'
const bitgo = require('../utils/bitgoClient');
const router = require("express").Router();

router.route('/login')
  .post(loginPostController);

router.route('/logout')
  .get(logoutGetController);


module.exports = router;


function loginPostController(req, res) {
  const { username, password, otp } = req.body;
  bitgo.authenticate({ username, password, otp })
    .then(response => {
      console.log("LOGGED IN USER `", username, "` SUCCESSFULLY");
      const { token, user } = response;
      res.status(200).end();
    })
    .catch(err => {
      console.log("ERROR AUTHENTICATING USER : ", username);
      res.status(400).end();
    });
}

function logoutGetController(req, res) {
  bitgo.logout({}).then(response => {
    console.log("LOGGED OUT USER SUCCESSFULLY");
    res.status(200).end();
  }).catch(err => {
    console.log("ERROR LOGGING OUT USER");
    res.status(500).end();
  })
}