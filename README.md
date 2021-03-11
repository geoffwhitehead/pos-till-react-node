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

1. running the server locally:

- yarn docker:build to build the containers
- the dockerfile is configured for production so will need to run yarn docker:packages afterwards to build the dependencies fully.

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

1. navigate to the project target.
2. in the tab navigation click "signing &n capabilities" - set a unique bundle identifier - create a team using apple id.
3. device trusting
   1. after signing go to device - `Settings → General → DeviceManagement → <AppName> → Trust`
   2. building - depending on the device it may be required to alter the target os under general-> deployment info

## Deploying (no apple developer license)

1. cd /client and run `yarn set:production`
2. connect device to laptop (use official cable - the cheap ones dont work). Once it finally detects the ipad (might need to unplug / plugin a few times). Find it in finder -> locations and click trust.
3. Install altStore / altServer on dev machine (https://altstore.io/faq/)
   1. Will also need to install the mail plugin. This needs adding and enabling by going into mail -> preferences -> manage plugins.
4. Once alt store is installed - try to use it. A popup should appear regarding the dev account not being trusted.
   1. Return to the general tab to find a magical new menu item called device management. Click on this and trust the alt store.
5. Now alt store is installed you need to get the APK onto the ipad to install. 0. Before doing this make sure the project code signing is setup with a valid account (see running on device above).
   1. Open xcode and open the project
   2. Set the scheme to Generic Device (any ios device) and build
   3. in your list where all your swift files are search for “.app”
   4. Under the products folder right click your app and select “Show in Finder”
   5. make a folder on the Desktop named “Payload” and copy your app into it
   6. right click the folder “Payload” and compress to zip
   7. after that’s done rename the .zip to .ipa
6. copy the Payload.ipa file over to the device -> mail / drive / etc
7. Use altStore -> myApps to navigate to the .ipa file and install.
8. Make sure to refresh / resign the app atleast every week.

## AltStore crashes

1. If altstore crashed on loading try a different version.
2. If altstore crashes when trying to install the app - make sure folder containing the ipa is names Payload / is zipped / has the extension .ipa
