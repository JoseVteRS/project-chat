#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

WORKDIR /project-chat/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

################
## PRODUCTION ##
################
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /project-chat/backend

COPY --from=development /project-chat/backend .

EXPOSE 4000

CMD [ "node", "dist/main" ]
