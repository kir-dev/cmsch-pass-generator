# CMSch Pass Generator for Apple and Google Wallet
Generate passes for both platforms via only a single URL. Create any events by creating only one folder.

## Setup
### .env
Create a `.env` file in the root directory of the project. This file should contain the following:
```dotenv
BACKEND_PORT=3000
PASS_TYPE_IDENTIFIER=pass.example.com # From Apple Developer Portal
ORG_NAME=Kir-Dev # Will appear on passes
TEAM_ID=1234567890 # From Apple Developer Portal
ISSUER_ID=1234567890 # From Google Pay & Wallet Console
PASSPHRASE=123456 # For the signerCert.pem and signerKey.pem
SERVER_BASE_URL=https://example.com # Needed for images for Google Wallet. Tip: Use ngrok if you want to serve images from your local machine.
```
### Credentials
#### Apple
Apple passes are zip-like files with the `.pkpass` extension.
They are signed with a certificate and a key. The certificate and key are stored in the `creds` folder.

The `creds` folder should contain the following for Apple Wallet:
- `signerCert.pem`
- `signerKey.pem`
- `wwdr.pem`

On how to obtain these files, please read the 
[tutorial in the passkit-generator library wiki](https://github.com/alexandercerutti/passkit-generator/wiki/Generating-Certificates)
#### Google
Google passes are created via API calls and are accessible with a JSON Web Token.
The `creds` folder should contain the following for Google Wallet:
- `google.json`

This is a service-account JSON file.
On how to set up a service account for Google Wallet API,
please read the [Google Wallet API Prerequisites](https://developers.google.com/wallet/tickets/events/web/prerequisites)

### Events
Events can be created by creating folders in the `templates` folder.
Each event folder should contain the following:
- `pass.json` - Pass details, such as display name, colors, etc.
- `icon.png` - 29x29 icon for Apple Wallet and Google Wallet
- `icon@2x.png` - 58x58 icon for Apple Wallet and Google Wallet (optional, but highly recommended)
- `logo.png` - 160x50 logo for Apple Wallet (appears on the top of the pass)
- `logo@2x.png` - 320x100 logo for Apple Wallet (optional, but highly recommended)
- `banner.png` - 739x240 banner for Google Wallet (appears on the bottom of the pass)
The server has a built-in Content Delivery Network (CDN) for images in the templates folder. Therefore, you can reference your images by their folder and name.

> Tip: copy the cmsch-event folder and rename it to your event name, replace the details. Therefore, you won't miss any required fields.

> Tip #2: leave the `$schema` field as it is. It is used for validation.

## Running
### Run in development
```bash
yarn install
yarn start:dev
```

### Run in production
```bash
yarn install
yarn start
```

## Reference Images
![Google IO Pass](https://codelabs.developers.google.com/static/add-to-wallet-web/images/pass-annotated.png)
![Apple Wallet Pass](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Art/event_ticket_2x.png)