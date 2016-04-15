var GitRandom = function () {

    var usersUrl = "https://api.github.com/users",
        repositoriesUrl = "https://api.github.com/users/:user:/repos";

    // Get user
    var getUser = function () {

        // @todo get since from user cache
        // ?since=26
        $.get(usersUrl, function (response) {

        });
    };

    // Get repositories of the selected user
    var getRepositories = function () {

    };

    var get = function () {
        getUser();
    };

    return {
        init: function () {
            get();
        }
    };
};

var random = new GitRandom();
random.init();