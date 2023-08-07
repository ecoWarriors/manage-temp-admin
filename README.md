GRANT/REVOKE retire permission

Before running this script, need to install ts-node first. - "npm i -g ts-node"

1. input private key of admin wallet(credit owner) and pubkey of grantee(temp admin) in constant.ts file.

2. to grant retire permission to grantee, run this command - "ts-node grant.ts"

3. to revoke retire permission from grantee, tun this command - "ts-node revoke.ts"