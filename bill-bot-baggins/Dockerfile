# Step 1: Use the official Node.js base image
FROM node:20.12.2-alpine3.18 as builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application's source code
COPY . .

# Step 6: Build your Next.js application
RUN npm run build

# Step 7: Use the official Node.js base image for the runtime stage
FROM node:20.12.2-alpine3.18 as runner

WORKDIR /app

# Step 8: Copy the built application from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Ensure package.json and package-lock.json are also copied from the builder stage
COPY --from=builder /app/package*.json ./
# Step 9: Expose the port Next.js runs on
EXPOSE 3000

# Step 10: Define the command to run your application
CMD ["npm", "start"]