Trong bài viết trước, chúng ta đã tìm hiểu cách lấy file từ điện thoại về máy tính. Hôm nay, tôi sẽ hướng dẫn các bạn thực hiện theo chiều ngược lại: chuyển file hoặc thư mục từ máy tính (Windows/Linux/macOS) vào điện thoại Android thông qua Termux bằng lệnh SCP.

## Yêu cầu chuẩn bị

1.  **Điện thoại**: Đã cài đặt Termux và gói `openssh`.
2.  **Máy tính**: Có sẵn trình terminal (như Windows Terminal, CMD, PowerShell hoặc Linux Terminal).
3.  **Kết nối**: Cả hai thiết bị phải nằm trong cùng mạng Wifi hoặc kết nối qua VPN (như Tailscale) để nhìn thấy IP của nhau.
4.  **SSH Server**: Đã chạy lệnh `sshd` trong Termux.

## Cú pháp lệnh SCP trên Windows Terminal

Để chuyển một thư mục từ máy tính về điện thoại, bạn sử dụng cú pháp sau trên máy tính:

```bash
scp -P 8022 -r "ĐƯỜNG_DẪN_NGUỒN" USERNAME@IP_ĐIỆN_THOẠI:ĐƯỜNG_DẪN_ĐÍCH
```

### Ví dụ thực tế

#### 1. Chuyển cả thư mục (Dùng tham số -r)
Giả sử bạn muốn chuyển thư mục `OCR_v1.36_optimizer` từ màn hình Desktop của Windows về thư mục `Download` trên điện thoại:

```bash
scp -P 8022 -r "D:\DESKTOP\OCR_v1.36_optimizer" u0_a627@100.88.207.25:/sdcard/Download/
```

#### 2. Chuyển một file đơn lẻ
Nếu bạn chỉ muốn chuyển một file duy nhất (ví dụ file ảnh `photo.jpg`), bạn có thể bỏ tham số `-r`:

```bash
scp -P 8022 "D:\DESKTOP\photo.jpg" u0_a627@100.88.207.25:/sdcard/Download/
```

### Giải thích các tham số:
- `-P 8022`: Chỉ định cổng SSH của Termux (mặc định là 8022). Lưu ý chữ **P** viết hoa.
- `-r`: Sao chép đệ quy (dùng khi bạn muốn chuyển cả một thư mục). Nếu chỉ chuyển 1 file đơn lẻ, bạn có thể bỏ tham số này.
- `"D:\DESKTOP\..."`: Đường dẫn đến file/thư mục trên máy tính (nên để trong ngoặc kép nếu có khoảng trắng).
- `u0_a627@100.88.207.25`: Tên người dùng và địa chỉ IP của điện thoại.
- `:/sdcard/Download/`: Đường dẫn đích trên điện thoại (thư mục Download chung của Android).

## Các lỗi thường gặp

1.  **Connection Refused**: Kiểm tra xem bạn đã gõ lệnh `sshd` trong Termux chưa.
2.  **Permission Denied**: Hãy chắc chắn bạn đã chạy lệnh `termux-setup-storage` trong Termux để cấp quyền truy cập bộ nhớ máy.
3.  **Wrong Password**: Nếu bạn chưa thiết lập SSH Key, hãy đảm bảo bạn đã đặt mật khẩu bằng lệnh `passwd` trong Termux.

Hy vọng hướng dẫn này giúp ích cho việc quản lý dữ liệu giữa các thiết bị của bạn!
