# UniLifeT Frontends

Frontend sử dụng HTML, CSS và JavaScript thuần. Phạm vi customer gồm trang chủ, danh sách phòng, chi tiết phòng, đăng nhập, đăng ký, quên mật khẩu, yêu thích, hồ sơ, lịch sử thuê và trang 404.

## Chạy customer frontend

1. Khởi động backend UniLifeT tại `http://localhost:8080`.
2. Mở `FrontEnd/FrontEndCusstomer` trong VS Code.
3. Dùng Live Server mở `html/index.html`.
4. Cấu hình API base URL tại `FrontEndCusstomer/javascript/config.js` hoặc gán `window.UNILIFE_API_BASE` trước khi nạp JavaScript.

Danh sách phòng không dùng dữ liệu giả để thay thế API. Nếu backend không sẵn sàng, trang hiển thị lỗi/kết quả rỗng có giải thích. Yêu thích lưu cục bộ trên trình duyệt vì backend hiện chưa có API yêu thích.

## Giới hạn tích hợp đã xác minh

- Đăng nhập backend nhận `userName` và `userPassword`, không phải email.
- API danh sách trường không trả `universityId`; do đó bộ lọc phòng theo trường chưa thể liên kết chính xác.
- Endpoint đọc/cập nhật hồ sơ người dùng hiện được bảo vệ theo quyền ADMIN, nên CUSTOMER có thể nhận HTTP 403.
- API cập nhật người dùng hiện ánh xạ toàn bộ `UserUpdateRequest`, trong đó có mật khẩu; phản hồi hồ sơ không trả mật khẩu. Giao diện không gửi cập nhật hồ sơ để tránh ghi đè thông tin mật khẩu khi backend chưa hỗ trợ cập nhật từng phần.
- Backend chưa có endpoint gửi yêu cầu thuê hoặc liên hệ chủ trọ; `UserRoom` chỉ tạo bản ghi thuê/hợp đồng nên giao diện không giả lập việc gửi yêu cầu.
- Backend chưa có API quên mật khẩu.
- Endpoint `GET /user-room/users/{userId}` hiện được mở công khai trong cấu hình security. Giao diện chỉ gọi với userId nhận khi đăng nhập và lọc lại kết quả, nhưng backend cần xác thực quyền sở hữu để bảo đảm riêng tư trước khi phát hành.
- Backend hiện cho phép CORS từ `http://localhost:8765`, `http://localhost:5500`, `http://127.0.0.1:5500`, `http://localhost:5501` và `http://127.0.0.1:5501`. Nếu Live Server chạy ở origin khác, cần thêm origin đó trong cấu hình CORS backend.
