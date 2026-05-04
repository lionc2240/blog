# Thiết lập Wake on LAN (WOL) từ xa với Tailscale + Termux

Giải pháp hoàn hảo để bật PC ở nhà khi bạn đang đi ngoài đường, tận dụng một thiết bị Android cũ làm "trạm trung chuyển" (relay) bằng Termux.

## Tại sao lại dùng cách này?
- Wake on LAN (WOL) thường chỉ hoạt động trong mạng nội bộ (LAN).
- Để gửi Magic Packet từ Internet về nhà, bạn cần mở port (Port Forwarding), điều này tiềm ẩn rủi ro bảo mật hoặc không khả thi nếu nhà mạng dùng CGNAT.
- **Tailscale** kết nối các thiết bị thành một mạng LAN ảo an toàn.

## Thiết lập

### Trên PC ở nhà (Mục tiêu)
1. Truy cập BIOS/UEFI, bật tính năng **Wake on LAN** (thường nằm ở mục Power Management hoặc PCI-E devices).
2. Vào Windows Device Manager > Network Adapters > Properties của card mạng > Tab Power Management > Tích chọn **Allow this device to wake the computer**.
3. Lưu lại địa chỉ **MAC Address** của card mạng này (Ví dụ: `1A:2B:3C:4D:5E:6F`).

### Trên điện thoại phụ (Trạm trung chuyển)
Điện thoại này luôn để ở nhà và kết nối cùng mạng WiFi với PC.

1. **Cài Tailscale**: Cài ứng dụng Tailscale và đăng nhập vào mạng của bạn.
2. **Cài Termux**: Cài đặt từ F-Droid.
3. Cài đặt công cụ WOL trên Termux:
```bash
pkg install wol
```
> **Chú ý quan trọng**: Lệnh đúng để gọi trên Termux là `wol`, **không phải** `wakeonlan`.

## Cách sử dụng

Khi bạn đang ở ngoài:
1. Bật điện thoại chính, kết nối vào Tailscale.
2. Dùng SSH (ví dụ app JuiceSSH hoặc Termux trên máy chính) SSH vào IP Tailscale của cái **điện thoại phụ ở nhà**.
3. Từ điện thoại phụ, chạy lệnh gửi Magic Packet tới PC:
```bash
wol 1A:2B:3C:4D:5E:6F
```

PC của bạn sẽ tự động bật lên.

---
*Nếu cách setup này bị lỗi thời hoặc không còn hoạt động, vui lòng comment cho mình biết nhé.*
