SSH (Secure Shell) là công cụ không thể thiếu cho anh em hay "work-on-the-way". Thay vì gõ mật khẩu loằng ngoằng trên màn hình điện thoại bé xíu, việc sử dụng SSH Key giúp bạn kết nối chỉ bằng một lệnh duy nhất, nhanh chóng và cực kỳ bảo mật.

Dưới đây là cách thiết lập nhanh để Android điều khiển Windows hoặc Android khác.

## 1. Chuẩn bị trên Termux

Đầu tiên, hãy đảm bảo bạn đã cài đặt `openssh`:

```bash
pkg update && pkg upgrade
pkg install openssh
```

## 2. Tạo SSH Key (Trên máy điều khiển - Client)

Nếu bạn dùng điện thoại để điều khiển máy khác, hãy tạo khóa trên chính điện thoại đó:

```bash
ssh-keygen -t rsa -b 4096
```

Nhấn **Enter** liên tục để bỏ qua mật khẩu (passphrase) nếu bạn muốn đăng nhập "1-click". File khóa sẽ nằm tại `~/.ssh/id_rsa.pub`.

## 3. Chép Public Key sang máy bị điều khiển (Host/Server)

Bạn cần đưa nội dung của file `id_rsa.pub` vào file `authorized_keys` trên máy đích.

### A. Android sang Android
Trên máy điều khiển, copy nội dung key:
```bash
cat ~/.ssh/id_rsa.pub
```
Copy đoạn mã bắt đầu bằng `ssh-rsa ...` và gửi sang máy bị điều khiển. Trên máy bị điều khiển (trong Termux), chạy:

```bash
mkdir -p ~/.ssh
echo "NỘI_DUNG_KEY_VỪA_COPY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### B. Android sang Windows
Nếu bạn muốn dùng điện thoại điều khiển Windows (qua OpenSSH Server), hãy copy nội dung key vào file:
`C:\Users\Tên_User\.ssh\authorized_keys`

## 4. Kết nối

Giờ đây, từ điện thoại, bạn chỉ cần gõ:

```bash
ssh user@ip_address -p port
```

*Lưu ý: Với Termux, port mặc định là `8022`. Với Windows, port mặc định là `22`.*

### Mẹo nhỏ:
Để kết nối nhanh hơn nữa, hãy tạo alias trong `.bashrc` hoặc `.zshrc`:
```bash
alias win='ssh user@192.168.1.x'
```
Chỉ cần gõ `win` là xong. Chúc các bạn làm việc hiệu quả ngay cả khi đang di chuyển!
