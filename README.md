<p align="center">
	<img width="128" src="http://i.imgur.com/xSva32j.png" text-align="center">
</p>

> Chrome extension - Replaces new tab with random github user's profile

Whenever you will open a new tab, you will be presented with a page similar to following

![New Tab](http://i.imgur.com/hr4ikum.png)

## Installation

Extension itself doesn't need any setup. All you have to do is

- Install it from [Chrome Webstore](https://goo.gl/EjSMh9)  or [manually install it](http://superuser.com/a/247654/6877).


Github API has rate limit applied in their API and although the extension implements the caching in order to make sure that the rate limit may not be crossed but however I would recommend you to set the API token in the extension in order to increase the quota. 

Here is how you can do that
   
- Go to the [`Settings > Personal Access Tokens`](https://github.com/settings/tokens) of your github profile
- Click `Generate New Token` button. Give the token description and select the scope called `public_repo` under `repo` and click `Generate Token`.
- You will be presented with the generated token. Copy the token.
- Right click on the extension icon and click `Options`. Paste the API token in the given field and click save

![Options Page](http://i.imgur.com/KdK5S6L.png)

- Voila! You are all set to go.

## Contribution
I'd love to hear what you have to say. Reach me out at mahradnan@hotmail.com or on twitter @AdnaanAhmeed

## License
MIT © [Adnan Ahmed](https://github.com/idnan)
