#!/bin/bash

openssl pkcs12 -in cert.p12 -clcerts -nokeys -out creds/signerCert.pem -passin pass:cmsch-pass-server

openssl pkcs12 -in cert.p12 -nocerts -out creds/signerKey.pem -passin pass:cmsch-pass-server -passout pass:cmsch-pass-server
