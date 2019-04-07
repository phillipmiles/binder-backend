const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const argon2 = require('argon2');
// const bcrypt = require('bcrypt');

// const User = require('../models').User;

const User = require('../models').User;


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
    function(email, password, done) {
        
        User.findByEmail(email).then(user => {
        
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            if (user) {
                

                // return validPassword(user.password, password, function(err, res) {
                //     if(res) {
                //         // return res;
                //         // TODO: Don't return password in user but still serialise this correctly
                //         // with serializeUser.
                //         console.log('congrats', res);
                //         return done(null, user);
                //     } else if (err) {
                //         // return err;
                //         console.log('err', err);
                //         return done(err);
                //     } else {
                //         return done(null, false, { message: 'Incorrect password.' });
                //     } 
                // })




                 return validPassword(user.password, password) 
                    .then((validated) => {
                        if(validated) {
                            console.log('congrats', user);
                            // return done(user);
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                    })
                    .catch((error) => {
                        console.log('error')
                        console.log(error)
                        return done(error);
                    });

            }
        }).catch(function (error) {
            return done(error);
        });
    }
));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.uuid);
});

passport.deserializeUser(function(uuid, done) {
    User.findById(uuid)
    .then(user => {
        done(null, user);   
    }).catch(function (error) {
        return done(error);
    });
});



function validPassword(hash, password, callback) {

    // return bcrypt.compare(password, hash, callback);
    console.log(hash, password)
    return argon2.verify(hash, password)
        .then((verified) => {
            console.log('\n' + verified)
            if(verified) {
                return verified
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.log('error')
            console.log(error)
            return error;
        })
}