FROM node:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (prod + dev)
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the source code
COPY . .

# Create uploads folder
RUN mkdir -p uploads && chmod 755 uploads

# Expose port
EXPOSE 4000

# Run the server
CMD ["npm", "run", "dev"]
