FROM --platform=linux/amd64 localstack/localstack:3.0
COPY ./cors-config.json .
COPY --chown=localstack ./localstack-script.sh /etc/localstack/init/ready.d/localstack-script.sh
RUN chmod u+x /etc/localstack/init/ready.d/localstack-script.sh