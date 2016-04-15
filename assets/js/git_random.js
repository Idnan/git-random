var GitRandom = function () {

    var usersUrl = "https://api.github.com/users",
        repositoriesUrl = "https://api.github.com/users/:user:/repos";

    // Get user
    var getUser = function () {

        // @todo get since from user cache
        // ?since=26
        $.get(usersUrl, function (response) {

            if (response) {
                var user = response[0];
                getRepositories(user);
            }
        });
    };

    // Get repositories of the selected user
    var getRepositories = function (user) {

        repositoriesUrl = repositoriesUrl.replace(':user:', user.login);
        $.get(repositoriesUrl, function (response) {

            if (response) {
                prepareHtml(response);
            }
        });
    };

    // prepare html
    var prepareHtml = function (response) {

    };

    return {
        init: function () {
            getUser();
        }
    };
};

var random = new GitRandom();
random.init();