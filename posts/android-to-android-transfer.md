# Hướng dẫn truyền file giữa hai thiết bị Android qua Termux bằng SCP

Bạn có hai chiếc điện thoại Android và muốn chuyển một file dung lượng lớn hoặc hàng loạt ảnh mà không muốn dùng qua Cloud hay các ứng dụng bên thứ ba chậm chạp? Nếu bạn đã quen thuộc với **Termux**, việc sử dụng lệnh **SCP** (Secure Copy) là cách nhanh chóng, an toàn và chuyên nghiệp nhất.

## 1. Yêu cầu chuẩn bị

Để thực hiện, cả hai thiết bị Android đều cần:
- Đã cài đặt ứng dụng **Termux**.
- Đã cài đặt gói OpenSSH: `pkg install openssh`.
- Đã thiết lập mật khẩu cho Termux (để xác thực khi truyền file): `passwd`.
- Đã bật dịch vụ SSH: `sshd`.

## 2. Xác định địa chỉ IP của thiết bị NHẬN

Thiết bị nhận file cần cung cấp địa chỉ IP cho thiết bị gửi. Tùy vào môi trường mạng, bạn có hai cách:

### Cách 1: Trong cùng mạng Wi-Fi (Local IP)
Mở Termux trên máy nhận và gõ:
```bash
ifconfig
```
Tìm dòng `inet` trong mục `wlan0`. Thường nó sẽ có dạng `192.168.1.x`.

### Cách 2: Khác mạng Wi-Fi (Dùng Tailscale)
Nếu hai máy không ở gần nhau, hãy cài đặt **Tailscale** trên cả hai. Trên máy nhận, gõ:
```bash
tailscale ip -4
```
Bạn sẽ nhận được một địa chỉ IP có dạng `100.x.y.z`. Đây là địa chỉ IP cố định giúp bạn kết nối từ bất cứ đâu.

## 3. Cách thực hiện truyền file

Trên thiết bị **GỬI**, sử dụng lệnh `scp` theo cú pháp sau:

```bash
scp -P 8022 [đường_dẫn_file_gửi] [user]@[ip_máy_nhận]:[đường_dẫn_đích]
```

### Ví dụ thực tế:
Giả sử bạn muốn gửi file `video.mp4` trong thư mục Download sang máy nhận có IP Tailscale là `100.1.2.3`:

```bash
scp -P 8022 ~/storage/downloads/video.mp4 100.1.2.3:/sdcard/Download/
```

### Giải thích các tham số:
- `-P 8022`: Cổng mặc định của Termux (P viết hoa).
- `~/storage/downloads/video.mp4`: Đường dẫn file trên máy gửi.
- `100.1.2.3`: IP của máy nhận (Local hoặc Tailscale).
- `:/sdcard/Download/`: Thư mục bạn muốn lưu file trên máy nhận.

## 4. Một số lưu ý quan trọng

- **Truyền cả thư mục:** Thêm tham số `-r`. Ví dụ: `scp -P 8022 -r ./my_folder/ 100.1.2.3:/sdcard/`
- **Lỗi Connection Refused:** Kiểm tra xem máy nhận đã gõ lệnh `sshd` chưa.
- **Quyền truy cập bộ nhớ:** Đảm bảo bạn đã chạy `termux-setup-storage` trên cả hai máy để Termux có quyền đọc/ghi file vào bộ nhớ điện thoại.

---
*Hy vọng hướng dẫn này giúp bạn làm chủ việc quản lý file giữa các thiết bị Android một cách hiệu quả hơn!*
