FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST=0.0.0.0
ENV PORT=3000
ENV REACT_APP_API_URL=http://localhost:8000/api

EXPOSE 3000

CMD ["npm", "start"]