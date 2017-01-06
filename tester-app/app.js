const cb = require('couchbase');
const few = require('few');
const fs = require('fs');

const certPath = '/vol/cluster.pem';

few(function* () {
    function* exists() {
        return yield cb => fs.stat(certPath, function(err, stats) {
            if(err || (!stats))
                cb(null, false);
            else
                cb(null, true);
        });
    }
    let wait_iters = 0;
    console.log('waiting for cert....');
    while (!(yield* exists())) {
        console.log('.');
        yield cb => setTimeout(cb, 2500);
        if (++wait_iters > 10) {
            console.error('timeout waiting for cert');
            throw new Error('timeout');
        }
    }

    console.log('found cert');
    //console.log(yield cb => fs.readFile(certPath, 'utf8', cb));

    if (process.env['SKIP_NON_SECURE'] !== 'true') {
        console.log('Creating and running sample ops on a non-encrypted bucket');
        const cluster = new cb.Cluster(`couchbase://couchbase.local`);
        const bucket = cluster.openBucket('bucket', 'bucketpass');
        yield cb => bucket.insert('key', {'val1': 1, 'val2': 'string'}, {}, cb);
        console.log('inserted value for "key"');
        const value = yield cb => bucket.get('key', cb);
        console.log("Found value: " + JSON.stringify(value));

        console.log('\n\n*** At this point we managed to inset and fetch a key via the non encrypted bucket successfully ***\n\n');
    }

    console.log('creating and doing the same on an encrypted bucket');
    const clusters = new cb.Cluster(`couchbases://couchbase.local?certpath=${certPath}`);
    const buckets = clusters.openBucket('bucket', 'bucketpass');
    yield cb => buckets.insert('keys', {'val1': 1, 'val2': 'string'}, {}, cb);
    console.log('inserted value for "keys"');
    const values = yield cb => buckets.get('keys', cb);
    console.log("Found value: " + JSON.stringify(values));
});
