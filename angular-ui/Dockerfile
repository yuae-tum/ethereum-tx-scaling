FROM node:14.19-alpine

COPY ./ /angular-ui
WORKDIR angular-ui

RUN npm ci

ENTRYPOINT [ "npm", "run", "start", "--", "--host", "0.0.0.0" ]
CMD [ "--port", "4200" ]
