#!/bin/bash
awslocal s3api \
create-bucket --bucket personal-site \
--create-bucket-configuration LocationConstraint=eu-central-1 \
--region eu-central-1
awslocal s3api put-bucket-acl --bucket personal-site --acl public-read
awslocal s3api put-bucket-cors --bucket personal-site  --cors-configuration file://cors-config.json