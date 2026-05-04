# Kết nối Terminal với Shizuku: Điều khiển Android toàn năng qua Termux

Bài viết này là note lại cách mình setup kết nối giữa **Termux** và **Shizuku**. Rất hữu ích khi cần chạy các lệnh ADB trên Android mà không có quyền Root.

## 1. Yêu cầu chuẩn bị
- Ứng dụng **Termux** cài đặt từ F-Droid.
- Ứng dụng **Shizuku** cài đặt từ Google Play Store.
- Điện thoại đã bật tuỳ chọn nhà phát triển (Developer Options) và Wireless Debugging.

## 2. Các bước thực hiện

### Bước 1: Khởi động Shizuku
Mở Shizuku, chọn **Start via Wireless Debugging**. Làm theo hướng dẫn trên màn hình để pair thiết bị và khởi động dịch vụ Shizuku.

### Bước 2: Cài đặt gói cần thiết trên Termux
Mở Termux và chạy lệnh sau để cài đặt các công cụ:
```bash
pkg update && pkg upgrade
pkg install rish
```
*(Lưu ý: Bạn có thể cần clone repo github của Shizuku để lấy file rish nếu pkg chưa có sẵn)*

### Bước 3: Xuất file cấu hình rish
Từ Shizuku, chọn **Export rish files**. Các file cấu hình sẽ được lưu vào bộ nhớ trong. Bạn cần copy chúng vào thư mục của Termux.

### Bước 4: Chạy lệnh ADB
Bây giờ bạn có thể dùng lệnh `rish` để chạy lệnh như ADB shell:
```bash
rish sh -c "pm list packages"
```

---
**Lưu ý:** Bài viết được viết vào năm 2026. Nếu bạn thấy có thay đổi mới từ các bản cập nhật của Termux hoặc Shizuku, hãy để lại comment phía dưới nhé!
