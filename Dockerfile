FROM node:18
WORKDIR /app
COPY package*.json ./
ENV PORT 8080
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]