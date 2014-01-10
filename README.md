# Triggerback

A sample server implementation for receiving callbacks from triggers created with the ArcGIS Geotrigger Service. Also works as a debug tool.

## Features
* Test callback URLs for triggers in the browser in real time using websockets
* Log any received POST bodies to the console as well as serving them to any active socket connection over the browser

## Instructions
Once deployed to a host, create a trigger with a callback URL set to the domain where Triggerback is hosted.

Open up the site to get an active connection, then test the trigger by either getting it to fire manually (get a device with the right tag to enter or leave the trigger you've created), or use [geofaker](http://esri.github.io/geofaker-js) to create a fake device and send some location updates. If everything's set up correctly, the site will display the JSON object sent to the callback URL when the trigger fired.

### Test locally
1. Run `npm install` to install dependencies.
2. Run `node index.js` to start the server.
3. Post some JSON to http://localhost:3000 like so:

```
curl -X POST -H "Content-Type: application/json" -d '{"hello":"world"}' http://localhost:3000/
```

## Requirements
* Node.js
* A web host to deploy to that has Node.js support

## Issues
Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing
Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2014 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's license.txt file.

[](Esri Tags: Geotrigger Test Testing Geolocation Web Mobile Browser Location)
[](Esri Language: JavaScript)