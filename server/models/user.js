// user model
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    mdbueid: {
        type: String,
        required: true,
        unique: true
    },
    password: String
    //email: String,
    //password: String,
    //username: String,
    //firstname:String,
    //lastname: String,
    //affiliation: String
});

userSchema.plugin(passportLocalMongoose);

//Options
//
//When plugging in Passport-Local Mongoose plugin additional options can be provided to configure the hashing algorithm.
//
//    User.plugin(passportLocalMongoose, options);
//
//Main Options
//
//    saltlen: specifies the salt length in bytes. Default: 32
//    iterations: specifies the number of iterations used in pbkdf2 hashing algorithm. Default: 25000
//    keylen: specifies the length in byte of the generated key. Default: 512
//    digestAlgorithm: specifies the pbkdf2 digest algorithm. Default: sha256. (get a list of supported algorithms with crypto.getHashes())
//    interval: specifies the interval in milliseconds between login attempts. Default: 100
//    usernameField: specifies the field name that holds the username. Defaults to 'username'. This option can be used if you want to use a different field to hold the username for example "email".
//    usernameUnique : specifies if the username field should be enforced to be unique by a mongodb index or not. Defaults to true.
//    saltField: specifies the field name that holds the salt value. Defaults to 'salt'.
//    hashField: specifies the field name that holds the password hash value. Defaults to 'hash'.
//    attemptsField: specifies the field name that holds the number of login failures since the last successful login. Defaults to 'attempts'.
//    lastLoginField: specifies the field name that holds the timestamp of the last login attempt. Defaults to 'last'.
//    selectFields: specifies the fields of the model to be selected from mongodb (and stored in the session). Defaults to 'undefined' so that all fields of the model are selected.
//    usernameLowerCase: convert username field value to lower case when saving an querying. Defaults to 'false'.
//    populateFields: specifies fields to populate in findByUsername function. Defaults to 'undefined'.
//    encoding: specifies the encoding the generated salt and hash will be stored in. Defaults to 'hex'.
//    limitAttempts: specifies whether login attempts should be limited and login failures should be penalized. Default: false.
//    maxAttempts: specifies the maximum number of failed attempts allowed before preventing login. Default: Infinity.
//    passwordValidator: specifies your custom validation function for the password in the form 'function(password,cb)'. Default: validates non-empty passwords.
//    usernameQueryFields: specifies alternative fields of the model for identifying a user (e.g. email).
//
//Attention! Changing any of the hashing options (saltlen, iterations or keylen) in a production environment will prevent that
//existing users to authenticate!
//
//Error Messages
//Override default error messages by setting options.errorMessages.
//
//    MissingPasswordError 'No password was given'
//    AttemptTooSoonError 'Account is currently locked. Try again later'
//    TooManyAttemptsError 'Account locked due to too many failed login attempts'
//    NoSaltValueStoredError 'Authentication not possible. No salt value stored'
//    IncorrectPasswordError 'Password or username are incorrect'
//    IncorrectUsernameError 'Password or username are incorrect'
//    MissingUsernameError 'No username was given'
//    UserExistsError 'A user with the given username is already registered'
//
//Hash Algorithm
//
//Passport-Local Mongoose use the pbkdf2 algorithm of the node crypto library. Pbkdf2 was chosen because platform independent
//(in contrary to bcrypt). For every user a generated salt value is saved to make rainbow table attacks even harder.


/*// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};*/



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
