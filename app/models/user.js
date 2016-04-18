// packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user schema
var UserSchema	= new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

//hash password beforeSave
UserSchema.pre('save', function(next) {
	var user = this;

	// hash only if password is change or user is

	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to new version
		user.password = hash;
		next();
	});

});

// compare password to db password
UserSchema.methods.comparePassword = function(password) {
	var user = this

	return bcrypt.compareSync(password, user.password);
};

// return model
module.exports = mongoose.model('User', UserSchema);