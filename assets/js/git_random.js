var GitRandom = function () {

    var usersUrl = "https://api.github.com/users",
        userUrl = "https://api.github.com/users/:user:",
        repositoriesUrl = "https://api.github.com/users/:user:/repos",
        repositories = ".repo-list",
        tokenStorageKey = "git_random",
        status = ".status_container",
        success = ".success_container";

    // Get user
    var getUser = function () {

        // set start message
        setStartMessage();

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
                }).fail(function (error) {
                    handleError(error);
                });

                getRepositories(user);
            }
        }).fail(function (error) {
            handleError(error);
        });
    };

    // set start message
    var setStartMessage = function () {
        $(status).html("<h3>Crunching..... Please wait!</h3>").show();
    };

    // handle all errors
    var handleError = function (error) {

        var errorMessage = "";
        if (error.statusText == "Forbidden") {
            errorMessage = "<h3>Oops! Seems like you did not set the API token. Wait another hour for github to refresh your rate limit or better add a token in `Git Random Options` to get more results.</h3>";
        }

        if (errorMessage) {
            $(status).addClass("error").html(errorMessage).show();
        }
    };

    // display results
    var displayResults = function () {
        $(status).hide();
        $(success).show();
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

            // display results
            displayResults();

        }).fail(function (error) {
            handleError(error);
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