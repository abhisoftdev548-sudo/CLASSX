

class  ClassRepositiory {
    constructor(classModel){
        this.classModel = classModel;
    }

        createClass = async ({userId, className, classSubject, classSession, classCode, studentCode, teacherCode}) => {
  
            const result = await this.classModel.create({
                createdBy: userId,
                className: className,
                classSubject: classSubject,
                classSession: classSession,
                classCode: classCode,
                studentCode: studentCode,
                teacherCode: teacherCode,
            })
            return result;
        }

        findClassByCode = async (classCode) => {
            const result = await this.classModel.findOne({classCode: classCode})
            return result;
        }

        findClassByName = async (className) => {
            const result = await this.classModel.findOne({className: className})
            return result;
        }

        findClassById = async (classId) => {
            const result = await this.classModel.findOne({_id: classId})
            return result;
        }

        findClassesByUserId = async (userId) => {
            const result = await this.classModel.find({createdBy: userId})
            return result;
        }
}

export default ClassRepositiory;