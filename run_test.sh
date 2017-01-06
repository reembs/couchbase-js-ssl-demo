#!/usr/bin/env bash
rm vol/cluster.pem
docker-compose build
docker-compose up
docker-compose down