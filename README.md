**Update 6/2/17:** Couchbase Support had figured out the issue and the fix is now included in this repo. Take a look at the tester-app/fix.patch

## Couchbase Node.js SDK SSL issue

This repo is meant at demonstrating an issue/bug I am encountering with Couchbase Node.js SDK using SSL encryption.

The docker-compose sets up an environment with the following:

1. A Couchbase server off default couchbase/server:enterprise-4.5.1 image
2. A cluster initializer that uses couchbase-cli to initialize the single node cluster and create a password protected bucket
3. A tester app in node-js that demonstrates the issue. Builds off of mhart/alpine-node:6, which is an Alpine Linux image with Node.JS 6 support.

Note that the tester app also gets libcouchbase from the Alpine repo. A binary libcouchbase is [required](https://developer.couchbase.com/documentation/server/current/sdk/nodejs/start-using-sdk.html) to run the Couchbase Node.JS SDK with SSL support. There's also commented-out code to compile libcouchbase from source in the tester app docker, doing so produces the same error.

To run the test you would need docker & docker-compose installed.

Run:

```bash
./run_test.sh
```

To quit: Ctrl+C

### The issue

The tester app initializes two Couchbase cluster objects directed at the same cluster, first unencrypted and then encrypted.

The app then tries to insert and fetch a key on each of the buckets.

While the unencrypted bucket works fine, the bucket with SSL support has a problem: it manages to insert the value just fine, but when fetching back the key it always encounters a "Client-Side timeout" error.

Output:

```
cb-tester_1  | creating bucket and running sample ops on a non-encrypted bucket
cb-tester_1  | inserted value for "key"
cb-tester_1  | found value: {"cas":"1483708423991394304","value":{"val1":1,"val2":"string"}}
cb-tester_1  |
cb-tester_1  |
cb-tester_1  | *** At this point we managed to inset and fetch a key via the non encrypted bucket successfully ***
cb-tester_1  |
cb-tester_1  |
cb-tester_1  | creating bucket and running sample ops on an encrypted bucket
cb-tester_1  | inserted value for "keys"
cb-tester_1  |
cb-tester_1  | /app/node_modules/few/index.js:99
cb-tester_1  |     isFunction(cb) ? cb : err => { if (err) process.nextTick(() => { throw err; }); });
cb-tester_1  |                                                                      ^
cb-tester_1  | CouchbaseError: Client-Side timeout exceeded for operation. Inspect network conditions or increase the timeout
```