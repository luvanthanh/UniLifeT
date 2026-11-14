const status = [["ACTIVE", "Hoạt động"], ["INACTIVE", "Ngừng hoạt động"]];

export const resources = {
  users: {
    title: "Người dùng", itemName: "tài khoản", path: "/users", idKey: "userId", allowEdit: false,
    createPath: "/users/auth/register", deletePath: row => `/users/${row.userId}`,
    description: "Danh sách tài khoản được lấy từ API người dùng.",
    columns: [{key:"userId",label:"ID"},{key:"userName",label:"Tên đăng nhập"},{key:"userEmail",label:"Email"},{key:"userPhone",label:"Điện thoại"},{key:"userRole",label:"Vai trò"}],
    fields: [
      {name:"userName",label:"Tên đăng nhập",required:true}, {name:"userEmail",label:"Email",type:"email",required:true},
      {name:"userPassword",label:"Mật khẩu",type:"password",required:true}, {name:"userPhone",label:"Điện thoại"},
      {name:"userRole",label:"Vai trò",options:[["STUDENT","Sinh viên"],["OWNER","Chủ trọ"],["ADMIN","Quản trị viên"]],required:true,defaultValue:"STUDENT"}
    ]
  },
  owners: {
    title: "Chủ trọ", itemName: "tài khoản chủ trọ", path: "/users", idKey: "userId", allowEdit:false,
    filter: user => user.userRole === "OWNER", deletePath: row => `/users/${row.userId}`,
    description: "Tài khoản có vai trò OWNER trong dữ liệu người dùng.",
    columns: [{key:"userId",label:"ID"},{key:"userName",label:"Tên đăng nhập"},{key:"userEmail",label:"Email"},{key:"userPhone",label:"Điện thoại"},{key:"userAddress",label:"Địa chỉ"}]
  },
  motels: {
    title:"Nhà trọ",itemName:"nhà trọ",path:"/motels",idKey:"motelId",updatePath:r=>`/motels/${r.motelId}`,deletePath:r=>`/motels/${r.motelId}`,
    description:"Quản lý nhà trọ và các trường liên kết.",columns:[{key:"motelId",label:"ID"},{key:"motelName",label:"Tên nhà trọ"},{key:"motelOwner",label:"Chủ nhà"},{key:"motelAddress",label:"Địa chỉ"},{key:"userId",label:"ID chủ tài khoản"}],
    fields:[{name:"userId",label:"User ID chủ trọ",type:"number",required:true},{name:"motelName",label:"Tên nhà trọ",required:true},{name:"motelOwner",label:"Tên chủ trọ"},{name:"motelAddress",label:"Địa chỉ",wide:true},{name:"universityIds",label:"University IDs (phân cách dấu phẩy)",type:"ids",placeholder:"Ví dụ: 1, 2",wide:true}]
  },
  rooms: {
    title:"Phòng trọ",itemName:"phòng",path:"/rooms",idKey:"roomId",createPath:"/rooms",updatePath:r=>`/rooms/update/${r.roomId}`,deletePath:r=>`/rooms/${r.roomId}`,
    description:"Quản lý giá, diện tích và trạng thái phòng.",columns:[{key:"roomId",label:"ID"},{key:"motelId",label:"Motel ID"},{key:"roomType",label:"Loại phòng"},{key:"roomPrice",label:"Giá thuê",format:v=>`${Number(v).toLocaleString("vi-VN")} đ`},{key:"roomArea",label:"Diện tích"},{key:"roomStatus",label:"Trạng thái"}],
    fields:[{name:"motelId",label:"Motel ID",type:"number",required:true},{name:"roomType",label:"Loại phòng"},{name:"roomPrice",label:"Giá thuê",type:"number",required:true},{name:"roomDeposit",label:"Tiền cọc",type:"number"},{name:"roomArea",label:"Diện tích (m²)",type:"number"},{name:"roomAddress",label:"Địa chỉ"},{name:"roomStatus",label:"Trạng thái",defaultValue:"AVAILABLE"},{name:"roomView",label:"Lượt xem",type:"number",defaultValue:0},{name:"roomDescription",label:"Mô tả",multiline:true,wide:true},{name:"serviceIds",label:"Service IDs (phân cách dấu phẩy)",type:"ids",wide:true}]
  },
  posts: {
    title:"Tin đăng",itemName:"tin đăng",path:"/posts",idKey:"postId",createPath:"/posts",updatePath:r=>`/posts/${r.postId}`,deletePath:r=>`/posts/${r.postId}`,
    description:"Tin đăng lấy trực tiếp từ API bài viết.",columns:[{key:"postId",label:"ID"},{key:"postTitle",label:"Tiêu đề"},{key:"userId",label:"User ID"},{key:"roomId",label:"Room ID"},{key:"postStatus",label:"Trạng thái"},{key:"postView",label:"Lượt xem"}],
    fields:[{name:"userId",label:"User ID",type:"number",required:true},{name:"roomId",label:"Room ID",type:"number",required:true},{name:"postTitle",label:"Tiêu đề",required:true,wide:true},{name:"postContent",label:"Nội dung",multiline:true,wide:true},{name:"postCreateAt",label:"Ngày đăng",type:"datetime-local"},{name:"postStatus",label:"Trạng thái",defaultValue:"ACTIVE"},{name:"postView",label:"Lượt xem",type:"number",defaultValue:0}]
  },
  universities: {
    title:"Trường đại học",itemName:"trường",path:"/universities",idKey:"universityId",createPath:"/universities",updatePath:r=>`/universities/update/${r.universityId}`,deletePath:r=>`/universities/${r.universityId}`,
    description:"Quản lý thông tin trường đại học.",columns:[{key:"universityId",label:"ID"},{key:"universityName",label:"Tên trường"},{key:"universityCode",label:"Mã trường"},{key:"universityCity",label:"Tỉnh / thành"},{key:"universityDistrict",label:"Quận / huyện"},{key:"universityStatus",label:"Trạng thái"}],
    fields:[{name:"universityName",label:"Tên trường",required:true},{name:"universityCode",label:"Mã trường",required:true},{name:"universityAddress",label:"Địa chỉ",wide:true},{name:"universityCity",label:"Tỉnh / thành"},{name:"universityDistrict",label:"Quận / huyện"},{name:"universityPhone",label:"Điện thoại"},{name:"universityWebsite",label:"Website"},{name:"universityLogo",label:"URL logo",wide:true},{name:"universityStatus",label:"Trạng thái",options:status,defaultValue:"ACTIVE"}]
  },
  services: {
    title:"Dịch vụ",itemName:"dịch vụ",path:"/services",idKey:"serviceId",createPath:"/services",updatePath:r=>`/services/update/${r.serviceId}`,deletePath:r=>`/services/${r.serviceId}`,
    description:"Quản lý danh mục dịch vụ và mức phí.",columns:[{key:"serviceId",label:"ID"},{key:"serviceName",label:"Tên dịch vụ"},{key:"serviceTime",label:"Chu kỳ"},{key:"servicePrice",label:"Giá"},{key:"serviceStatus",label:"Trạng thái"}],
    fields:[{name:"serviceName",label:"Tên dịch vụ",required:true},{name:"serviceTime",label:"Chu kỳ",type:"number"},{name:"servicePrice",label:"Giá",type:"number"},{name:"serviceIcon",label:"Icon / URL"},{name:"serviceStatus",label:"Trạng thái",options:status,defaultValue:"ACTIVE"}]
  },
  amenities: {
    title:"Tiện nghi",itemName:"tiện nghi",path:"/amenities",idKey:"amenityId",createPath:"/amenities",updatePath:r=>`/amenities/update/${r.amenityId}`,deletePath:r=>`/amenities/${r.amenityId}`,
    description:"Quản lý danh mục tiện nghi trong phòng.",columns:[{key:"amenityId",label:"ID"},{key:"amenityName",label:"Tên tiện nghi"}],
    fields:[{name:"amenityName",label:"Tên tiện nghi",required:true}]
  },
  contracts: {
    title:"Hợp đồng thuê",itemName:"hợp đồng",path:"/user-room",idKey:"userRoomId",deletePath:r=>`/user-room/${r.userRoomId}`,
    description:"Danh sách lượt thuê hiện tại từ API user-room.",columns:[{key:"userRoomId",label:"ID"},{key:"userId",label:"User ID"},{key:"roomId",label:"Room ID"},{key:"startDate",label:"Ngày bắt đầu"},{key:"endDate",label:"Ngày kết thúc"},{key:"monthlyRent",label:"Tiền thuê / tháng"},{key:"contractStatus",label:"Trạng thái"}]
  },
  "rental-requests": {
    title:"Yêu cầu thuê",itemName:"yêu cầu thuê",path:"/rental-requests/admin",idKey:"rentalRequestId",
    description:"Yêu cầu thuê từ sinh viên; trạng thái do chủ trọ xử lý.",statusOptions:[["PENDING","Đang chờ"],["ACCEPTED","Đã chấp nhận"],["REJECTED","Đã từ chối"],["CANCELLED","Đã hủy"]],
    columns:[{key:"rentalRequestId",label:"ID"},{key:"studentName",label:"Sinh viên"},{key:"studentPhone",label:"Điện thoại"},{key:"roomId",label:"Room ID"},{key:"requestedStartDate",label:"Ngày bắt đầu"},{key:"requestedRent",label:"Giá thuê"},{key:"status",label:"Trạng thái"},{key:"createdAt",label:"Ngày gửi",format:v=>new Date(v).toLocaleString("vi-VN")}]
  },
  "viewing-appointments": {
    title:"Lịch xem phòng",itemName:"lịch xem",path:"/viewing-appointments/admin",idKey:"appointmentId",
    description:"Theo dõi các lịch xem phòng và trạng thái xử lý.",statusOptions:[["PENDING","Đang chờ"],["CONFIRMED","Đã xác nhận"],["REJECTED","Đã từ chối"],["CANCELLED","Đã hủy"],["COMPLETED","Hoàn tất"]],
    columns:[{key:"appointmentId",label:"ID"},{key:"studentName",label:"Sinh viên"},{key:"studentPhone",label:"Điện thoại"},{key:"roomId",label:"Room ID"},{key:"motelName",label:"Nhà trọ"},{key:"requestedAt",label:"Thời gian yêu cầu",format:v=>new Date(v).toLocaleString("vi-VN")},{key:"scheduledAt",label:"Lịch hẹn",format:v=>v?new Date(v).toLocaleString("vi-VN"):"—"},{key:"status",label:"Trạng thái"}]
  },
  reviews: {
    title:"Đánh giá phòng",itemName:"đánh giá",path:"/room-reviews/admin",idKey:"reviewId",deletePath:r=>`/room-reviews/${r.reviewId}`,
    description:"Kiểm duyệt nội dung đánh giá do sinh viên gửi.",
    columns:[{key:"reviewId",label:"ID"},{key:"studentName",label:"Sinh viên"},{key:"roomId",label:"Room ID"},{key:"rating",label:"Điểm"},{key:"reviewContent",label:"Nội dung"},{key:"createdAt",label:"Ngày gửi",format:v=>new Date(v).toLocaleString("vi-VN")}]
  }
};
