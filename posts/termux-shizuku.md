# Kết nối Terminal với Shizuku: Điều khiển Android toàn năng qua Termux

> [TIP]
> Sẽ nhanh hơn nếu bạn đã thiết lập SSH với PC/ Laptop, nếu chưa thiết lập, bạn có thể xem hướng dẫn [tại đây](#).

Bài viết này là note lại cách mình setup kết nối giữa **Termux** và **Shizuku**. Rất hữu ích khi cần chạy các lệnh ADB trên Android mà không có quyền Root.

## 1. Yêu cầu chuẩn bị

- Ứng dụng **Termux** cài đặt từ [F-Droid](https://f-droid.org/packages/com.termux/) (0.119.0-beta.3)
- Ứng dụng **Shizuku** cài đặt từ [Github Releases](https://github.com/RikkaApps/Shizuku/releases) (v13.6.0) (Nếu chưa cài đặt, hãy xem [hướng dẫn Cài đặt và Chạy Shizuku trên Android 12 tại đây](https://www.youtube.com/shorts/PPUwXPDwddU "How to Install and Run Shizuku on Android 12"))
- Điện thoại đã bật Tuỳ chọn nhà phát triển (Developer Options) và Wireless Debugging.

## 2. Các bước thực hiện

### Bước 1: Khởi động Shizuku

Mở Shizuku, chọn **Start via Wireless Debugging**. Làm theo hướng dẫn trên màn hình để pair thiết bị và khởi động dịch vụ Shizuku.

### Bước 2: Cài đặt gói cần thiết trên Termux

Mở Termux và chạy lệnh sau để cài đặt các công cụ:

```bash
pkg update && pkg upgrade
```

### Bước 3: Xuất và thiết lập file cấu hình `rish`

Từ ứng dụng Shizuku, chọn **Use rish in Terminal** -> **Export rish files**. Các file cấu hình sẽ được lưu vào bộ nhớ trong. Bạn cần thực hiện các lệnh sau trên Termux để thiết lập:

1. Thiết lập quyền truy cập bộ nhớ (nếu chưa làm):

   ```bash
   termux-setup-storage
   ```
2. Copy các file `rish` vào thư mục Home (Giả sử bạn lưu file rish tại thư mục tên shizuku trên máy)

   ```bash
   cp /sdcard/shizuku/rish* $HOME
   ```

   > Sau khi chạy xong, bạn có thể thấy file rish đang nằm tại đường dẫn gốc (home) của Termux, hãy thử kiểm tra bằng lệnh `ls -a`.
   >
3. Chỉnh sửa package name trong file rish vừa được tạo

   ```bash
   nano rish
   ```

   Thay `PKG` tại dòng `[ -z "$RISH...` thành `com.termux`. Sau đó lưu lại bằng tổ hợp Ctrl + X, Y, Enter.

   ```bash
   [ -z "$RISH_APPLICATION_ID" ] && export RISH_APPLICATION_ID="com.termux"
   ```
4. Cấp quyền thực thi

   ```bash
   chmod +x $HOME/rish
   ```
5. Tạo một alias (tên gọi tắt) cho lệnh `./rish` để có thể gọi lệnh `rish` từ bất cứ đâu:

   ```bash
   nano .bashrc # hoặc .zshrc nếu bạn dùng
   ```

   Thêm vào cuối file

   ```bash
   # rish alias
   alias rish='./rish'
   ```

   Sau đó chạy lệnh `source` để alias có tác dụng:

   ```bash
   source .bashrc # hoặc .zshrc
   ```

   Từ giờ mỗi khi gõ `rish` , Termux sẽ tự hiểu là bạn đang gọi lệnh `./rish

   > Trong một số trường hợp, ví dụ như sử dụng Gemini CLI, bạn vẫn sẽ phải gõ đầy đủ lệnh  `./rish` để lệnh shell chạy đúng.
   >

   Bạn có thể thử gõ:

   ```
   rish
   ```

   Nếu dấu nhắc lệnh thay đổi thành kí tự khác (ví dụ `beyond0:/ $`), thì bạn đã thành công.
   Để thoát ra trở lại dấu nhắc lệnh ban đầu, bạn gõ `exit` rồi Enter.

### Bước 4: Chạy lệnh ADB

Bây giờ bạn đã có thể thực thi các lệnh ADB shell trực tiếp trên điện thoại thông qua Termux. Một số ví dụ bạn có thể thử:

**1. Liệt kê các ứng dụng hệ thống:**

```bash
rish -c "pm list packages -s"
```

**2. Chụp ảnh màn hình và lưu vào máy:**

```bash
rish -c "screencap -p /sdcard/Download/screen.png"
```

**3. Xem thông tin chi tiết về Pin:**

```bash
rish -c "dumpsys battery"
```

**4. Buộc dừng một ứng dụng (Ví dụ Facebook):**

```bash
rish -c "am force-stop com.facebook.katana"
```

**5. Mở một URL trên trình duyệt:**

```bash
rish -c "am start -a android.intent.action.VIEW -d https://www.youtube.com/@hoanggo101"
```

---

**Lưu ý:** Bài viết được viết vào năm 2026. Nếu bạn thấy có thay đổi mới từ các bản cập nhật của Termux hoặc Shizuku, hãy để lại comment phía dưới nhé!
