var GitRandom = function () {

    var usersUrl = "https://api.github.com/users",
        userUrl = "https://api.github.com/users/:user:",
        repositoriesUrl = "https://api.github.com/users/:user:/repos",
        repositories = ".repo-list",
        tokenStorageKey = "git_random";

    // Get user
    var getUser = function () {

        usersUrl += (getLastUserId() !== false) ? "?since=" + getLastUserId() : "";

        $.get(usersUrl, function (response) {

            if (response) {
                var user = response[0];

                // cache current user id
                setLastUserId(user.id);

                userUrl = userUrl.replace(':user:', user.login);
                $.get(userUrl, function (response) {

                    user = transformUser(response);

                    var source = $("#vcard").html();
                    var template = Handlebars.compile(source);
                    $(vcard).append(template(user));
                });

                getRepositories(user);
            }
        });
    };

    // Get last displayed user id
    var getLastUserId = function () {
        if (localStorage.getItem(tokenStorageKey)) {
            return localStorage.getItem(tokenStorageKey);
        }
        return false;
    };

    // Set last displayed user id
    var setLastUserId = function (id) {
        localStorage.setItem(tokenStorageKey, id);
    };

    // Transform user object
    var transformUser = function (user) {

        user.company_display = user.company ? true : false;
        user.location_display = user.location ? true : false;
        user.email_display = user.email ? true : false;
        user.blog_display = user.blog ? true : false;
        user.created_at_display = user.created_at ? true : false;

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (user.created_at) {
            var date = new Date(user.created_at);
            user.created_at = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        }

        return user;
    };

    // Get repositories of the selected user
    var getRepositories = function (user) {

        repositoriesUrl = repositoriesUrl.replace(':user:', user.login);
        $.get(repositoriesUrl, function (repos) {

            if (repos) {
                prepareHtml(repos);
            }
        });
    };

    // prepare html
    var prepareHtml = function (repos) {
        var source = $("#repository_list").html();
        var template = Handlebars.compile(source);

        var data = {
            repositories: repos
        };
        $(repositories).append(template(data));
    };

    return {
        init: function () {
            getUser();
        }
    };
};

var random = new GitRandom();
random.init();