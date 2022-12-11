const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    try {
      let { email } = req.body;
      let uniqEmail = await userModel.findOne({ email });
      if (uniqEmail)
        return res
          .status(400)
          .send({ status: false, msg: "Email already registered." });
      let createUser = await userModel.create(req.body);
      res.status(201).send({ status: true, data: createUser });
    } catch (e) {
      res.status(500).send({ status: false, msg: e.message });
    }
  },

  login: async (req, res) => {
    try {
      data = req.body
      userName = data.email
      password = data.password

      if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: 'please enter data' })
      }
      if (!userName) {
        return res.status(400).send({ status: false, message: 'Email is required' })
      }
      if (!password) {
        return res.status(400).send({ status: false, message: 'password is required' })
      }
      let user = await userModel.findOne({ email: userName, password: password })
      if (!user) {
        return res.status(400).send({ status: false, message: 'username or password incorrect' })
      }
      let loginUser = await userModel.findOne(data);
      if (!loginUser)
        return res
          .status(400)
          .send({ status: false, msg: "Invalid Credentials." });
      let token = jwt.sign({ userId: loginUser._id }, "This-is-a-secret-key", {
        expiresIn: "2d",
      });
      res.status(200).send({ status: true, token: token });
    } catch (e) {
      res.status(500).send({ status: false, msg: e.message });
    }
  },
};
