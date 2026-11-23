# Kết nối ADB với Localhost trên Android: Điều khiển thiết bị từ chính nó (không cần USB, không cần Root)

Bạn đang dùng Termux trên Android và muốn chạy lệnh `adb shell` trực tiếp trên chính thiết bị đó — mà không cần cắm cáp USB hay root máy? Đây là cách thực hiện hoàn toàn hợp lệ thông qua tính năng **Wireless Debugging** có sẵn từ Android 11 trở lên.

## 1. Điều kiện chuẩn bị (Conditions)

- **Android 11 trở lên** (tính năng Wireless Debugging chỉ có từ Android 11)
- **Termux** đã cài đặt với `android-tools` (`adb`)
- **Không cần root**, không cần USB, không cần máy tính

Cài `adb` trong Termux nếu chưa có:
```bash
pkg install android-tools
```

## 2. Các bước thực hiện (How to)

### Bước 1: Bật Developer Options

Vào **Settings → About phone → Software information**, tap **7 lần** vào **Build number** cho đến khi thấy thông báo:
> *"You are now a developer!"*

---

### Bước 2: Bật Wireless Debugging

Vào **Settings → Developer options → Wireless debugging** → gạt **ON**.

Màn hình sẽ hiển thị:
```
IP address & Port: 100.x.x.x:XXXXX   ← đây là port kết nối chính
```

Ghi lại port này.

---

### Bước 3: Lấy Pairing Code

Trong màn hình **Wireless debugging**, tap vào **"Pair device with pairing code"**.

Sẽ hiện một hộp thoại với:
```
Wi-Fi pairing code: 981662          ← mã 6 số
IP & Port: 100.x.x.x:34453         ← port pairing (khác port trên)
```

---

### Bước 4: Pair trong Termux

Mở Termux, chạy lệnh với port pairing và mã 6 số từ bước 3:

```bash
adb pair 100.113.58.97:34453
# Nhập mã 6 số khi được hỏi: 981662
```

Kết quả thành công:
```
Successfully paired to 100.113.58.97:34453 [guid=adb-XXXXX-XXXXX]
```

---

### Bước 5: Connect bằng port chính

Dùng port hiển thị ở **Bước 2** (không phải port pairing):

```bash
adb connect 100.113.58.97:43827
```

Kết quả:
```
connected to 100.113.58.97:43827
```

---

### Bước 6: Kiểm tra và sử dụng

```bash
adb devices
# → 100.113.58.97:43827   device

# Ví dụ: bật màn hình
adb shell input keyevent KEYCODE_WAKEUP

# Mở Developer Options
adb shell am start -a android.settings.APPLICATION_DEVELOPMENT_SETTINGS

# Chụp màn hình
adb shell screencap -p /sdcard/capture.png
```

## 3. Lưu ý quan trọng (Notes)

> **Port thay đổi sau mỗi lần reboot:** Wireless Debugging sẽ tạo port ngẫu nhiên mỗi khi bật lại. Bạn cần lặp lại từ Bước 3 sau mỗi lần khởi động lại thiết bị.

> **Bảo mật:** Chỉ nên dùng trên mạng WiFi/VPN tin cậy (như Tailscale). Tránh để port ADB mở trên mạng công cộng.

> **Pairing chỉ cần làm 1 lần:** Sau khi đã pair thành công một lần, những lần sau chỉ cần `adb connect <ip>:<port_mới>` là đủ, không cần pair lại.

## 4. Tích hợp với Script tự động

Nếu bạn dùng script điều khiển từ thiết bị khác qua SSH, có thể kiểm tra ADB trước khi chạy lệnh:

```bash
#!/bin/bash
ADB_HOST="100.113.58.97"
ADB_PORT="43827"

# Kiểm tra kết nối
if ! adb -s "$ADB_HOST:$ADB_PORT" get-state &>/dev/null; then
  echo "[!] ADB chưa kết nối. Chạy: adb connect $ADB_HOST:$ADB_PORT"
  exit 1
fi

adb -s "$ADB_HOST:$ADB_PORT" shell "$@"
```

Lưu thành `adb-run.sh`, dùng như:
```bash
./adb-run.sh input keyevent KEYCODE_WAKEUP
```

*Xem thêm: [Mở cổng ADB 5555 từ A-Z](post.html?id=adb-open-port-5555) | [Kết nối ADB từ xa với Tailscale](post.html?id=adb-tailscale-remote) | [Điều khiển S10e từ Oppo A79](post.html?id=remote-control-s10e-oppo-a79)*
