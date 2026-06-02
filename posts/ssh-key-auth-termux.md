SSH (Secure Shell) là công cụ không thể thiếu cho anh em hay "work-on-the-way". Thay vì gõ mật khẩu loằng ngoằng trên màn hình điện thoại bé xíu, việc sử dụng SSH Key giúp bạn kết nối chỉ bằng một lệnh duy nhất, nhanh chóng và cực kỳ bảo mật.

> 💡 **Nguyên tắc dễ nhớ:** Máy nào điều khiển thì tạo key ở máy đó rồi ném sang máy được điều khiển (tại máy được điều khiển, key của máy điều khiển sẽ được lưu tại `~/.ssh/authorized_keys`).

Dưới đây là cách thiết lập theo chuẩn hiện đại để Android kết nối và điều khiển Windows hoặc Android khác không cần mật khẩu.

## 1. Chuẩn bị trên Termux

Đầu tiên, hãy đảm bảo bạn đã cài đặt `openssh` trên cả thiết bị điều khiển (Client) và thiết bị nhận lệnh (Server):

```bash
pkg update && pkg upgrade
pkg install openssh
```

## 2. Tạo SSH Key hiện đại (Trên máy điều khiển - Client)

Nếu bạn dùng điện thoại để điều khiển máy khác, hãy tạo khóa trên chính điện thoại đó. 
Thay vì thuật toán RSA cũ, chuẩn hiện đại khuyến nghị sử dụng **Ed25519** vì độ bảo mật cao hơn, tốc độ xử lý nhanh hơn và độ dài khóa ngắn hơn:

```bash
ssh-keygen -t ed25519
```

Nhấn **Enter** liên tục để bỏ qua mật khẩu khóa (passphrase) để thiết lập chế độ đăng nhập "1-click". 
Lúc này, file khóa công khai của bạn sẽ nằm tại `~/.ssh/id_ed25519.pub`.

## 3. Chép Public Key sang máy bị điều khiển (Host/Server)

### A. Phương pháp hiện đại và nhanh nhất: Dùng `ssh-copy-id`
Nếu máy bị điều khiển hỗ trợ SSH (như Android chạy Termux hoặc hệ điều hành Linux), bạn có thể dùng công cụ tự động sao chép và phân quyền khóa chỉ bằng 1 câu lệnh:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p [cổng_ssh] [username]@[ip_địa_chỉ]
```

**Ví dụ thực tế giữa 2 thiết bị Android (Termux mặc định cổng 8022):**
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 8022 u0_a933@100.86.113.93
```
*Nhập mật khẩu của thiết bị remote một lần duy nhất khi được hỏi. Lệnh sẽ tự động cấu hình và phân quyền an toàn cho file `authorized_keys` trên máy nhận.*

### B. Sao chép thủ công (Cho các trường hợp đặc biệt)

#### Trường hợp kết nối từ Android sang Windows:
1. Xem nội dung khóa công khai trên điện thoại để copy:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Gửi đoạn text bắt đầu bằng `ssh-ed25519 ...` sang máy tính Windows.
3. Trên máy tính Windows, dán đoạn mã đó vào cuối file:
   `C:\Users\Tên_User\.ssh\authorized_keys`

#### Trường hợp kết nối từ Windows (PowerShell) sang Android (Termux):

Nếu bạn đang dùng máy tính Windows và muốn SSH vào điện thoại Android không cần mật khẩu, hãy thực hiện các bước sau trên **PowerShell**:

1. **Tạo SSH Key trên Windows (nếu chưa có):**
   Chạy lệnh sau trên PowerShell:
   ```powershell
   ssh-keygen -t ed25519
   ```
   *Nhấn **Enter** liên tục để bỏ qua passphrase.*

2. **Chép Public Key sang Termux:**
   Bạn có thể chọn một trong hai cách sau:

   * **Cách 1: Tự động gửi bằng lệnh (Khuyên dùng)**
     Chạy lệnh sau trên PowerShell (thay thế `[username]` và `[ip_địa_chỉ]` bằng thông tin Termux của bạn):
     ```powershell
     Get-Content $HOME\.ssh\id_ed25519.pub | ssh [username]@[ip_địa_chỉ] -p 8022 "cat >> ~/.ssh/authorized_keys"
     ```
     *Nhập mật khẩu SSH của Termux khi được yêu cầu.*

   * **Cách 2: Sao chép thủ công**
     - Trên PowerShell (Windows), xem nội dung key để sao chép:
       ```powershell
       Get-Content $HOME\.ssh\id_ed25519.pub
       ```
       *(Copy toàn bộ dòng text bắt đầu bằng `ssh-ed25519 ...`)*
     - SSH đăng nhập vào Termux trên điện thoại:
       ```powershell
       ssh [username]@[ip_địa_chỉ] -p 8022
       ```
     - Chạy lệnh sau trên Termux để thêm khóa (thay `NỘI_DUNG_KEY_VỪA_COPY` bằng đoạn text bạn vừa copy):
       ```bash
       echo "NỘI_DUNG_KEY_VỪA_COPY" >> ~/.ssh/authorized_keys
       ```

3. **Phân quyền trên Termux:**
   Để đảm bảo OpenSSH chấp nhận khóa, hãy chạy các lệnh sau trên Termux của điện thoại:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

#### Trường hợp thiết bị nhận không hỗ trợ `ssh-copy-id`:
Nếu vì lý do gì đó không dùng được `ssh-copy-id` giữa hai thiết bị Android, bạn có thể copy nội dung key thủ công và chạy lệnh sau trên Termux của máy nhận:
```bash
mkdir -p ~/.ssh
echo "NỘI_DUNG_KEY_VỪA_COPY" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## 4. Kết nối

Giờ đây, từ điện thoại của bạn, chỉ cần gõ lệnh kết nối trực tiếp:

```bash
ssh [username]@[ip_địa_chỉ] -p [cổng_ssh]
```

Ví dụ:
```bash
ssh u0_a933@100.86.113.93 -p 8022
```

### Mẹo nhỏ nâng cao:
- **Rút gọn lệnh với Alias:** Thêm alias vào file `~/.zshrc` hoặc `~/.bashrc` để đăng nhập siêu nhanh:
  ```bash
  alias ssh-vivo="ssh -p 8022 u0_a933@100.86.113.93"
  ```
  Sau khi cấu hình, bạn chỉ cần gõ `ssh-vivo` là tự động đăng nhập.
- **Sử dụng Windows Terminal:** Nếu ngồi trước máy tính, hãy cấu hình SSH profile trong **Windows Terminal** để mở nhanh tab kết nối tới điện thoại.

Chúc các bạn làm việc hiệu quả và quản lý thiết bị mượt mà!
