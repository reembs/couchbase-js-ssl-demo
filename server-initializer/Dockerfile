FROM couchbase/server:enterprise-4.5.1
COPY ./init.sh /init.sh
VOLUME /vol
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/init.sh"]