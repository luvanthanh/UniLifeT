# UniLifeT Frontends

Ba giao diện HTML, CSS và JavaScript thuần, tổ chức theo thư mục tương tự frontend VanThanhShop:

- `FrontEndCusstomer/html/index.html`: tìm kiếm và khám phá phòng trọ.
- `FrontEndOwner/html/index.html`: quản lý nhà trọ, phòng và bài đăng.
- `FrontEndAdmin/html/index.html`: tổng quan và quản lý dữ liệu hệ thống.

## Chạy thử

1. Khởi động backend UniLifeT tại `http://localhost:8080`.
2. Mở thư mục `FrontEnd` trong VS Code và dùng Live Server mở một trong ba file `html/index.html`.
3. Các trang gọi API backend trực tiếp; khi backend không sẵn sàng, trang khách hiển thị dữ liệu minh họa có thông báo rõ ràng. Trang Owner/Admin yêu cầu đăng nhập trước khi thao tác ghi.

API base URL được đặt tại `shared/api.js`. Có thể cập nhật `window.UNILIFE_API_BASE` trước khi nạp module nếu cần đổi địa chỉ backend.
