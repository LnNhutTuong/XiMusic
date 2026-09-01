FROM node:22
WORKDIR /app
COPY package*.json ./
# hợp lí hơn cha npm instal vì thằng này nó được lock theo pk.json và nên dùng cho build/CI hơn cha kia
RUN npm ci
# copy src vào trong /app/
COPY . .
CMD ["npm", "start"]