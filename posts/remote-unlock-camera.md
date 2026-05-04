# Tự động hóa mở khóa Pattern và Điều khiển Camera từ xa qua Termux & Shizuku

> [TIP]
> Bài viết này tập trung vào việc vượt qua màn hình khóa (Pattern) bằng lệnh shell. Hãy đảm bảo bạn đã thiết lập thành công `rish` theo hướng dẫn [Kết nối Terminal với Shizuku](#) trước khi bắt đầu.

Khi không có nhà, việc điều khiển điện thoại từ xa qua Termux thường bị chặn bởi màn hình khóa. Bài viết này sẽ hướng dẫn cách "vẽ" Pattern tự động và kích hoạt Camera bằng lệnh Shell trên các dòng máy Android (đặc biệt là Samsung S10e).

## 1. Vấn đề: Tại sao `input swipe` lại thất bại?

Thông thường, chúng ta dùng lệnh `input swipe X1 Y1 X2 Y2` để mô phỏng thao tác vuốt. Tuy nhiên, nếu Pattern của bạn gồm nhiều điểm nối lại (ví dụ hình chữ L, chữ Z), việc dùng nhiều lệnh `swipe` liên tiếp sẽ khiến hệ thống hiểu là bạn **nhấc tay lên** sau mỗi đoạn, dẫn đến vẽ sai hình.

## 2. Giải pháp: Lệnh `motionevent` (Android 12+)

Để vẽ một đường liên tục không nhấc tay, chúng ta cần sử dụng chuỗi lệnh `motionevent`.

### Bước 1: Đánh thức màn hình
Thay vì nút Nguồn (có thể làm tắt màn hình nếu nó đang bật), hãy dùng phím `WAKEUP`:
```bash
./rish -c "input keyevent 224"
```

### Bước 2: Vuốt để hiện bảng vẽ Pattern
```bash
# Vuốt từ dưới lên (X1 Y1 là điểm bắt đầu, X1 Y2 là điểm kết thúc)
./rish -c "input swipe X1 Y1 X1 Y2 150"
```

### Bước 3: Vẽ hình Pattern liên tục
Sử dụng tọa độ lấy từ **Pointer Location** trong Cài đặt nhà phát triển. Dưới đây là cấu trúc lệnh để vẽ một hình Pattern liên tục:

```bash
# Gộp lệnh vào 1 lần gọi rish để tránh độ trễ
./rish -c "
 input motionevent down X1 Y1;
 input motionevent move X2 Y2;
 input motionevent move X3 Y3;
 input motionevent move X4 Y4;
 input motionevent move X5 Y5;
 input motionevent up X5 Y5;
"
```

## 3. Tạo Script tự động hóa `unlock.sh`

Để thuận tiện cho việc kích hoạt từ xa (qua SSH hoặc Telegram Bot), hãy tạo một file script:

```bash
nano unlock.sh
```

Nội dung file:
```bash
#!/bin/bash
# 1. Bat man hinh
./rish -c "input keyevent 224"
sleep 0.5
# 2. Mo bang Pattern
./rish -c "input swipe X1 Y1 X1 Y2 150"
sleep 0.3
# 3. Ve Pattern (Thay các X Y bang toa do thuc te cua ban)
./rish -c "input motionevent down X1 Y1; input motionevent move X2 Y2; input motionevent move X3 Y3; input motionevent move X4 Y4; input motionevent move X5 Y5; input motionevent up X5 Y5;"
```

Cấp quyền thực thi: `chmod +x unlock.sh`

## 4. Các hành động sau khi mở khóa

### Mở Camera mặc định (Samsung)
```bash
./rish -c "am start -n com.sec.android.app.camera/com.sec.android.app.camera.Camera"
```

### Chụp ảnh ngầm (Không cần mở khóa màn hình)
Nếu bạn chỉ cần ảnh mà không cần "vẽ" màn hình, hãy dùng **Termux:API**:
```bash
# Chụp bằng camera sau và lưu vào bộ nhớ Termux
termux-camera-photo -c 0 ~/remote_photo.jpg
```

## 5. Kích hoạt từ xa

Để thực thi script này khi không có nhà, bạn có 2 hướng:
1. **SSH:** Sử dụng Cloudflare Tunnel hoặc Ngrok để SSH vào Termux từ bên ngoài.
2. **Telegram Bot:** Viết một script Python đơn giản sử dụng thư viện `telebot`. Khi nhận lệnh `/unlock`, script sẽ thực thi `./unlock.sh`.

---

**Lưu ý an toàn:** Việc lưu tọa độ Pattern vào file script có thể gây rủi ro bảo mật nếu điện thoại rơi vào tay người lạ. Hãy cân nhắc bảo vệ file này hoặc sử dụng phương thức xóa dấu vết sau khi dùng.

**Chúc bạn thành công!**
