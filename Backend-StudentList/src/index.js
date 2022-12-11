const express = require("express");
const route = require("./route/route.js");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose
  .connect(
    "mongodb+srv://saurabhshete281:JBmRPjzC58VOejIX@cluster0.jih1tjw.mongodb.net/backEndAssignment",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});