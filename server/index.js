const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


require('./initMiddleware')(app);
app.use(express.static(path.resolve(__dirname, '..', 'client')));
require('./routes')(app);


app.listen(PORT, () => {
  console.log("Server is listening on PORT ", PORT);
});