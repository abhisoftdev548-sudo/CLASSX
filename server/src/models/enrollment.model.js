
import mongoose from "mongoose";

const enrollMentSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "classes",
        required: true,
        index: true
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ["creator", "student", "teacher"],
        required: true,
        default: "student"
    },
    branch: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"],
        required: true,
        default: "pending"
    },
    acceptedAt: {
        type: Date,
        trim: true,
        default: null
    },

    joinedAt: {
        type: Date,
        trim: true
    },
    canceledAt: {
        type: Date,
        trim: true,
        default: null
    }
}, {timestamps: true})

enrollMentSchema.index({classId: 1, userId: 1}, {unique: true})

const enrollMentModel = mongoose.model('enrollments', enrollMentSchema)

export default enrollMentModel;