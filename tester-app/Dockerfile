FROM mhart/alpine-node:6

RUN apk --no-cache add g++ gcc git python make automake autoconf dmidecode cmake libevent libevent-dev openssl openssl-dev wget tar curl

WORKDIR /app

COPY fix.patch ./

ARG cb_ver=2.6.3
RUN wget http://packages.couchbase.com/clients/c/libcouchbase-${cb_ver}.tar.gz && \
    tar xf libcouchbase-${cb_ver}.tar.gz && cd libcouchbase-${cb_ver} && patch -p0 </app/fix.patch && \
    mkdir build && cd build && ../cmake/configure --prefix=/app/libcouchbase_build && make && make install && \
    cd /app && rm -rf libcouchbase-${cb_ver}.tar.gz libcouchbase-${cb_ver} && \
    npm install --no-progress couchbase@2.3.0 --compile --couchbase-root=/app/libcouchbase_build

COPY ./package.json /app
COPY ./app.js /app
RUN npm install
CMD node app.js