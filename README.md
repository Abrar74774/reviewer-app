# Reviewer

App for adding and reviewing places and points of interest. Built with Expressjs, Passportjs. Uses MongoDB Cloud, Mapbox GL JS, Mapquest.

## Installation

Run `npm install` to install dependencies.

Create a directory named `/config`

Create a file inside `/config` named `config.env` and fill in the following configurations:

```
NODE_ENV=development
PORT=3000

MONGO_URI=< Insert your MongoDB cloud database URI here >

GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=< Insert your mapquest api key here >
```
