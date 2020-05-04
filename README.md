# Queued, for Spotify
> Collaborate on a Spotify queue of songs together using one users' account as the host

![Homepage](assets/queued-homepage.png)

## Prerequisites
Make sure you have a Spotify account before working on this project so you can use your own `client id` and `client secret`.

## Getting started
1. Clone this repository
2. Rename `.env.example` to `.env` and fill in the blanks
3. Install the dependencies
4. Run a development server on https://localhost:3000

```bash
git clone git@github.com:kriskuiper/real-time-web-1920.git

yarn install

yarn run dev
```

## About the Spotify API
I use the Spotify API to communicate with the Spotify platform. To work with most of the endpoints of the API you need some form of OAuth flow in your application. You can read all about how I set that up in the [security](#security) section. All communication with Spotify is done through some simple methods that are all in the `server/lib/spotify-auth.js` file and the `server/lib/spotify-fetch.js` file. You can find all endpoints in the `server/lib/constants` file.

### Scopes
When working with the Spotify API, you need to define some scopes that your app needs access to. The user will see what data your app is allowed to access after they click 'confirm'. The scopes I use in this project are:
- `user-read-private`
	- Used to get a users display name.
- `user-modify-playback-state`
	- Used to be able to add songs to the queue.

You can read more about the scopes in the [Spotify API docs](https://developer.spotify.com/documentation/general/guides/scopes/).

### Used endpoints
- `https://accounts.spotify.com/authorize`
	- Used for starting off the OAuth flow; Is used as a redirect link to let users authorize the application to use their data.

- `https://accounts.spotify.com/api/token`
	- Used to get the access- and refresh tokens from Spotify; You get a code after the user has authorized your application which you can then use to get the tokens.

- `https://api.spotify.com/v1/search` :key: needs access token
	- Used to make a user search for songs; You need an access token to use this endpoint.

- `https://api.spotify.com/v1/me/player/queue` :key: needs access token
	- Used to add songs to the queue of the host; Here we need the access token of the host only, more on that later.

- `https://api.spotify.com/v1/me` :key: needs access token
	- Used to get a users display name so the host knows who wants to join the party.

- `https://api.spotify.com/v1/tracks/` :key: needs access token
	- Used to get data about the song that's added to the queue like the title.


## Data life cycle flow
### Hosting a party
![Hosting a party life cycle](assets/hosting-a-party.png)

### Joining a party
![Joining a party](assets/joining-a-party.png)

### Add song to queue
![Add song to queue](assets/add-song-to-queue.png)

## Use of websockets
This project leans heavily on the use of websockets because of it's realtime nature. Here are some commands that get sent around by server and client.

### From server to client
<!-- Some info -->

### From client to server
<!-- Some more info -->
