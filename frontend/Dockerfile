FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

RUN npm install postcss-preset-env --save-dev

COPY . .

CMD ["npm", "run", "dev"]