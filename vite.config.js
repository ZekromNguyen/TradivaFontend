import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Thêm cấu hình này để đảm bảo các file trong thư mục public được phục vụ đúng cách
  publicDir: 'public',
  // Thêm cấu hình server để chỉ định port
  server: {
    port: 3001, // Thay đổi port tại đây
  },
  build: {
    // Tối ưu hóa kích thước bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Chia nhỏ các chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-icons'],
          form: ['formik', 'yup', 'react-hook-form'],
        },
      },
    },
  },
})
