FROM node:16 AS builder

# create app directory
WORKDIR /usr/src/app

# install dependencies
COPY /package* .
COPY /yarn* .

RUN yarn install \
    --frozen-lockfile 
RUN yarn global add typescript@4.4.4

# bundle app source
COPY . .

# TypeScript compile
RUN yarn run build

EXPOSE 8080

# Use distroless image for multi-stage build
FROM gcr.io/distroless/nodejs:16
COPY --from=builder /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD ["./dist/index.js"] 



