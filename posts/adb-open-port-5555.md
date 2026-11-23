# Mở cổng ADB 5555 trên Android từ A-Z (không cần USB, không cần Root)

Wireless Debugging trên Android 11+ mỗi lần bật lại sẽ đổi sang một port ngẫu nhiên, rất bất tiện khi viết script hay điều khiển từ xa. Bài này hướng dẫn cách ép ADB nghe ở cổng cố định **5555** ngay trên điện thoại bằng Termux, không cần máy tính.

## 1. Điều kiện chuẩn bị (Conditions)

- **Android 11 trở lên** (có Wireless Debugging)
- **Termux** đã cài `adb`:
  ```bash
  pkg install android-tools
  ```
- Điện thoại đang kết nối **WiFi** (hoặc Tailscale nếu muốn dùng từ xa)

## 2. Hiểu đúng lệnh `adb tcpip 5555`

`adb tcpip 5555` **không tự mở port**. Lệnh này chỉ gửi yêu cầu tới một thiết bị **đang kết nối sẵn** với adb, bảo adbd chuyển sang nghe ở cổng 5555.

Nếu chạy khi chưa có thiết bị nào, bạn sẽ gặp lỗi:
```
~ $ adb tcpip 5555
error: no devices/emulators found
```

Vì vậy, phải **kết nối ADB trước** (qua USB hoặc Wireless Debugging), rồi mới chạy `adb tcpip 5555`.

## 3. Các bước thực hiện (How to)

### Bước 1: Bật Developer Options

**Settings → About phone → Software information**, tap **7 lần** vào **Build number**.

### Bước 2: Bật Wireless Debugging

**Settings → Developer options → Wireless debugging** → gạt **ON**.

Ghi lại dòng **IP address & Port** (ví dụ `100.113.58.97:36375`). Đây là port kết nối.

### Bước 3: Pair (chỉ cần làm 1 lần)

Tap **"Pair device with pairing code"**, màn hình hiện mã 6 số và một **port pairing** riêng. Trong Termux:

```bash
adb pair 100.113.58.97:<PORT_PAIRING>
# Enter pairing code: <mã 6 số>
```

Kết quả: `Successfully paired to ...`

> Mẹo: Dùng chế độ chia đôi màn hình (Termux + Settings) để vừa xem mã vừa gõ lệnh, vì hộp thoại pairing sẽ đóng nếu bạn rời khỏi Settings.

### Bước 4: Kết nối qua port Wireless Debugging

```bash
adb connect 100.113.58.97:36375
adb devices
```
```
List of devices attached
100.113.58.97:36375     device
```

### Bước 5: Chuyển sang cổng 5555

```bash
adb tcpip 5555
```
```
restarting in TCP mode port: 5555
```

### Bước 6: Kết nối lại bằng cổng 5555

```bash
adb connect localhost:5555
```
```
connected to localhost:5555
```

Kiểm tra lại bằng `adb devices`. Thấy `localhost:5555  device` là xong.

## 4. Log thực tế (đầy đủ)

```
~ $ adb tcpip 5555
error: no devices/emulators found
~ $ adb devices
List of devices attached

~ $ adb connect 100.113.58.97:36375
connected to 100.113.58.97:36375
~ $ adb devices
List of devices attached
100.113.58.97:36375     device

~ $ adb tcpip 5555
restarting in TCP mode port: 5555
~ $ adb connect localhost:5555
connected to localhost:5555
```

## 5. Sử dụng từ thiết bị khác

Khi cổng 5555 đã mở, máy khác trong cùng mạng (hoặc cùng Tailscale) có thể kết nối thẳng:

```bash
adb connect 100.113.58.97:5555
adb -s 100.113.58.97:5555 shell input keyevent KEYCODE_WAKEUP
```

## 6. Lưu ý (Notes)

- **Mất khi reboot:** Cổng 5555 sẽ đóng khi khởi động lại máy (có thể cả khi tắt Wireless Debugging). Lặp lại từ **Bước 2 → Bước 6**, bỏ qua Bước 3 vì pair chỉ cần 1 lần.
- **Kết nối cũ bị ngắt sau Bước 5:** Bình thường, adbd khởi động lại sang cổng mới. Cứ chạy Bước 6.
- **Nhiều thiết bị cùng lúc:** Nếu `adb devices` có nhiều dòng, chỉ định thiết bị bằng `-s`:
  ```bash
  adb -s 100.113.58.97:36375 tcpip 5555
  ```
- **Gõ đúng lệnh:** Là `adb connect localhost:5555`, không phải `adb localhost:5555` (sẽ báo `unknown command`).
- **Bảo mật:** Cổng 5555 không có xác thực pairing. Chỉ mở trên mạng tin cậy hoặc Tailscale, không mở ra Internet công cộng.

---

*Xem thêm: [Kết nối ADB với Localhost](post.html?id=adb-localhost-wireless-debugging) | [Kết nối ADB từ xa với Tailscale](post.html?id=adb-tailscale-remote)*
