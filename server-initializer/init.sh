#!/usr/bin/env bash

wait_iters=0
until curl --output /dev/null --silent --head --fail http://couchbase.local:8091; do
    wait_iters=$((wait_iters+1))
    if [ "$wait_iters" -gt 10 ]
    then
      echo 'ERROR: timeout while waiting for couchbase to respond'
      exit -1
    fi
    echo '.'
    sleep ${POLL_INTERVAL}
done

couchbase-cli node-init -c couchbase.local:8091 \
    --node-init-hostname=couchbase.local \
    --node-init-data-path=/data \
    --node-init-index-path=/index \
    -u Administrator \
    -p 'password'

/opt/couchbase/bin/couchbase-cli cluster-init -c couchbase.local:8091 \
      -u Administrator -p password \
      --cluster-init-ramsize=512

/opt/couchbase/bin/couchbase-cli bucket-create -c couchbase.local:8091 \
    -u Administrator \
    -p password\
    --bucket=bucket \
    --bucket-type=couchbase \
    --bucket-ramsize=512 \
    --bucket-replica=0 \
    --bucket-eviction-policy=fullEviction \
    --bucket-password='bucketpass'

sleep 5 # allow cb time to become ready to serve, cert writing signals tester to begin

/opt/couchbase/bin/couchbase-cli ssl-manage -c couchbase.local:8091 \
    -u Administrator \
    -p 'password' \
    --cluster-cert-info > /vol/cluster.pem