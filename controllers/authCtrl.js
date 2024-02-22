const User = require("../models/User")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;


const signToken = (user) => {
    
    const token = jwt.sign({ Id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token
}
// JWT strategy for token-based authentication
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.Id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Google strategy for Google authentication
passport.use(new GoogleStrategy({
    clientID: process.env.G_ID,
    clientSecret: process.env.G_SECRET,
    callbackURL: 'http://localhost:4276/auth/google/cb',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [firstname, lastname] = profile.displayName.split()
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.create({ firstname, lastname, googleId: profile.id });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Facebook strategy for Facebook authentication
passport.use(new FacebookStrategy({
    clientID: 'your_facebook_app_id',
    clientSecret: 'your_facebook_app_secret',
    callbackURL: 'http://localhost:4276/auth/facebook/cb',
}, async (accessToken, refreshToken, profile, done) => {
    const [firstname, lastname] = profile.displayName.split()
    try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            user = await User.create({ firstname, lastname, facebookId: profile.id });
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async function(email, password, done) {
        try {
            const user = await User.findOne({ email }).select('+password');
    
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
        
            if (!user.verifyPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
    
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

exports.signup = async (req, res, next) => {
    const newUser = await User.create(req.body)

    res.status(201).json({
        status: 'success',
        message: `You've successfully signed up`,
        data: {
            document: newUser
        }
    })
}

exports.login = (req, res, next) => {
    const token = jwt.sign({ Id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('jwt', token)
    res.status(200).json({ 
        status: 'success',
        message: `login successful`,
        token
     });
}

exports.authenticateJwt = (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        return next();
    })(req, res, next);
};

exports.googleAuth = passport.authenticate('google', {scope: ['profile', 'email']})
exports.googleAuthCBMW = passport.authenticate('google') //google's callback middleware
exports.googleAuthCB = (req, res, next) => {
    const token = jwt.sign({ Id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ 
        status: 'success',
        message: `login successful`,
        token
     });
}

exports.facebookAuth = passport.authenticate('facebook', {scope: 'public_profile'})
exports.facebookAuthCBMW = passport.authenticate('facebook') //facebook's callback middleware
exports.facebookAuthCB = (req, res, next) => {
    const token = jwt.sign({ Id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ 
        status: 'success',
        message: `login successful`,
        token
     });
}

exports.forgetPwd = async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: 'No account with this email'
        })
    }

    const token = await user.generateToken()
    user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset/${token}`

    res.status(200).json({
        status: 'success',
        message: `A link will be sent to your email. ${resetUrl}`
    })
}

exports.resetPwd = async (req, res, next) => {
    const {password} = req.body
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({resetToken: hashedToken, resetExpires: {$gt: Date.now()}})

    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: `Invalid token`
        })
    }

    user.reset(password)
    user.save();

    res.status(200).json({
        status: "success",
        message: "Password successfully reset"
    })
}

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.send(`You're not permittted to perform this action.`)
        };
        next();
    }
}
