# Hướng dẫn truyền file giữa hai thiết bị Android qua Termux bằng SCP

Bạn có hai chiếc điện thoại Android và muốn chuyển một file dung lượng lớn hoặc hàng loạt ảnh mà không muốn dùng qua Cloud? Sử dụng lệnh **SCP** (Secure Copy) qua **Termux** là cách nhanh chóng, an toàn và chuyên nghiệp nhất.

## 1. Điều kiện cần chuẩn bị (Conditions)

Để thực hiện, cả hai thiết bị Android đều cần:
- Đã cài đặt ứng dụng **Termux**.
- Đã cài đặt ứng dụng **Tailscale** (nếu muốn truyền file khi không cùng mạng Wi-Fi).
- Đã cấp quyền truy cập bộ nhớ cho Termux bằng lệnh: `termux-setup-storage`.

## 2. Cài đặt môi trường (Installation)

Trên cả hai thiết bị, hãy mở Termux và thực hiện các bước sau:

1. **Cài đặt OpenSSH:**
   ```bash
   pkg update && pkg install openssh
   ```
2. **Thiết lập mật khẩu:** (Dùng để xác thực khi máy kia kết nối tới)
   ```bash
   passwd
   ```
3. **Bật dịch vụ SSH:**
   ```bash
   sshd
   ```

## 3. Cách thực hiện truyền file (How to use)

### Bước 1: Xác định địa chỉ IP của thiết bị NHẬN

Thiết bị nhận file cần cung cấp địa chỉ IP cho thiết bị gửi:

- **Nếu dùng chung mạng Wi-Fi (Local IP):** 
  Gõ `ifconfig` trong Termux, tìm dòng `inet` trong mục `wlan0` (thường là `192.168.1.x`).
- **Nếu dùng Tailscale (Khác mạng/Từ xa):**
  Mở **app Tailscale** trên Android, nhấn vào thiết bị hiện tại và sao chép địa chỉ IP (thường bắt đầu bằng `100.x.y.z`).
  *(Lưu ý: Lệnh `tailscale ip` trong Termux sẽ không chạy trừ khi bạn cài đặt bản tailscale-linux, nên dùng app Android cho đơn giản).*

### Bước 2: Thực hiện lệnh gửi file

Trên thiết bị **GỬI**, sử dụng lệnh `scp` theo cú pháp:

```bash
scp -P 8022 [đường_dẫn_file] [ip_máy_nhận]:[đường_dẫn_đích]
```

**Ví dụ thực tế:**
Gửi file ảnh `landscape.jpg` sang máy nhận có IP Tailscale là `100.1.2.3`:
```bash
scp -P 8022 ~/storage/dcim/Camera/landscape.jpg 100.1.2.3:/sdcard/Download/
```

### Bước 3: Nhập mật khẩu
Sau khi chạy lệnh, Termux sẽ yêu cầu nhập mật khẩu. Hãy nhập mật khẩu bạn đã thiết lập ở bước **Installation** (khi nhập sẽ không hiện ký tự, cứ gõ xong rồi Enter).

---
## Một số lưu ý quan trọng
- **Truyền cả thư mục:** Thêm tham số `-r`. Ví dụ: `scp -P 8022 -r ./my_folder/ 100.1.2.3:/sdcard/`
- **Lỗi Connection Refused:** Kiểm tra xem máy nhận đã gõ lệnh `sshd` chưa.
- **Tốc độ:** Truyền qua mạng Local (Wi-Fi) sẽ nhanh hơn rất nhiều so với truyền qua Tailscale nếu mạng 4G/5G yếu.

---
*Hy vọng hướng dẫn này giúp bạn truyền dữ liệu giữa các thiết bị Android một cách chuyên nghiệp hơn!*
