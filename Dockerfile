FROM --platform=linux/amd64 node:18-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
CMD ["npm", "run", "dev"]