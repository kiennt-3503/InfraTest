# MAPAPP

## 📦 Tech Stack

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Daisy UI] (https://daisyui.com/)

---

## 🚀 Cài đặt

> Yêu cầu:
>
> - Node.js >= 16
> - pnpm (nếu chưa có, xem hướng dẫn bên dưới)

### 1. Cài đặt `pnpm` (nếu chưa có)

```bash
npm install -g pnpm
```

### 2. Clone và cài đặt project

```bash
git clone https://github.com/duongpd-0230/MAPAPP.git
cd MAPAPP/client
cp .env.example .env
pnpm install
```

### 3. Chạy dev server

```bash
pnpm dev
```

---

## 🎨 Shadcn UI

Dự án này sử dụng [Shadcn UI](https://ui.shadcn.com/) để dễ custom component hơn.

---

### 📦 Cài đặt thêm component mới

Để thêm component mới từ thư viện Shadcn:

```bash
pnpm shadcn add [component-name]
```

Ex:

- `pnpm shadcn add button`
- `pnpm shadcn add input`
- `pnpm shadcn add dialog`

---

---

## 📝 Quy tắc đặt tên commit

Dự án này tuân theo chuẩn [**Conventional Commits**](https://www.conventionalcommits.org/) để giữ lịch sử commit rõ ràng, dễ đọc và hỗ trợ tự động sinh changelog nếu cần.

### 🔧 Cấu trúc commit:

```bash
<type>(optional-scope): <description>

```

- `type`: Loại thay đổi (ví dụ: `feat`, `fix`, `docs`,...)
- `scope`: (tuỳ chọn) Phạm vi/chức năng được thay đổi (ví dụ: `auth`, `map`, `ui`)
- `mô tả`: Không viết hoa chữ đầu, không chấm cuối

### 📋 Các loại `type` commit phổ biến

| Type       | Ý nghĩa                                                 |
| ---------- | ------------------------------------------------------- |
| `feat`     | Thêm tính năng mới                                      |
| `fix`      | Sửa lỗi                                                 |
| `docs`     | Thay đổi tài liệu (README, comment, docstring,...)      |
| `style`    | Thay đổi style (format code, đổi indent, xóa dòng thừa) |
| `refactor` | Cải tiến code nhưng không thay đổi chức năng            |
| `test`     | Thêm hoặc sửa unit test                                 |
| `chore`    | Việc phụ (cập nhật dependency, config tool,...)         |
| `build`    | Thay đổi liên quan đến hệ thống build                   |
| `ci`       | Thay đổi liên quan đến CI/CD pipeline                   |

---

## 🛠️ Backend Setup

### 1. Set up docker chạy back end

Chạy lệnh sau để thực hiện set up BE:

```bash
cd /server
cp ./config/application.yml.example ./config/application.yml
docker-compose build --build-arg RAILS_ENV=development
docker-compose up -d
docker-compose exec web bundle install
docker-compose exec web bundle exec rails db:create
```

Note: nếu không chạy được thì chạy với quyền root

```bash
docker-compose exec --user root web bundle config set frozen false
docker-compose exec --user root web bundle install
```

## 🛠️ Database Setup

### 1. Migrate database

Chạy lệnh sau để thực hiện migrate toàn bộ schema cho cơ sở dữ liệu:

```bash
docker-compose exec web bundle exec rails db:migrate
```

### 2. Seed database

Chạy lệnh sau để thực hiện seed cho cơ sở dữ liệu:

```bash
docker-compose exec web bundle exec rails db:seed
```

### 3. Tạo migrate mới

Chạy lệnh sau để thực hiện tạo migrate mới:

```bash
docker-compose exec web bundle exec rails generate migration "migration_name"
```

### 4. Muốn seed lại database (drop db -> create new db -> migrate -> seed data)

Chạy lệnh sau:

```bash
docker-compose exec web bundle exec rails db:reset
```

### 5. Check database bằng giao diện Pgadmin trên local

http://localhost:8080/login?next=/browser/

- email: admin@example.com

- password: admin

- tạo server connection

- Server Name: map_app

- Host name/address: db

- username: postgres

- password: password
