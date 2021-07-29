# homestorage

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Todo
DELETE Folders

MOVE

use med-log

fix contextmenu (click on padding/margin)

uploadfilesprogress not cleaned on close

make treeitems actual type

CHECK IF BLOB EXISTS

preview show text

preview into component

rename homestorage to az-blob-file-explorer or some such

look into generalized naming validator for both names/folders.
	no slashes, not full stops.

remove hardcoded uri's

redirectUri => window.location ((protocol + domain) / origin) + port if domain includes "local"

-----

Add app registration, quick start code will do.

Logout URL in adv. settings in Authentication in app registration

scopes: ["https://storage.azure.com/user_impersonation"]

StorageAccount -> Access Control (IAM) -> Storage Blob Data Contributor

Sign in from code sample.

Log the tokenResponse to see accessToken.

https://storageanarae.blob.core.windows.net/homestorage/rasmus/homestorage.txt

Authorization:Bearer <accessToken goes here>

x-ms-version:2017-11-09

-----
