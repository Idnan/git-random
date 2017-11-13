/**
* Options module to manage the options
*/
class Options {
  
  get gitToken () {
    return '.git_token'
  }
  
  get quoteItem () {
    return '.quote-item'
  }
  
  get accessTokenKey () {
    return 'accessToken'
  }
  
  /**
  * Save token in user local storage
  * @param token
  */
  saveToken (token) {
    localStorage.setItem(this.accessTokenKey, token)
  }
  
  /**
  * Get access token
  * @returns {?string}
  */
  get accessToken () {
    return localStorage.getItem(this.accessTokenKey)
  }
  
  /**
  * Initializes the options page
  * Performs the UI bindings
  */
  init () {
    const git = document.querySelector(this.gitToken)
    const save = document.querySelector('.save-token')
    const quote = document.querySelector(this.quoteItem)
    
    if (this.accessToken)
    git.value = this.accessToken
    
    save.addEventListener('click', event => {
      event.preventDefault()
      if (!git.value.trim()) return
      
      this.saveToken(git.value.trim())
      quote.innerHTML = 'Woohou! Token saved.'
    })
  }
}

(function () {
  const options = new Options()
  options.init()
})()