# API Quản lý Hệ Thống

## Quản lý Tình Nguyện Viên
### Base URL
`http://localhost:3001/users/`

### Lấy danh sách user đã phân trang
- **Method:** GET
- **URL:** `/`

### Lấy chi tiết user
- **Method:** POST
- **URL:** `/detail`

### Cập nhật user
- **Method:** PUT
- **URL:** `/`

### Xóa user
- **Method:** DELETE
- **URL:** `/:id`

---

## Quản lý Tổ Chức
### Base URL
`http://localhost:3001/organizations/`

### User gửi yêu cầu duyệt
- **Method:** POST
- **URL:** `/request`

### Admin chấp nhận yêu cầu
- **Method:** PUT
- **URL:** `/approve/:id`

### Admin không chấp nhận yêu cầu
- **Method:** PUT
- **URL:** `/reject/:id`

### Lấy danh sách tổ chức
- **Method:** GET
- **URL:** `/`

### Lấy thông tin chi tiết tổ chức
- **Method:** GET
- **URL:** `/:id`

### Lấy danh sách các yêu cầu không được chấp nhận
- **Method:** GET
- **URL:** `/trash`

### Xóa 1 yêu cầu tổ chức bị hủy
- **Method:** DELETE
- **URL:** `/:id`

---

## Quản lý Role
### Base URL
`http://localhost:3001/roles/`

### Lấy danh sách role
- **Method:** GET
- **URL:** `/`

### Tạo role mới
- **Method:** POST
- **URL:** `/`

