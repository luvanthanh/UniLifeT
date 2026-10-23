# UniLifeT Frontends

Frontend sử dụng HTML, CSS và JavaScript thuần. Phạm vi customer gồm trang chủ, danh sách phòng, chi tiết phòng, danh sách trường đại học, nhà trọ/phòng theo trường hoặc motel, bài viết, đăng nhập, đăng ký, quên mật khẩu, hồ sơ, lịch sử thuê và trang 404.

## Chạy customer frontend

1. Khởi động backend UniLifeT tại `http://localhost:8080`.
2. Mở `FrontEnd/FrontEndCusstomer` trong VS Code.
3. Dùng Live Server mở `html/index.html`.
4. Các lời gọi `fetch` dùng trực tiếp endpoint tại `http://localhost:8080`; nếu backend chạy ở địa chỉ khác, cập nhật URL ngay trong file JavaScript gọi API.

Thông tin phòng, nhà trọ, hình ảnh, dịch vụ, tiện nghi, trường đại học và bài viết được lấy từ API; frontend không nạp dữ liệu mẫu. Nếu API thiếu một trường dữ liệu, giao diện ghi rõ API không cung cấp thông tin đó thay vì tự tạo giá trị. Nếu API trả về bản ghi mẫu/seed, frontend vẫn hiển thị nội dung API đó nguyên trạng.

## Giới hạn tích hợp đã xác minh

- Đăng nhập backend nhận `userName` và `userPassword`, không phải email.
- `UniversityResponse` bao gồm `universityId`, còn `MotelResponse.universityIds` liên kết nhà trọ với trường. `/pages/university.html` → `/pages/motel.html?universityId=...` → `/pages/motel.html?motelId=...` là luồng trường → nhà trọ → phòng.
- API trường trả `universityId` để liên kết trường với `MotelResponse.universityIds`; trang nhà trọ lọc theo quan hệ này, sau đó lọc phòng theo `RoomResponse.motelId`.
- Endpoint đọc/cập nhật hồ sơ người dùng hiện được bảo vệ theo quyền ADMIN, nên CUSTOMER có thể nhận HTTP 403.
- API cập nhật người dùng hiện ánh xạ toàn bộ `UserUpdateRequest`, trong đó có mật khẩu; phản hồi hồ sơ không trả mật khẩu. Giao diện không gửi cập nhật hồ sơ để tránh ghi đè thông tin mật khẩu khi backend chưa hỗ trợ cập nhật từng phần.
- Backend chưa có endpoint gửi yêu cầu thuê hoặc liên hệ chủ trọ; `UserRoom` chỉ tạo bản ghi thuê/hợp đồng nên giao diện không giả lập việc gửi yêu cầu.
- Backend chưa có API quên mật khẩu.
- Endpoint `GET /user-room/users/{userId}` hiện được mở công khai trong cấu hình security. Giao diện chỉ gọi với userId nhận khi đăng nhập và lọc lại kết quả, nhưng backend cần xác thực quyền sở hữu để bảo đảm riêng tư trước khi phát hành.
- Backend hiện cho phép CORS từ `http://localhost:8765`, `http://localhost:5500`, `http://127.0.0.1:5500`, `http://localhost:5501` và `http://127.0.0.1:5501`. Nếu Live Server chạy ở origin khác, cần thêm origin đó trong cấu hình CORS backend.
