# Toucan Testing Data
A Script to import data into the database

## Pre-requisites
- `npm install -g typescript`

## Exporting Data from Toucan
- Click the ellipsis for a Test Suite and select **Export to CSV**

## Converting CSV to JSON
- `csv2json <inputcsv> <outputjson>`
- Open the file in VS code
- Format Document `SHIFT`+`ALT`+`F`
- If there are spaces as the first character of property names, run a find and replace ALL `" ` with `"`

## Importing Data
- Prepare the `data.json` file (Example in `data.sample.json`)
- Log in to Toucan Testing and get the token from any XHR request to the api
- Paste the token in the value for `token` in `config/config.ts`
- Verify the baseUrl is the URL of the target API
- Run `npm run start-import`
