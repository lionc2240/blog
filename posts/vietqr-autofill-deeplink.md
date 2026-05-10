# Tích hợp Thanh toán 1-Click: Tự động điền thông tin với VietQR DeepLink

Bạn đang phát triển ứng dụng Android và muốn tối ưu quy trình thanh toán? Thay vì để người dùng phải nhập tay số tài khoản, số tiền và nội dung (dễ sai sót), hãy sử dụng **VietQR DeepLink** để mở app ngân hàng và tự động điền (Auto-fill) mọi thứ chỉ với 1 cú click.

## 1. Mục tiêu (Objective)

Khi người dùng nhấn nút "Thanh toán":
- Tự động mở App Ngân hàng (BIDV, ACB, OCB...).
- **Tự động điền (Auto-fill)**: Số tài khoản, Số tiền, Nội dung chuyển khoản.
- Người dùng chỉ cần xác thực (Vân tay/FaceID) là xong.

## 2. Cấu trúc URL DeepLink bắt buộc

Để tính năng Auto-fill hoạt động ổn định, bạn cần tuân thủ cấu trúc URL sau thông qua gateway của `dl.vietqr.io`.

> [!IMPORTANT]
> **Tham số sống còn:** Bạn **BẮT BUỘC** phải thêm `&url=https://payos.vn` vào cuối URL. Đây là "flag" kỹ thuật để các App ngân hàng hiểu đây là giao dịch thanh toán đơn hàng và kích hoạt giao diện điền sẵn thông tin.

**Cấu trúc mẫu:**
```text
https://dl.vietqr.io/pay?app=<mã_app>&ba=<stk>@<mã_nh>&am=<số_tiền>&tn=<nội_dung>&bn=<tên_người_nhận>&url=https://payos.vn
```

### Giải thích tham số:
- **`app`**: Mã app muốn mở (ví dụ: `bidv`, `icb`, `acb`, `ocb`).
- **`ba`**: Thông tin thụ hưởng theo cú pháp `Số_tài_khoản@Mã_ngân_hàng`.
- **`am`**: Số tiền (định dạng số nguyên).
- **`tn`**: Nội dung chuyển khoản (Phải URL Encode).
- **`url`**: Luôn để `https://payos.vn`.

## 3. Danh sách ngân hàng hỗ trợ Auto-fill

Hiện tại, tính năng **tự động điền dữ liệu** qua DeepLink chỉ hỗ trợ tốt nhất trên 4 ngân hàng sau:

1. **BIDV** (Mã: `bidv`)
2. **VietinBank** (Mã: `icb`)
3. **OCB** (Mã: `ocb`)
4. **ACB** (Mã: `acb`)

*Lưu ý: Các ngân hàng khác (VCB, MB, Techcombank...) có thể chỉ mở App đến màn hình chính hoặc màn hình đăng nhập mà không điền sẵn thông tin.*

## 4. Ví dụ thực tế (Examples)

Dưới đây là một số ví dụ thực tế đã được kiểm nghiệm trên app BIDV:

- **Mở app + Auto-fill toàn bộ:**
  `https://dl.vietqr.io/pay?app=bidv&ba=0915118319@tcb&am=5000&tn=ChuyenKhoanDonHang&url=https://payos.vn`
- **Chỉ Auto-fill thông tin thụ hưởng:**
  `https://dl.vietqr.io/pay?app=bidv&ba=0915118319@tcb&url=https://payos.vn`

## 5. Triển khai trên Android (Implementation)

Sử dụng `Intent` để thực thi việc mở DeepLink:

```kotlin
fun openPaymentApp(url: String, context: Context) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    } catch (e: ActivityNotFoundException) {
        // Fallback: Mở trình duyệt hoặc thông báo cài App
        Toast.makeText(context, "Vui lòng cài đặt ứng dụng ngân hàng", Toast.LENGTH_SHORT).show()
    }
}
```

---
**Nguồn tham khảo:**
- [VietQR Changelog](https://www.vietqr.io/changelog/)
- [VietQR DeepLink Documentation](https://www.vietqr.io/danh-sach-api/deeplink-app-ngan-hang/)

*Hy vọng bài viết này giúp bạn tích hợp thanh toán nhanh chóng và chuyên nghiệp hơn!*
