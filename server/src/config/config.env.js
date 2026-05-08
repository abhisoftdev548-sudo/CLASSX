import 'dotenv/config'

const config = {
    server: {
    port: process.env.PORT || 3000,
    },
    database: {
        mongo_uri: process.env.MONGO_URI || undefined,
    },

    auth: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
        jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
        jwt_temp_secret: process.env.JWT_TEMP_SECRET,
        jwt_temp_expires_in: process.env.JWT_TEMP_EXPIRES_IN
    },

    mailEnv: {
        smtp_host: process.env.BREVO_SMTP_HOST,
        smtp_port: process.env.BREVO_SMTP_PORT,
        smtp_user: process.env.BREVO_SMTP_USER,
        smtp_key: process.env.BREVO_SMTP_KEY,
        smtp_from: process.env.EMAIL_FROM
    },

    client: {
        url: process.env.FRONTEND_URL || "http://localhost:5173",
    }

}

export default Object.freeze(config);