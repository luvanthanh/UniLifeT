# UniLifeT

Ứng dụng tìm và quản lý phòng trọ cho sinh viên. Backend dùng Spring Boot, PostgreSQL; giao diện dùng React + Vite.

## 1. Chuẩn bị

Cài Git, Docker Desktop và Node.js 18 trở lên.

## 2. Clone dự án

```bash
git clone <URL-repository>
cd UniLifeT
```

Ở thư mục gốc, tạo file `.env` nếu chưa có:

```env
DB_PASSWORD=mat_khau_postgres
```

## 3. Chạy backend và database

```bash
docker compose up --build -d
```

Kiểm tra backend:

```bash
docker compose ps
docker compose logs -f backend
```

Backend chạy tại `http://localhost:8080`. Database được tạo và nạp dữ liệu từ `Database/UniLifeT.sql` khi PostgreSQL khởi tạo lần đầu.

## 4. Chạy frontend

Mở **một terminal riêng cho mỗi giao diện**, chạy `npm install` rồi `npm run dev` trong thư mục tương ứng:

| Giao diện     | Thư mục                      | Địa chỉ                 |
| ------------- | ---------------------------- | ----------------------- |
| Sinh viên     | `FrontEnd/FrontEndCusstomer` | `http://127.0.0.1:5501` |
| Quản trị viên | `FrontEnd/FrontEndAdmin`     | `http://127.0.0.1:5502` |
| Chủ trọ       | `FrontEnd/FrontEndOwner`     | `http://127.0.0.1:5503` |

Ví dụ chạy giao diện sinh viên:

```bash
cd FrontEnd/FrontEndCusstomer
npm install
npm run dev
```

## 5. Dừng dự án

```bash
docker compose down
```

Lệnh trên giữ lại dữ liệu PostgreSQL. Chỉ dùng `docker compose down -v` khi muốn xóa database và tạo lại từ đầu.
