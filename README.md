React native point of sale app.

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
