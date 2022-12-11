const { findById } = require("../model/student");
const studentModel = require("../model/student");

module.exports = {
  createStudent: async (req, res) => {
    try {
      let { name, subject, marks } = req.body;
      let userId = req.payLoad.userId;
      let alreadyPresent = await studentModel.findOne({
        user: userId,
        name,
        subject,
        isDeleted: false,
      });
      if (alreadyPresent) {
        let updateRecord = await studentModel.findOneAndUpdate(
          { user: userId, name, subject, isDeleted: false },
          { $inc: { marks: marks } },
          { new: true }
        );
        return res
          .status(201)
          .send({ status: true, msg: "Success", data: updateRecord });
      }
      let addstudent = await studentModel.create({ ...req.body, user: userId });
      res.status(201).send({ status: true, msg: "Success", data: addstudent });
    } catch (e) {
      res.status(500).send({ status: false, msg: e.message });
    }
  },

  viewStudent: async (req, res) => {
    try {
      let data = req.query;
      let userId = req.payLoad.userId;
      let findStudent = await studentModel.find({
        ...data,
        user: userId,
        isDeleted: false,
      });
      if (!findStudent.length)
        return res.status(204).send({ status: false, msg: "No data found" });
      res.status(200).send({ status: true, msg: "Success", data: findStudent });
    } catch (e) {
      res.status(500).send({ status: false, msg: e.message });
    }
  },

  updateStudentDetails: async (req, res) => {
    try {
      let userId = req.payLoad.userId;
      let student = req.params.studentId;
      let { name, subject, marks } = req.body;
      if (name && subject) {
        let alreadyPresent = await studentModel.findOne({
          user: userId,
          _id: student,
          name,
          subject,
          isDeleted: false,
        });
        if (alreadyPresent) {
          if (marks) {
            let updatemarks = await studentModel.findByIdAndUpdate(
              student,
              { marks: marks },
              { new: true }
            );
            return res
              .status(200)
              .send({ status: true, msg: "Success", data: updatemarks });
          } else {
            return res
              .status(200)
              .send({ status: true, msg: "Success", data: alreadyPresent });
          }
        } else {
          let isDuplicate = await studentModel.findOne({ user: userId, name, subject })
          if (isDuplicate) {
            return res.status(400).send({ status: false, msg: "Student and Subject combination already Exists." })
          }
        }
      }
      let updateDetail = await studentModel.findOneAndUpdate(
        { _id: student, user: userId, isDeleted: false },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).send({ status: true, data: updateDetail });
    } catch (e) {
      res.status(500).send({ status: false, msg: e.message });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      let student = req.params.studentId;
      await studentModel.findByIdAndUpdate(
        student,
        { $set: { isDeleted: true } },
        { new: true }
      );
      res.status(200).send({ status: true, msg: "Success" });
    } catch (e) {
      res.status(500).send({ status: false, msg: e.message });
    }
  },
};
