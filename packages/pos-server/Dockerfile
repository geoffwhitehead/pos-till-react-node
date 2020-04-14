FROM node:13.8.0

RUN npm install pm2@latest --global --quiet
RUN cd /usr/local/lib/node_modules/pm2 && pm2 install typescript
# add local user for security
RUN groupadd -r nodejs \
  && useradd -m -r -g nodejs nodejs

USER nodejs

# TODO: refacotr this to clean ssh keys. Can be done using squash
ARG GIT_SSH_KEY

# copy local files into container, set wor king directory and user
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app
COPY . /home/nodejs/app

RUN npm install --production --quiet

EXPOSE 5000

CMD ["pm2-runtime", "./config/pm2.json"]
