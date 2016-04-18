var config = require('../../config')





module.exports = function(app, express) {
//ROUTES FOR API
///=======================
// get an instance of the express router
var apiRouter = express.Router();



//route for authenticating users
apiRouter.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {

		if(err) throw err;

		//no user with that username
		if (!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user) {

			// check password
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			} else {

				// if user found and password checks out
				// create token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, config.secret, {
					expiresInMinutes: 1140 // 24 hours
				});

				// return info and token via json
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}

	});

});




//middleware for apiRouter requests
apiRouter.use(function(req, res, next) {
	console.log("api accessed");


	// get token from header
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];


	//decode
	//token exists
	if (token) {
		// verify signature and valid

		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// token checks out, save for use in routes
				req.decoded = decoded;
				next();
			}
		});

	} else {
		// no token provided
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}


	//next();
});


//test route
apiRouter.get('/', function(req, res) {
	res.json({ message: 'Welcome' });
});




return apiRouter;
};

