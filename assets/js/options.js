/**
 * Options module to manage the options
 * @returns {{init: init}}
 * @constructor
 */
function Options() {

    var git_token = ".git_token",
        quote_item = ".quote-item",
        access_token_key = "accessToken";

    /**
     * Performs the UI bindings
     */
    var bindUI = function () {

        if (getAccessToken() !== false) {
            $(git_token).val(getAccessToken());
        }

        $(document).on('click', '.save-token', function (e) {
            e.preventDefault();

            if ($(git_token).val().trim()) {
                saveToken($(git_token).val().trim());
                $(quote_item).html('Woohoo! Token saved.');
            }
        });
    };

    /**
     * Save token in user local storage
     * @param token
     */
    var saveToken = function (token) {
        localStorage.setItem(access_token_key, token);
    };

    /**
     * Get access token
     * @returns {boolean}
     */
    var getAccessToken = function () {
        if (localStorage.getItem(access_token_key)) {
            return localStorage.getItem(access_token_key);
        }
        return false;
    };

    return {

        /**
         * Initializes the options page
         */
        init: function () {
            bindUI();
        }
    };
}

$(function () {
    var options = new Options();
    options.init();
});