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

## Running on Device

Restoring device:
connect to mac using official cable.
power off ipad
boot into revovery mode: - press volume up then - press and hold power and home button until the recovery screen is shown (power cable). - open finder on mac. The ipad should be shown on the left sidebar under "locations" - press restore button and wait for device to complete the process.

wireless debugging. - connect device and open xcode. - device should be should in the device list - navigate window -> devices & simulators - find the connected device and tick "connect via network"

signing - navigate to the project target. - in the tab navigation click "signing &n capabilities" - set a unique bundle identifier - create a team using apple id.
device trusting - after signing go to device - `Settings → General → DeviceManagement → <AppName> → Trust`
building - depending on the device it may be required to alter the target os under general-> deployment info

## Deploying (until i get a licence)

1. cd /client and run `yarn set:production`
2. connect device to laptop (use official cable - the cheap ones dont work)
3. Install altStore / altServer on dev machine
4.
