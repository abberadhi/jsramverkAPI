[![Build Status](https://app.travis-ci.com/abberadhi/jsramverkAPI.svg?branch=master)](https://app.travis-ci.com/abberadhi/jsramverkAPI)

generiic document editor
=========
The api is structured such that `app.js` is the entry point and routes are loaded in from `src/routes/`, which uses `src/models/` for functionality. 
___ 
## Installation
1. Clone repository
2. ``cd jsramverkAPI && npm install``
3. ``cp .env-example .env``. Update the file and insert your own credentials
4. `npm run watch`
_____

## API usage
| route    | method | description                                
|----------|--------|--------------------------------------------
| /find    | POST   | find doc by id                             
| /findall | POST   | get all docs                              
| /update  | POST   | updates post or creates if it doesnt exist
| /delete  | POST   | removes post by id                        