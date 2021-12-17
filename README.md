React native point of sale app.

# Screenshots

![Screen Bills](/assets/screen-bills.png?raw=true "Screen Bills")
![Screen Categories](/assets/screen-categories.png?raw=true "Screen Categories")
![Screen Category List](/assets/screen-category-list.png?raw=true "Screen Category List")
![Screen Items](/assets/screen-items.png?raw=true "Screen Items")
![Screen Modifier Select](/assets/screen-modifier-select.png?raw=true "Screen Modifier Select")
![Screen Modifiers](/assets/screen-modifiers.png?raw=true "Screen Modifiers")
![Screen Prices](/assets/screen-prices.png?raw=true "Screen Prices")
![Screen Reports](/assets/screen-reports.png?raw=true "Screen Reports")
![Screen Settings](/assets/screen-settings.png?raw=true "Screen Settings")
![Screen Prep](/assets/screen-prep.png?raw=true "Screen Prep")
![Screen Transactions](/assets/screen-transactions.png?raw=true "Screen Transactions")

# Dev notes

tools: heroku is used to host server
db: mongodb - can find srv in heroku
mongodb compass: for inspecting db. srv in heroku
cocoapods: for running client

# Running server

1. running the server locally:

- yarn docker:build to build the containers
- the dockerfile is configured for production so will need to run yarn docker:packages afterwards to build the dependencies fully.

# Running client

Xcode: xcode is required in order to build the app. Its possible to download multiple version from here including the command line tools: https://developer.apple.com/download/all/

Note: Might encounter a few syntax errors in node modules. I cant find the stack overflow link anymore but there are 2 files to update to fix this. One is to update a generic to Class. The other is to simply comment out the contents of a catch statement where its trying to log. If you check the build errors when it fails it shoudl show where the errors are occuring and you can do the above.

build steps
1. run nvm use from `pos-client/`
2. yarn
3. cd into `/ios` and run `pod install` OR run 'yarn pod` from `pos-client/`

init app
1. `yarn start` to run metro debugger
2. `yarn dev:ios` to start app. 
Note: you might get an error regarding simulator not found. If this is the case - check the simulator is installed in xcode (pay attention to version / generation as it needs to match). If outdated, updated the script to target a later ios simulator.
3. DEBUG: open context menu with cmd+d and select debug to open chrome debugger
## Running on Device

**Restoring device:**

1. connect to mac using official cable.
2. power off ipad
3. boot into revovery mode: - press volume up then - press and hold power and home button until the recovery screen is shown (power cable
4. open finder on mac. The ipad should be shown on the left sidebar under "locations"
   1. press restore button and wait for device to complete the process.

**Wireless debugging**

1. connect device and open xcode.
2. device should be should in the device list
3. go to navigate window -> devices & simulators - find the connected device and tick "connect via network"

**Signing**

1. navigate to the project - select project target.
2. click project target -> "signing &n capabilities" - add a team by logging in with account (need active devloper licence frmo apple which costs $99). This is required if deploying with appdb

3. device trusting (when installed do this on the device to trust the app)
   1. after signing go to device - `Settings → General → DeviceManagement → <AppName> → Trust`
   2. building - depending on the device it may be required to alter the target os under general-> deployment info

## Deploying (no apple developer license)


1. cd /client and run `yarn set:production`
5. Build APK
   1. Open xcode and open the project
   2. Set the scheme to Generic Device (any ios device) and build. In 13.1 this is just called any iOS device (arm64) . This step is important otherwise the upload to appdb will fail with the error. "IPA is encrypted (downloaded from AppStore). You should crack it or find cracked version".
   3. in your list where all your swift files are search for “.app”. In xcode 13.1 it can be found under Products -> Positive.
   4. Under the products folder right click your app and select “Show in Finder”
   5. make a folder on the Desktop named “Payload” and copy your app into it
   6. right click the folder “Payload” and compress to zip
   7. after that’s done rename the .zip to .ipa
6. copy the Payload.ipa file over to the device -> mail / drive / etc
OR
7. publish ipk to appdb
