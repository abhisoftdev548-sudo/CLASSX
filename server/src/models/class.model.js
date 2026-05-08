import mongoose from 'mongoose'


const classSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    className:{
        type: String,
        required: true,
        unique: [true, "Class name must be unique"],
        trim: true,
    },
    classSubject: {
      type: String,
      required: [true, "Please add a subject"],
      trim: true,
    },
    classSession: {
      type: String,
      required: [true, "Please add a session"],
      trim: true,
    },
     classLogo: {
      type: String,
      trim: true,
      default: "",
    },
    classCode: {
      type: String,
      required: [true, "Please add a class code"],
      unique: [true, "Class code must be unique"],
      index: true,
    },
    studentCode: {
      type: String,
      required: [true, "Please add a student class code"],
      unique: [true, "Student class code must be unique"],
      index: true,
    },
    teacherCode: {
      type: String,
      required: [true, "Please add a teacher class code"],
      unique: [true, "Teacher class code must be unique"],
      index: true,
    },
})





const classModel = mongoose.model('classes', classSchema)

export default classModel;