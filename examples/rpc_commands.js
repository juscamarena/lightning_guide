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
  memo: 'test invoice', 
  // value: 1, 
  value_msat: 1000,
}; 

// create invoice
lightning.addInvoice(request, function(err, response) {
  if (err) {
    console.log('error', err);
  }

  console.log('response', response);
});

// list channels
// lightning.listChannels(request, function(err, response) {
//   if (err) {
//     console.log('error', err);
//   }

//   console.log('response', response);
// });


let paymentRequest = {
  // amt: <int64>,
  // amt_msat: <int64>,
  payment_request: 'lntb10m1psezvjcpp52l8shggqvjn656sveq95td9dcd7ajfns3g3x020ek2vr8glm5jfqdqqcqzpgxqyz5vqsp5p78hff2as2rzv6p3a26kp2g077ljt9rfa8l26p605pxsk2d6zzcs9qyyssq9aklsmeytz7796586jc6zmtjy545pw6t2fu5ne8hxe6he9892g2jlxepy7usj9ede84xwetkl7rly9rggyctddh29yjdnagn9g9cvpcq5gpmrj',
  // fee_limit: <FeeLimit>,
};

let call = lightning.sendPayment({});

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

// call.write(paymentRequest);