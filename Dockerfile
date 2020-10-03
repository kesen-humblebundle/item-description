# Note: For starting service
# docker run -d -p 3003:3003 --name item-description item-description

FROM node:12
WORKDIR /home/ec2-user/item-description

# Environment variables to pass to node server
ENV PORT=3003
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install
# RUN npm ci --only=production
COPY . .
EXPOSE 3003
RUN npm run build
CMD npm start
