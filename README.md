
Để **clone project React từ GitHub về máy**, bạn làm theo các bước sau 👇

---

### ✅ **1. Mở Git Bash hoặc Terminal**

* Trên Windows: Mở **Git Bash**
* Trên VS Code: mở **Terminal (Ctrl + \`)**

---

### ✅ **2. Di chuyển tới thư mục bạn muốn chứa project**

Ví dụ, nếu bạn muốn lưu ở ổ D:\Project:

```bash
cd /d/Project
```

---

### ✅ **3. Clone project từ GitHub**

Chạy lệnh:

```bash
git clone https://github.com/ThinhBuiCoder/Travel_ReactApp.git
```

> 💡 Bạn đang clone toàn bộ project trong nhánh `main`, không cần thêm `/tree/main`.

---

### ✅ **4. Mở project bằng VS Code (tuỳ chọn)**

```bash
cd Travel_ReactApp
code .
```

---

### ✅ **5. Cài đặt thư viện React**

Vì bạn không clone `node_modules`, nên cần chạy:

```bash
npm install
```

> 📦 Lệnh này sẽ đọc file `package.json` và cài toàn bộ thư viện cần thiết.

---

### ✅ **6. Chạy project React**

Sau khi cài xong:

```bash
npm start
```

Project sẽ chạy tại `http://localhost:3000`.

---

Nếu bạn gặp lỗi khi chạy `npm install` hoặc `npm start`, gửi mình lỗi, mình sẽ giúp fix ngay.
