FROM dkr.tw.cx/nodejs:5.0.0

MAINTAINER Dominik Schulz <dominik.schulz@justwatch.com>

# install main npm dependencies
ADD package.json /app/package.json
RUN npm install

# add application source code
ADD . /app
WORKDIR /app