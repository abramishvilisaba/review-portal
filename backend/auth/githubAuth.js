const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
API_URL = process.env.REACT_APP_API_URL;

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${API_URL}/auth/github/callback`,
        },
        function (accessToken, refreshToken, profile, done) {
            const user = {
                id: profile.id,
                displayName: profile.displayName,
                email: profile.emails,
            };
            console.log(user);
            // User.findOrCreate({ githubId: profile.id }, function (err, user) {
            //     return done(err, user);
            // });
            // const user = {
            //     id: profile.id,
            //     displayName: profile.displayName,
            //     email: profile.emails[0].value,
            // };
            // console.log(user);
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
