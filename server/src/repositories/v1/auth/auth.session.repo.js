import { run } from "node:test";
import sessionModel from "../../../models/session.model.js";
import ErrorHandler from "../../../utils/ErrorHandler.js";
import bcrypt from "bcryptjs";



class SessionRepository {
    constructor(model) {
        this.model = model;
    }


    async createSession({userId, refreshToken, userAgent, ip}) {
        



        return await this.model.create({
            user: userId,
            refreshToken: refreshToken,
            userAgent: userAgent,
            ip: ip
        });
    }

    async createOrUpdateSession({ userId, refreshToken, userAgent, ip }) {


        const filter = { 
            user: userId, 
            userAgent: userAgent 
        };
        
        const hashedRefreshToken = await bcrypt.hash(refreshToken,  10);


        const update = { 
            refreshToken: hashedRefreshToken, 
            ip: ip,
            lastUsed: new Date() 
        };
        const count = await this.model.countDocuments({ user: userId });

        if (count >= 4) {
            const oldest = await this.model.findOne({ user: userId }).sort({ createdAt: 1 });
            if (oldest) await this.model.findByIdAndDelete(oldest._id);
        }
        
        return await this.model.findOneAndUpdate(filter, update, {upsert: true, new: true, runValidators: true});
    }

    async findByToken(refreshToken) {
        return await this.model.findOne({ refreshToken });
    }

    async findAndupdateSession(oldToken, newToken, newIp, userId, userAgent) {

        const session = await this.model.findOne(
            { user: userId, userAgent },
        );
        
        if(!session){
            throw new Error("Session not found or invalid token");
        }

        const verifiedSession = await session.compareRefreshToken(oldToken);
        if(!verifiedSession){
            throw new ErrorHandler("Session not found or invalid token");
        }
        const newHashedToken = await bcrypt.hash(newToken,  10);
        session.refreshToken = newHashedToken;
        session.ip = newIp;
        await session.save();
        return session;
    }

    async deleteByIdAndAgent(userId, userAgent) {
        return await this.model.deleteOne({ user: userId, userAgent });
    }

    async deleteAllByUserId(userId) {
        return await this.model.deleteMany({ user:userId });
    }
}


export default SessionRepository;