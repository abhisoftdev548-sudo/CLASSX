

class ClassEnrollmentRepository {
    constructor(classEnrollmentModel) {
        this.classEnrollmentModel = classEnrollmentModel;
    }

    enrollToClass = async ({classId, userId, role, joinedAt}) => {
        const enrollmentDetails = await this.classEnrollmentModel.create({
            classId: classId,
            userId: userId,
            role: role,
            joinedAt: joinedAt
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
            throw new ErrorHandler(400, "invalid query");
        }
        return enrollmentDetails;
    }
    
    findByEnrollmentId = async (enrollmentId) => {
   
        const enrollmentDetails = await this.classEnrollmentModel.findOne({_id: enrollmentId});
        return enrollmentDetails;
    }
}

export default ClassEnrollmentRepository;