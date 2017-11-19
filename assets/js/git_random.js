class GitRandom {

    /**
     * Set start message
     */
    init() {
        const status = document.querySelector(this.status);
        status.innerHTML = '<h3>Crunching..... Please wait!</h3>';
        status.style.display = 'block';
        this.fetchUser()
    }

    fetchUser() {
        const token = this.accessToken;
        const usersUrl = this.lastUserId ? `?since=${this.lastUserId}&${token}` : `?${token}`;
        fetch(`${this.usersUrl}${usersUrl}`)
            .then(response => response.json())
            .then(json => json[0])
            .then(user => this.loadUser(user))
            .then(user => this.fetchRepositories(user))
            .catch(error => this.handleError(error))
    }

    /**
     * Load an user and compile template
     * @param user
     */
    loadUser(user) {
        localStorage.setItem(this.tokenStorageKey, user.id);
        const userUrl = `${this.userUrl.replace(':user:', user.login)}?${this.accessToken}`;
        fetch(userUrl)
            .then(response => response.json())
            .then(user => this.transformUser(user))
            .then(user => {
                const source = document.querySelector('#vcard').innerHTML;
                const template = Handlebars.compile(source);
                document.querySelector(this.vcard).insertAdjacentHTML('beforeend', template(user))
            })
            .catch(error => this.handleError(error));
        return user
    }

    /**
     * Get repositories of the selected user
     * @param user
     */
    fetchRepositories(user) {
        const repositoriesUrl = `${this.repositoriesUrl.replace(':user:', user.login)}?${this.accessToken}`;
        fetch(repositoriesUrl)
            .then(response => response.json())
            .then(repositories => this.loadRepositories(repositories))
            .catch(error => this.handleError(error));

        return user
    }

    loadRepositories(repositories) {
        if (repositories) this.prepareHtml(repositories);
        this.displayResults()
    }

    /**
     * Prepare html
     * @param repositories
     */
    prepareHtml(repositories) {
        const source = document.querySelector('#repository_list').innerHTML;
        const template = Handlebars.compile(source);
        document.querySelector(this.repositories).insertAdjacentHTML('beforeend', template({repositories}));
    }

    /**
     * Handle all errors
     * @param error
     */
    handleError(error) {
        const status = document.querySelector(this.status);

        const text = error && error.name.toLowerCase() || '';
        const message = (text == 'forbidden')
            ? '<h3>Oops! Seems like you did not set the API token. Wait another hour for github to refresh your rate limit or better add a token in `Git Random Options` to get more results.</h3>'
            : (text == 'unauthorized')
                ? '<h3>Oops! Seems to be a problem with your API token. Could you verify the API token you entered in extension options.</h3>'
                : '<h3>Oops! Could you please refresh the page.</h3>';

        (status.classList) ? status.classList.add('error') : status.className += ' error';
        status.innerHTML = message;
        status.style.display = 'block';
    }

    /**
     * Display results
     */
    displayResults() {
        document.querySelector(this.status).style.display = 'none';
        document.querySelector(this.success).style.display = 'block';
    }

    /**
     * Transform user object
     * @param user
     * @returns {*}
     */
    transformUser(user) {
        user = {
            ...user,
            company_display: !!user.company,
            location_display: !!user.location,
            email_display: !!user.email,
            blog_display: !!user.blog,
            created_at_display: !!user.created_at
        };

        if (user.created_at) {
            const date = new Date(user.created_at);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            user.created_at = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }

        return user
    };

    /**
     * Set last displayed user id
     * @param id
     */
    setLastUserId(id) {
        localStorage.setItem(this.tokenStorageKey, id);
    }

    /**
     * Get last displayed user id
     * @returns {?string}
     */
    get lastUserId() {
        return localStorage.getItem(this.tokenStorageKey);
    }

    /**
     * Get access token format for query
     * @returns {?string}
     */
    get accessToken() {
        const localValue = localStorage.getItem(this.accessTokenKey);
        return localValue ? `access_token=${localValue}` : '';
    }

    get usersUrl() {
        return 'https://api.github.com/users';
    }

    get userUrl() {
        return 'https://api.github.com/users/:user:';
    }

    get repositoriesUrl() {
        return 'https://api.github.com/users/:user:/repos';
    }

    get repositories() {
        return '.repo-list';
    }

    get tokenStorageKey() {
        return "git_random";
    }

    get vcard() {
        return '.vcard';
    }

    get status() {
        return '.status_container';
    }

    get success() {
        return '.success_container';
    }

    get accessTokenKey() {
        return 'accessToken';
    }
}

(function () {
    const gitRandom = new GitRandom();
    gitRandom.init();
})();
