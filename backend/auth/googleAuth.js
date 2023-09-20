const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
API_URL = process.env.REACT_APP_API_URL;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${API_URL}/auth/google/callback`,
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
            };
            console.log(user);
            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
