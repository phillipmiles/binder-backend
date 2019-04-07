const dotenv = require("dotenv");
const { dotenvError } = dotenv.config({ path: ".env.local" });

// TODO: FIND OUT WHAT THIS SECRET STUFF SHOULD BE
module.exports = {
    secret: "some-secret-shit-goes-here",
    refreshTokenSecret: "some-secret-refresh-token-shit",
    port: 3000,
    tokenLife: 30,
    refreshTokenLife: 86400
};