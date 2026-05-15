

class ClassEnrollmentRepository {
    constructor(classEnrollmentModel) {
        this.classEnrollmentModel = classEnrollmentModel;
    }

    enrollToClass = async (data) => {

    //       let enrollmentDetails;
    // if (data.role === "student" || data.role === "teacher") {
    //   enrollmentDetails = await this.classEnrollmentModel.save({
    //     classId: data.classId,
    //     userId: data.userId,
    //     role: data.role,
    //   });
    // } else {
    //   enrollmentDetails = await this.classEnrollmentModel.create({
    //     classId: data.classId,
    //     userId: data.userId,
    //     role: data.role,
    //     joinedAt: data.joinedAt,
    //   });
        const enrollmentDetails = await this.classEnrollmentModel.create({
            classId: data.classId,
            userId: data.userId,
            role: data.role,
            branch: data.branch || null,
            joinedAt: data.joinedAt,
            status: data.status
        })

        return enrollmentDetails;
    }

    findEnrollmentByFilter = async ({userId, query}) => {
        let enrollmentDetails;
        if(query === "joined"){
            enrollmentDetails = await this.classEnrollmentModel.find({userId: userId, role: {$in: ["teacher", "student"]}}).populate("classId")
        }else if(query === "created"){
            enrollmentDetails = await this.classEnrollmentModel.find({userId: userId, role: "creator"}).populate("classId");
        }else{
            throw new ErrorHandler("invalid query", 400);
        }
        return enrollmentDetails;
    }
    
    findByEnrollmentId = async (enrollmentId) => {
   
        const enrollmentDetails = await this.classEnrollmentModel.findOne({_id: enrollmentId});
        return enrollmentDetails;
    }

    getEnrollmentsByClassId = async (classId) => {
        const enrollmentDetails = await this.classEnrollmentModel.find({classId: classId}).populate("userId");
        return enrollmentDetails;
    }
        getPendingEnrollmentsByClassId = async (classId) => {
        const enrollmentDetails = await this.classEnrollmentModel.find({classId: classId, status: "pending"}).populate("userId");
        return enrollmentDetails;
    }

    acceptEnrollment = async (enrollmentId) => {
        const enrollmentDetails = await this.classEnrollmentModel.findOne({_id: enrollmentId});
        this.verifyClassCreator(user._id, enrollmentDetails.classId);
        enrollmentDetails.status = "accepted";
        enrollmentDetails.acceptedAt = Date.now()
        enrollmentDetails.save();
        return enrollmentDetails;
    }
findEnrollmentByUserAndClass = async (classId, userId ) => {
    console.log("findEnrollmentByUserAndClass called with classId:", classId, "userId:", userId);
    const enrollmentDetails = await this.classEnrollmentModel.findOne({userId: userId, classId: classId});
    return enrollmentDetails;
}

updateEnrollmentRole = async (existEnrollment, assignedRole) => {

    existEnrollment.role = assignedRole;
    existEnrollment.save()
    return existEnrollment;
}

cancelEnrollment = async (userId,enrollmentId) => {
    const enrollmentDetails = await this.classEnrollmentModel.findOneAndUpdate({_id: enrollmentId, userId: userId}, {status: "cancelled", cancelledAt: new Date()}, {new: true});
    return enrollmentDetails;
}

verifyClassCreator = async (userId, classId) => {
    const enrollmentDetails = await this.classEnrollmentModel.findOne({userId: userId, classId: classId, role: "creator"});
    return enrollmentDetails;
}

getAllStudentsByClassIds = async (classIds, branchFilter = null) => {
    let query = {
        classId: { $in: classIds },
        role: "student",
        status: "accepted"
    };
    
    if (branchFilter) {
        query.branch = branchFilter;
    }
    
    const students = await this.classEnrollmentModel.find(query)
        .populate("userId")
        .populate("classId");
    
    return students;
}

leftClass = async (userId, enrollmentId) => {
    const enrollmentDetails = await this.classEnrollmentModel.findOneAndUpdate(
        {_id: enrollmentId, userId: userId}, 
        {status: "cancelled", cancelledAt: new Date()}, 
        {new: true}
    );
    return enrollmentDetails;
}
}

export default ClassEnrollmentRepository;