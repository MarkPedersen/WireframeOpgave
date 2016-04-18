angular.module('userCtrl', ['userService'])

	.controller('userController', function(User) {
		var vm = this;
		vm.processing = true;
		User.all()
			.success(function(data) {
				vm.processing = false;

				vm.users = data;
			});


		// delete a user
		vm.deleteUser = function(id) {
			vm.processing = true;
			User.delete(id)
				.success(function(data) {
					User.all()
						.success(function(data) {
							vm.processing = false;
							vm.users = data;
						});
				});
		};
	})

	// Controller for user creation page
	.controller('userCreateController', function(User) {
		var vm = this;

		// variable to show/hide elements of the view
		// differentiates between create or edit pages
		vm.type = "create";

		// function to create a user
		vm.saveUser = function() {
			vm.processing = true;

			// clear the message
			vm.message = '';

			// use the create function in the userService
			User.create(vm.userData)
				.success(function(data) {
					vm.processing = false;

					// clear the form
					vm.userData = {};
					vm.message = data.message;
				});
		};
	})

	.controller('userEditController', function($routeParams, User) {
		var vm = this;

		//variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'edit';

		// get the user data for user
		// $routeParams is the way we grab data from the URL
		User.get($routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
			});

			// function to save the user
			vm.saveUser = function() {
				vm.processing = true;
				vm.message = '';

				// call the userService function to update
				User.update($routeParams.user_id, vm.userData)
					.success(function(data) {
						vm.processing = false;

						// clear the form
						vm.userData = {};

						// bind the message from our API
						vm.message = data.message;
					});
			};
	})







