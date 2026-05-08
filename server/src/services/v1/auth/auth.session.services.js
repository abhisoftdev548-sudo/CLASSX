import authSessionRepo from "../../../repositories/v1/auth/auth.session.repo.js";

class SessionService {
    constructor(sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    async createSession(userId, refreshToken, userAgent, ip) {
        return await this.sessionRepo.createSession({
            userId,
            refreshToken,
            ip,
            userAgent
        });
    }

    async createOrUpdateSession(userId, refreshToken, userAgent, ip) {
        return await this.sessionRepo.createOrUpdateSession({
            userId, refreshToken, userAgent, ip
        })
    }

    
    async updateSession(oldToken, newToken, ip, userId, userAgent) {
        const session = await this.sessionRepo.findAndupdateSession(oldToken, newToken, ip, userId, userAgent);
        if (!session) {
            throw new Error("Session not found or invalid token");
        }
        return session;
    }


    async verifyAndGetSession(refreshToken) {
        const session = await this.sessionRepo.findByToken(refreshToken);
        return !!session; 
    }

    async terminateSession(userId, userAgent) {
        return await this.sessionRepo.deleteByIdAndAgent(userId, userAgent);
    }

    async terminateAllUserSessions(userId) {
        return await this.sessionRepo.deleteAllByUserId(userId);
    }
}

export default SessionService;