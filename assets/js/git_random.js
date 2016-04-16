/**
 * @returns {{init: init}}
 * @constructor
 */
var GitRandom = function () {

    var usersUrl = "https://api.github.com/users",
        userUrl = "https://api.github.com/users/:user:",
        repositoriesUrl = "https://api.github.com/users/:user:/repos",
        repositories = ".repo-list",
        tokenStorageKey = "git_random",
        vcard = ".vcard",
        status = ".status_container",
        success = ".success_container",
        accessTokenKey = "accessToken";

    /**
     * Get user
     */
    var getUser = function () {

        // set start message
        setStartMessage();

        var token = (getAccessToken() !== false) ? "access_token=" + getAccessToken() : "";

        usersUrl += (getLastUserId() !== false) ? "?since=" + getLastUserId() + "&" + token : token;

        $.get(usersUrl, function (response) {

            if (response) {
                var user = response[0];

                // cache current user id
                setLastUserId(user.id);

                userUrl = userUrl.replace(':user:', user.login) + "?" + token;
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

    /**
     * Set start message
     */
    var setStartMessage = function () {
        $(status).html("<h3>Crunching..... Please wait!</h3>").show();
    };

    /**
     * Handle all errors
     * @param error
     */
    var handleError = function (error) {

        var errorMessage = "";
        if (error && error.statusText.toLowerCase() == "forbidden") {
            errorMessage = "<h3>Oops! Seems like you did not set the API token. Wait another hour for github to refresh your rate limit or better add a token in `Git Random Options` to get more results.</h3>";
        } else if (error && error.statusText.toLowerCase() == 'unauthorized') {
            errorMessage = "<h3>Oops! Seems to be a problem with your API token. Could you verify the API token you entered in extension options.</h3>";
        } else {
            errorMessage = "<h3>Oops! Could you please refresh the page.</h3>";
        }

        if (errorMessage) {
            $(status).addClass("error").html(errorMessage).show();
        }
    };

    /**
     * Display results
     */
    var displayResults = function () {
        $(status).hide();
        $(success).show();
    };

    /**
     * Get last displayed user id
     * @returns {boolean}
     */
    var getLastUserId = function () {
        if (localStorage.getItem(tokenStorageKey)) {
            return localStorage.getItem(tokenStorageKey);
        }
        return false;
    };

    /**
     * Get access token
     * @returns {boolean}
     */
    var getAccessToken = function () {
        if (localStorage.getItem(accessTokenKey)) {
            return localStorage.getItem(accessTokenKey);
        }
        return false;
    };

    /**
     * Set last displayed user id
     * @param id
     */
    var setLastUserId = function (id) {
        localStorage.setItem(tokenStorageKey, id);
    };

    /**
     * Transform user object
     * @param user
     * @returns {*}
     */
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

    /**
     * Get repositories of the selected user
     * @param user
     */
    var getRepositories = function (user) {

        var token = (getAccessToken() !== false) ? "access_token=" + getAccessToken() : "";

        repositoriesUrl = repositoriesUrl.replace(':user:', user.login) + "?" + token;
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

    /**
     * Prepare html
     * @param repos
     */
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

$(function () {
    var random = new GitRandom();
    random.init();
});
