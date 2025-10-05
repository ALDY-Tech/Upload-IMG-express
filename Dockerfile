# Gunakan base image Node.js versi LTS (ringan dan stabil)
FROM node:20-alpine

# Tentukan direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies seperti nodemon)
RUN npm install

# Salin seluruh source code
COPY . .

# Pastikan folder uploads tersedia di dalam container
RUN mkdir -p uploads

# Generate Prisma client (biar siap sebelum runtime)
RUN npx prisma generate

# Expose port untuk aplikasi
EXPOSE 3000

# Jalankan Prisma migrate deploy + nodemon
CMD npx prisma migrate deploy && npx nodemon server.js
