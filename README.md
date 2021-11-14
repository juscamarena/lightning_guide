# lightning_guide

## Hosted node provider
https://voltage.cloud/

Whitelist current ip to access node:
https://whatismyipaddress.com/

Unlock node or automate unlocking.

Access over lncli:

Install LND https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md

Download macaroon from the voltage website:

    lncli \
    --rpcserver=validname1233.t.voltageapp.io:10009 \
    --macaroonpath=/path/to/admin.macaroon \
    --tlscertpath="" \
    getinfo

## Testnet lightning wallet
https://htlc.me/

## Test Lightning Payments
https://starblocks.acinq.co/

## Node.js api examples
Code snippets are in examples/

admin.macaroon, tls.cert required in examples/* downloaded from the voltage site


## Example mode
https://1ml.com/testnet/node/03be4ad3a6eede311d213f8b6c33ffcf00c8d2d424e5875ca4a3f3deff45fcaf1f

Bitcoin Testnet Explorer
https://blockstream.info/testnet/

Lightning Testnet Explorer
https://1ml.com/testnet/search


## Learning Resources
https://github.com/bitcoinbook/bitcoinbook
https://github.com/lnbook/lnbook

## Liquidity Services
https://www.bitrefill.com/thor-lightning-network-channels/?hl=en
