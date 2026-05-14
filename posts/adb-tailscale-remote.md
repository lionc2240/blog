# Kết nối ADB từ xa mọi nơi với Tailscale: Điều khiển Android không giới hạn khoảng cách

Bạn muốn dọn dẹp bộ nhớ điện thoại ở nhà khi đang ngồi ở quán cafe? Hoặc cần kiểm tra tình trạng pin của thiết bị từ xa? Kết hợp **ADB** và **Tailscale** là giải pháp hoàn hảo để biến điện thoại của bạn thành một thiết bị có thể điều khiển được từ bất cứ đâu trên thế giới.

## 1. Điều kiện chuẩn bị (Conditions)

Để thực hiện, bạn cần chuẩn bị:
- **Thiết bị Android:** Nên chạy Android 11 trở lên để sử dụng Wireless Debugging ổn định.
- **Mạng Tailscale:** Đã cài đặt và đăng nhập cùng một tài khoản trên cả điện thoại và máy tính.
- **Máy tính:** Đã cài đặt công cụ ADB (Platform Tools).

## 2. Cài đặt và Thiết lập (Installation)

### Bước 1: Thiết lập mạng LAN ảo
1. Cài đặt app **Tailscale** từ Play Store lên điện thoại và bật kết nối.
2. Cài đặt **Tailscale** trên PC và đăng nhập.
3. Mở bảng điều khiển Tailscale trên PC để lấy địa chỉ IP của điện thoại (thường có dạng `100.x.y.z`).

### Bước 2: Cố định cổng ADB (Thực hiện khi có cáp USB)
Android 12 mặc định sẽ thay đổi cổng (port) mỗi lần bật lại Wireless Debugging. Để kết nối ổn định từ xa, bạn nên ép nó về cổng cố định (thường là 5555):
1. Kết nối điện thoại với PC bằng cáp USB.
2. Mở Terminal trên PC và gõ:
   ```bash
   adb tcpip 5555
   ```
3. Bây giờ bạn có thể rút cáp. Cổng 5555 sẽ mở cho đến khi điện thoại khởi động lại.

## 3. Cách thực hiện kết nối từ xa (How to use)

Khi bạn đã ở xa (quán cafe, công ty...), chỉ cần đảm bảo PC và điện thoại đều đang bật Tailscale.

**Lệnh kết nối:**
```powershell
adb connect [IP_Tailscale_của_điện_thoại]:5555
```

**Ví dụ:**
```powershell
adb connect 100.80.90.100:5555
```

Nếu hiện `connected to 100.80.90.100:5555`, bạn đã thành công!

## 4. Ví dụ thực tế (Examples)

Dưới đây là một số lệnh hữu ích khi bạn điều khiển máy từ xa:

- **Kiểm tra phần trăm pin:**
  ```powershell
  adb shell dumpsys battery | grep level
  ```
- **Dọn dẹp cache hệ thống để giải phóng bộ nhớ:**
  ```powershell
  adb shell pm trim-caches 999G
  ```
- **Chụp ảnh màn hình để xem máy đang hiện gì:**
  ```powershell
  adb shell screencap -p /sdcard/view.png
  adb pull /sdcard/view.png C:\Users\Admin\Desktop\
  ```

## 5. Mẹo và Lưu ý quan trọng (Tips)

- **Đừng dùng lệnh `reboot`:** Tuyệt đối không khởi động lại máy từ xa. Khi máy khởi động lại, cổng 5555 sẽ đóng và bạn sẽ mất kết nối cho đến khi có cáp USB để kích hoạt lại lệnh `tcpip 5555`.
- **Sử dụng Scrcpy:** Nếu mạng ổn định, bạn có thể dùng `scrcpy` để điều khiển màn hình trực quan. Hãy giảm bitrate để mượt hơn:
  ```bash
  scrcpy -s 100.x.y.z:5555 --video-bit-rate 1M --max-fps 15
  ```
- **Tiết kiệm pin:** Wireless Debugging và Tailscale sẽ tiêu tốn pin hơn bình thường. Hãy đảm bảo thiết bị ở nhà luôn được cắm sạc hoặc bật chế độ tiết kiệm pin.

---
*Hy vọng thủ thuật này giúp bạn quản lý các thiết bị Android của mình linh hoạt hơn! Nếu có thắc mắc, đừng quên để lại bình luận nhé.*
