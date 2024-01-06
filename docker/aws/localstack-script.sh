#!/bin/bash
awslocal s3api \
create-bucket --bucket super-simple-cms \
--create-bucket-configuration LocationConstraint=eu-central-1 \
--region eu-central-1
awslocal s3api put-bucket-acl --bucket super-simple-cms --acl public-read
awslocal s3api put-bucket-cors --bucket super-simple-cms  --cors-configuration file://cors-config.json