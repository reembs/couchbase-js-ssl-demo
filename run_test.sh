#!/usr/bin/env bash

export POLL_INTERVAL=${POLL_INTERVAL:-3}

rm vol/cluster.pem 2> /dev/null

function cleanup {
    docker-compose down
}

trap cleanup EXIT

docker-compose build && docker-compose up