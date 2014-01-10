# Triggerback
A debug server to receive callbacks from triggers created with the ArcGIS Geotrigger Service.

The server will log POST bodies it receives to the console as well as serving them over a socket in the browser.

## Usage
Once deployed to a host, create a trigger with a callback URL set to the domain where Triggerback is hosted ([demo](http://triggerback.herokuapp.com)).

Open up the site to get an active connection, then test the trigger by either getting it to fire manually (get a device with the right tag to enter or leave the trigger you've created), or use [geofaker](http://esri.github.io/geofaker-js) to create a fake device and send some location updates. If everything's set up correctly, the site will display the JSON object sent to the callback URL when the trigger fired.

## Test locally
1. Run `npm install` to install dependencies.
2. Run `node index.js` to start the server.
3. Post some JSON to http://localhost:3000 like so:

```
curl -X POST -H "Content-Type: application/json" -d '{"hello":"world"}' http://localhost:3000/
```
