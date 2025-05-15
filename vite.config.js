import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Thêm cấu hình này để đảm bảo các file trong thư mục public được phục vụ đúng cách
  publicDir: 'public',
})
