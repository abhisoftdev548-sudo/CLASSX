import crypto from 'crypto';
import classModel from '../../../models/class.model.js'; // Tumhara model

const generateUniqueCode = async (prefix) => {
    let isUnique = false;
    let code = "";

    while (!isUnique) {
        // 4 bytes = 8 hex characters (tumhare format ke liye)
        const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
        code = `${prefix}-${randomBytes}`;

        // Database mein check karo
        const existingClass = await classModel.findOne({ classCode: code });

        // Agar database mein nahi mila, toh unique hai!
        if (!existingClass) {
            isUnique = true;
        }
    }
    return code;
};

export default generateUniqueCode;