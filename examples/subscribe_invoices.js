const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(
  [
    './lightning.proto',
  ],
  loaderOptions,
);

const macaroon = fs.readFileSync('./admin.macaroon');
const hexMacaroon = macaroon.toString('hex');

const macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
  // build meta data credentials
  const metadata = new grpc.Metadata();
  metadata.add('macaroon', hexMacaroon);
  callback(null, metadata);
});

// build ssl credentials using the cert the same as before
const lndCert = fs.readFileSync('./tls.cert');
const sslCreds = grpc.credentials.createSsl(lndCert);

// combine the cert credentials and the macaroon auth credentials
// such that every call is properly encrypted and authenticated
const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

// Pass the crendentials when creating a channel
const { lnrpc } = grpc.loadPackageDefinition(packageDefinition);


const lightning = new lnrpc.Lightning(
  'validname1233.t.voltageapp.io:10009',
  credentials,
  { 'grpc.max_receive_message_length': 50 * 1024 * 1024 },
);

let request = { 
  settle_index: 0,
}; 

let call = lightning.subscribeInvoices(request);
call.on('data', function(response) {
  // A response was received from the server.
  console.log(response);
});
call.on('status', function(status) {
  // The current status of the stream.
});
call.on('end', function() {
  // The server has closed the stream.
});
