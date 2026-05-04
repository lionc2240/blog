# Lấy file từ điện thoại về máy tính từ xa qua SCP & Termux

Bạn đang để điện thoại ở nhà và cần lấy một file tài liệu quan trọng về máy tính công ty? Nếu đã cài sẵn Termux và SSH, việc này cực kỳ đơn giản với lệnh **SCP**.

> [!IMPORTANT]
> Hướng dẫn này dành cho trường hợp điện thoại bạn đã setup sẵn **Shizuku** và **Wireless Debugging** để đảm bảo dịch vụ Termux không bị hệ thống Android tự động tắt khi bạn không ở nhà.

## 1. Yêu cầu chuẩn bị
- Điện thoại ở nhà đang bật và có kết nối mạng ổn định.
- **Đảm bảo đã cài sẵn Tailscale** trên cả điện thoại và máy tính để kết nối từ xa.
- Đã cài đặt **Termux**, **Shizuku** và đã có quyền `rish`.
- Đã cài đặt gói `openssh` trên Termux: `pkg install openssh`.
- Đã khởi động dịch vụ SSH: `sshd`.
- Đã thiết lập mật khẩu Termux bằng lệnh `passwd`.
- **IP Address:** Địa chỉ IP của điện thoại (Dùng **IP Tailscale** để kết nối từ xa mà không cần mở port router).

## 2. Cách thực hiện

Mở Terminal trên máy tính của bạn (Windows PowerShell, CMD hoặc Linux Terminal) và sử dụng cú pháp sau:

```bash
scp -P 8022 [ip_address]:/sdcard/path/to/your/file C:\Users\YourUser\Desktop
```

### Giải thích các tham số:
- `-P 8022`: Cổng mặc định của SSH trên Termux (Lưu ý là P viết hoa).
- `[ip_address]`: Địa chỉ IP của điện thoại bạn (Ví dụ: `100.x.x.x` nếu dùng Tailscale).
- `:/sdcard/path/to/file`: Đường dẫn đến file cần lấy trên điện thoại. 
- `C:\Users\YourUser\Desktop`: Thư mục đích trên máy tính bạn muốn lưu file.

## 3. Một số lưu ý
- Nếu bạn muốn lấy cả một thư mục, hãy thêm tham số `-r`: `scp -P 8022 -r ...`
- Nếu báo lỗi "Connection refused", hãy kiểm tra xem bạn đã gõ lệnh `sshd` trên Termux chưa.
- Bạn có thể kết hợp với bài viết [Kết nối Terminal với Shizuku](#) để đảm bảo Termux luôn chạy ngầm ổn định.

---
*Nếu lệnh không hoạt động hoặc có lỗi phát sinh, hãy để lại bình luận phía dưới nhé!*
