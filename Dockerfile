FROM node:20

# Install git (needed for github deps)
RUN apt-get update && apt-get install -y git

WORKDIR /app

COPY package.json package-lock.json* npm-shrinkwrap.json* yarn.lock* ./

RUN npm install

COPY . .

CMD ["npm", "start"]
