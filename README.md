Đây là hướng dẫn chạy bài **hoàn chỉnh** cho Travel Hub React App:

---

# 🚀 **HƯỚNG DẪN CHẠY TRAVEL HUB REACT APP**

---

## 🔽 **BƯỚC 1: CLONE PROJECT TỪ GITHUB**

### ✅ **1.1 Mở Git Bash hoặc Terminal**
* Trên Windows: Mở **Git Bash**
* Trên VS Code: Mở **Terminal (Ctrl + `)**
* Trên Mac/Linux: Mở **Terminal**

### ✅ **1.2 Di chuyển tới thư mục lưu project**
```bash
# Ví dụ: Lưu ở ổ D:\Project
cd /d/Project

# Hoặc ổ C:\Users\YourName\Desktop
cd /c/Users/YourName/Desktop
```

### ✅ **1.3 Clone project từ GitHub**
```bash
git clone https://github.com/ThinhBuiCoder/Travel_ReactApp.git
```

### ✅ **1.4 Vào thư mục project**
```bash
cd Travel_ReactApp
```

### ✅ **1.5 Mở bằng VS Code (tùy chọn)**
```bash
code .
```

---

## 📦 **BƯỚC 2: CÀI ĐẶT THƯ VIỆN**

### ✅ **2.1 Cài đặt dependencies**
```bash
npm install
```
> 📦 Lệnh này sẽ đọc `package.json` và cài toàn bộ thư viện cần thiết.

### ✅ **2.2 Cài đặt JSON Server (cho database)**
```bash
npm install -g json-server
```
> 🗄️ JSON Server sẽ tạo REST API từ file `db.json`

---

## ⚙️ **BƯỚC 3: CẤU HÌNH DATABASE**

### ✅ **3.1 Kiểm tra file `db.json`**
Đảm bảo file `db.json` tồn tại ở **root folder** (cùng level với `package.json`):
```
Travel_ReactApp/
├── src/
├── public/
├── package.json
├── db.json          ← FILE NÀY PHẢI CÓ
└── README.md
```

### ✅ **3.2 Nếu thiếu file `db.json`, tạo file mới:**
Tạo file `db.json` với nội dung:
```json
{
  "tours": [],
  "users": [],
  "bookings": []
}
```

---

## 🚀 **BƯỚC 4: CHẠY ỨNG DỤNG**

```bash
npm run dev
```
> 🔄 Lệnh này sẽ chạy đồng thời JSON Server (port 3001) và React App (port 3000)

---

## 💬 **BƯỚC 5: CHẠY SERVER CHAT REAL TIME**

### ✅ **5.1 Cài đặt thư viện cho server chat**
```bash
cd src/components
npm install express socket.io cors
```

### ✅ **5.2 Chạy server chat**
```bash
node server.js
```
> 💡 Nếu thành công sẽ thấy: `Socket.io chat server running on port 4000`

---

## 🔍 **BƯỚC 6: KIỂM TRA HOẠT ĐỘNG**

### ✅ **6.1 Kiểm tra React App**
- Mở browser tại: `http://localhost:3000`
- **Mong đợi:** Trang chủ Travel Hub hiển thị

### ✅ **6.2 Kiểm tra JSON Server API**
- Mở browser tại: `http://localhost:3001/tours`
- **Mong đợi:** JSON response với danh sách tours

### ✅ **6.3 Kiểm tra chat real time**
- Đăng nhập bằng 2 tài khoản khác nhau (user & admin) trên 2 trình duyệt/tab.
- Gửi tin nhắn ở khung "Chat real time" trên trang chủ, tin nhắn sẽ xuất hiện ngay lập tức ở cả 2 bên.

### ✅ **6.4 Test các tính năng:**
1. **Đăng nhập:** Email bất kỳ + password bất kỳ
2. **Xem tours:** Danh sách tour hiển thị (có phân trang, mỗi trang 9 tour)
3. **Tạo tour:** Click "Thêm tour mới"
4. **Advanced Search:** Click "Bộ lọc nâng cao"
5. **Tour nổi bật:** Trang chủ hiển thị 6 tour có rating cao nhất
6. **Chat real time:** Gửi/nhận tin nhắn giữa user và admin

---

## 🛠️ **TROUBLESHOOTING - XỬ LÝ LỖI**

### ❌ **Lỗi: "Something is already running on port 3000"**
```bash
# Cách 1: Kill process
npx kill-port 3000

# Cách 2: Chạy trên port khác
PORT=3002 npm start
```

### ❌ **Lỗi: "ENOENT: no such file or directory, open 'db.json'"**
```bash
# Tạo file db.json ở root folder
echo '{"tours":[],"users":[],"bookings":[]}' > db.json
```

### ❌ **Lỗi: "json-server: command not found"**
```bash
# Cài đặt JSON Server global
npm install -g json-server

# Hoặc dùng local
npx json-server --watch db.json --port 3001
```

### ❌ **Lỗi: "Failed to fetch tours"**
```bash
# Kiểm tra JSON Server có chạy không
curl http://localhost:3001/tours

# Nếu không có response, restart JSON Server
npm run server
```

### ❌ **Lỗi: npm install fails**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install
```

### ❌ **Lỗi: Chat real time không kết nối được**
- Đảm bảo đã chạy `node server.js` trong `src/components`.
- Nếu port 4000 bị chiếm, đổi cả ở `server.js` và `ChatRealtime.js`.
- Kiểm tra firewall/antivirus không chặn port 4000.

---

## 📱 **CÁC URL QUAN TRỌNG**

| Service | URL | Mô tả |
|---------|-----|-------|
| **React App** | `http://localhost:3000` | Giao diện người dùng |
| **JSON Server** | `http://localhost:3001` | REST API |
| **Tours API** | `http://localhost:3001/tours` | Danh sách tours |
| **Users API** | `http://localhost:3001/users` | Danh sách users |
| **Bookings API** | `http://localhost:3001/bookings` | Danh sách bookings |
| **Chat Server** | `http://localhost:4000` | Socket.io chat server |

---

## 🎯 **CÁC SCRIPT NPM AVAILABLE**

```bash
npm start          # Chạy React App (port 3000)
npm run server     # Chạy JSON Server (port 3001)  
npm run dev        # Chạy cả 2 cùng lúc
npm run build      # Build production
npm test           # Chạy tests
```

---

## 📋 **CHECKLIST HOÀN THÀNH**

- [ ] ✅ Clone project thành công
- [ ] ✅ `npm install` không lỗi
- [ ] ✅ File `db.json` tồn tại
- [ ] ✅ JSON Server chạy ở port 3001
- [ ] ✅ React App chạy ở port 3000
- [ ] ✅ Server chat real time chạy ở port 4000
- [ ] ✅ Có thể đăng nhập
- [ ] ✅ Có thể xem danh sách tours (có phân trang)
- [ ] ✅ Có thể tạo tour mới
- [ ] ✅ Advanced Search hoạt động
- [ ] ✅ Tour nổi bật lấy theo rating cao nhất
- [ ] ✅ Chat real time hoạt động

---

## 🆘 **HỖ TRỢ**

Nếu gặp vấn đề, hãy:

1. **Check logs** trong Terminal để xem lỗi cụ thể
2. **Restart** cả 2 servers: `Ctrl+C` rồi chạy lại
3. **Clear cache**: `npm start -- --reset-cache`
4. **Contact** leader team để được hỗ trợ

---

## 🎉 **THÀNH CÔNG!**

Nếu tất cả các bước trên hoạt động, bạn đã setup thành công **Travel Hub React App**!

**Features có sẵn:**
- ✅ Xem/Tạo/Sửa/Xóa tours
- ✅ Đăng nhập/đăng xuất  
- ✅ Advanced Search & Filter
- ✅ Thanh toán giả lập
- ✅ AI Chatbot tư vấn
- ✅ Statistics & Analytics
- ✅ Chat real time user ↔ admin
- ✅ Tour nổi bật lấy theo rating cao nhất

**Happy Coding! 🚀**
