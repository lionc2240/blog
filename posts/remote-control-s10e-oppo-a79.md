# Điều khiển Android (S10e) từ xa bằng Android (Oppo A79): Giải pháp "Máy trạm bỏ túi" với Termux & Scrcpy

Bạn có một thiết bị Android (Samsung S10e) để cố định tại nhà (cắm sạc 24/7) và một thiết bị Android khác (Oppo A79) thường xuyên mang ra ngoài? Bài viết này sẽ hướng dẫn bạn cách biến thiết bị Android (S10e) thành một máy trạm từ xa, giúp bạn làm việc hoặc xử lý tác vụ ngay trên màn hình thiết bị Android (Oppo) thông qua Internet.

Chúng ta sẽ sử dụng bộ công cụ mạnh mẽ: **Termux**, **Scrcpy**, **Termux-X11** và **Tailscale**.

---

## 1. Chuẩn bị (Mạng LAN ảo)

Để điều khiển qua Internet (4G/Wi-Fi khác mạng), chúng ta cần một "đường ống" bảo mật nối giữa hai máy. **Tailscale** là lựa chọn số 1.

*   **Cài đặt:** Cài Tailscale từ Play Store trên cả thiết bị Android (S10e) và thiết bị Android (Oppo A79).
*   **Thiết lập:** Đăng nhập cùng một tài khoản Gmail trên cả hai máy và nhấn **Connect**.
*   **Ghi nhớ:** Mở app Tailscale trên thiết bị Android (S10e) và chép lại địa chỉ IP (ví dụ: `100.x.y.z`). Đây là địa chỉ để chúng ta tìm thấy máy ở nhà từ bất cứ đâu.

> *Xem thêm: [Cách thiết lập Wake-on-LAN qua Tailscale](post.html?id=wol-tailscale-termux) nếu bạn muốn bật máy tính từ xa.*

---

## 2. Cài đặt trên thiết bị Android (Samsung S10e) - Máy trạm tại nhà

Mục tiêu là mở cổng kết nối ADB vĩnh viễn (port 5555).

1.  Bật **Gỡ lỗi không dây (Wireless Debugging)** trong Tùy chọn nhà phát triển.
2.  Mở **Termux**, cài đặt công cụ: `pkg install android-tools`.
3.  Kết nối với chính nó để kích hoạt cổng:
    ```bash
    adb pair localhost:[Port] [Code]
    adb connect localhost:[Port]
    adb tcpip 5555
    ```
4.  Kiểm tra bằng lệnh `adb devices`, nếu thấy có `localhost:5555` là xong. Bây giờ thiết bị Android (S10e) đã sẵn sàng chờ lệnh từ thiết bị Android (Oppo).

---

## 3. Cài đặt trên thiết bị Android (Oppo A79) - Máy điều khiển

Trên thiết bị Android (Oppo), chúng ta cần môi trường để hiển thị màn hình của thiết bị Android (S10e).

1.  **Cài đặt App:** 
    *   **Termux** (từ F-Droid).
    *   **Termux-X11** (tải file APK universal từ GitHub).
2.  **Cài đặt Gói lệnh:** Mở Termux và chạy:
    ```bash
    pkg update && pkg install x11-repo android-tools scrcpy termux-x11-nightly
    ```
3.  **Tối ưu hệ điều hành:** (Ví dụ ColorOS trên Oppo) Vào cài đặt Pin, chọn **Không tối ưu hóa** cho Termux và Termux-X11 để tránh bị ngắt kết nối giữa chừng.

---

## 4. Thao tác điều khiển từ xa

Mỗi khi bạn ở ngoài và muốn vào thiết bị Android (S10e):

1.  Đảm bảo cả 2 máy đều đã bật **Tailscale**.
2.  Mở app **Termux-X11** trên thiết bị Android (Oppo) (để chạy nền).
3.  Trong **Termux** trên thiết bị Android (Oppo), thực hiện chuỗi lệnh:
    ```bash
    # Kết nối tới IP Tailscale của thiết bị Android (S10e)
    adb connect 100.x.y.z:5555

    # Khởi động server hiển thị
    termux-x11 :0 &
    export DISPLAY=:0

    # Chạy Scrcpy với cấu hình tối ưu cho 4G
    scrcpy --video-bit-rate=2M --max-fps=30 --max-size=1080
    ```

---

## 5. Ví dụ sử dụng

*   **Làm việc:** Mở các ứng dụng ngân hàng, quản lý file hoặc check tin nhắn trên thiết bị Android (S10e) mà không cần mang theo máy.
*   **Chạy Tool:** Sử dụng sức mạnh của thiết bị Android (S10e) để chạy các script Termux nặng mà không làm nóng thiết bị Android (Oppo) đang cầm trên tay.

---

## 6. Cách thoát khỏi màn hình điều khiển

Khi đã xong việc, bạn cần đóng các tiến trình để tiết kiệm pin:

1.  Tại màn hình Termux đang chạy Scrcpy, nhấn **Ctrl + C** để dừng truyền hình ảnh.
2.  Ngắt kết nối ADB: `adb disconnect`.
3.  Đóng server hiển thị: `pkill -f termux-x11`.
4.  Kéo thanh thông báo, chọn **Exit** trên thông báo của Termux để đóng hoàn toàn ứng dụng.

---
*Chúc các bạn thiết lập thành công máy trạm từ xa của riêng mình!*
