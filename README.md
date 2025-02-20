# GitLab Time Spent Tracker | Theo Dõi Thời Gian GitLab

[English](#english) | [Tiếng Việt](#tiếng-việt)

<div align="center">
  <div>
    <img src="public/datnt.png" alt="datnt" width="100px" style="border-radius: 50%;" />
    <h3>Created by <a href="https://github.com/datnt">@datnt</a></h3>
    <p>Full-stack Developer | UI/UX Enthusiast</p>
  </div>
</div>

Ứng dụng theo dõi thời gian làm việc trên GitLab với giao diện đẹp mắt và nhiều tính năng hữu ích.

### About the Author

Hi! I'm **Dat Nguyen** (@datnt), a passionate full-stack developer from Vietnam. I love creating beautiful and functional web applications that provide great user experiences.

- 🌐 **Website**: [datnt.dev](https://datnt.dev)
- 📧 **Email**: ntd4996@gmail.com

### Features

- 📊 Biểu đồ thời gian theo ngày và tháng
- 💰 Tính toán thu nhập tự động
- 🎯 Thống kê chi tiết theo ticket
- 📱 Giao diện responsive
- ⚡ Hiệu suất cao
- ✨ Animation mượt mà

### Demo: https://spendtime.datnt.dev

### Cài Đặt và Cấu Hình

1. **Clone repository**:
   ```bash
   git clone https://github.com/ntd4996/spendtime-gitlab.git
   cd spendtime-gitlab
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình Supabase**:

   a. Tạo tài khoản và project trên [Supabase](https://supabase.com)
   
   b. Tạo các bảng và functions cần thiết:
   ```sql
   -- Chạy các file SQL theo thứ tự
   1. create_table.sql
   2. create_functions.sql
   3. create_policies.sql
   ```

   c. Lấy thông tin kết nối:
   - Database URL
   - Anon Key
   - Service Role Key

4. **Cấu hình GitLab**:
   
   a. Tạo Personal Access Token:
   - Vào GitLab > Settings > Access Tokens
   - Tạo token với quyền: `read_api`, `read_user`
   
   b. Lấy thông tin:
   - GitLab URL (ví dụ: https://gitlab.company.com)
   - User Email

5. **Tạo file môi trường**:
   ```bash
   cp .env.example .env
   ```

   Cập nhật các biến môi trường:
   ```env
   # GitLab
   NEXT_PUBLIC_GITLAB_TOKEN=your_gitlab_token
   NEXT_PUBLIC_GITLAB_URL=your_gitlab_url
   NEXT_PUBLIC_GITLAB_USER=your_gitlab_email

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. **Chạy development server**:
   ```bash
   npm run dev
   ```

7. **Build cho production**:
   ```bash
   npm run build
   ```

8. **Chạy production server**:
   ```bash
   npm start
   ```

### Cấu Trúc Project

```
src/
  ├── app/                 # Next.js app router
  │   ├── dashboard/      # Trang dashboard
  │   └── settings/       # Trang settings
  ├── components/         # React components
  │   └── charts/        # Components biểu đồ
  ├── lib/               # Thư viện và utilities
  │   ├── gitlab/       # GitLab client
  │   └── supabase/     # Supabase client
  └── types/            # TypeScript types
```

### Công Nghệ Sử Dụng

- ⚡ Next.js 14
- 🎨 TailwindCSS
- 📊 ECharts
- 🔥 Supabase
- 🚀 Apollo Client
- 📅 DayJS

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=ntd4996&show_icons=true&theme=radical" alt="GitHub Stats" />
  
  <br/>
  <br/>
  
  <h3>Support My Work | Ủng Hộ Tôi</h3>
  
  <a href="https://www.buymeacoffee.com/ntd4996">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=datnt&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" />
  </a>
</div>

---

<p align="center">
  <sub>Built with ❤️ by datnt</sub>
</p>
