# Gunakan image Node.js resmi versi 20
FROM node:20

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file dependency terlebih dahulu (agar layer ini bisa cache)
COPY package*.json ./

# Salin folder prisma (dibutuhkan oleh prisma generate saat npm install)
COPY prisma ./prisma

# Install dependencies di dalam container
RUN npm install

# Salin seluruh file project ke dalam container
COPY . .

# Jalankan Prisma generate (pastikan schema dan deps sudah tersedia)
RUN npx prisma generate

# Expose port aplikasi (misalnya 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
