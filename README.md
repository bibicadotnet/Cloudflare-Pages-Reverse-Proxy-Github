# GitHub Proxy Mirror (gh.bibica.net)
Proxy ngược tốc độ cao cho GitHub — giải quyết tình trạng tải chậm tại Việt Nam. Chỉ cần thay domain, link hoạt động y hệt bản gốc.

## 🛠️ Hướng dẫn cài đặt

Bạn có thể tự triển khai một bản proxy cá nhân tương tự trên hạ tầng Cloudflare Pages hoàn toàn miễn phí.

### 1. Fork Repository
Trước tiên, bạn cần đưa mã nguồn về tài khoản cá nhân của mình:
* Nhấn nút **Fork** ở góc trên bên phải hoặc sử dụng link nhanh: [Fork dự án tại đây](https://github.com/bibicadotnet/Cloudflare-Pages-Reverse-Proxy-Github/fork).

### 2. Triển khai lên Cloudflare Pages
Sau khi đã Fork xong, hãy thực hiện các bước sau để đưa lên môi trường serverless:

1. Truy cập vào trang quản trị Cloudflare: **Workers & Pages** > **Pages** > **Create application** > **Connect to Git**. *[Link truy cập nhanh](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github)*
2. Chọn Repository bạn vừa mới Fork về.
3. Tại phần **Build Settings**: Giữ nguyên mọi thông số **mặc định** (không cần điền hay chỉnh sửa bất kỳ dòng nào).
4. Nhấn **Save and Deploy**.

Sau khi deploy thành công, Cloudflare sẽ cấp cho bạn một domain `.pages.dev`.

Bạn có thể sử dụng ngay hoặc trỏ Custom Domain (như `gh.bibica.net`) trong phần cấu hình của Pages.

---

### 📋 Bảng Mapping Domain

| Domain gốc (GitHub) | Proxy Domain (Thay thế) | Mục đích sử dụng | Loại |
| :--- | :--- | :--- | :--- |
| `github.com` | `gh.bibica.net` | Duyệt web, tải releases | **Main** |
| `api.github.com` | `gh.bibica.net/_api` | REST API, check version | **API** |
| `raw.githubusercontent.com` | `gh.bibica.net/_raw` | Truy cập file nội dung Raw | **Raw** |
| `release-assets.githubusercontent.com` | `gh.bibica.net/_release-assets` | File release CDN (Auto redirect) | **CDN** |
| `objects.githubusercontent.com` | `gh.bibica.net/_objects` | Git objects, blobs | **Git** |
| `codeload.github.com` | `gh.bibica.net/_codeload` | Tải Source code (Zip/Tar.gz) | **Zip** |
| `avatars.githubusercontent.com` | `gh.bibica.net/_avatars` | Ảnh đại diện người dùng | **Media** |

---

### 💡 Ví dụ thực tế

#### 1. Tải file Release
* **Gốc:** `https://github.com/AdguardTeam/dnsproxy/releases/download/v0.81.1/dnsproxy-windows-amd64-v0.81.1.zip`
* **Proxy:** `https://gh.bibica.net/AdguardTeam/dnsproxy/releases/download/v0.81.1/dnsproxy-windows-amd64-v0.81.1.zip`

#### 2. Gọi GitHub API
* **Gốc:** `https://api.github.com/repos/AdguardTeam/dnsproxy/releases/latest`
* **Proxy:** `https://gh.bibica.net/_api/repos/AdguardTeam/dnsproxy/releases/latest`

#### 3. Truy cập Raw file
* **Gốc:** `https://raw.githubusercontent.com/bol-van/zapret-win-bundle/master/zapret-winws/winws.exe`
* **Proxy:** `https://gh.bibica.net/_raw/bol-van/zapret-win-bundle/master/zapret-winws/winws.exe`

---

### 💻 Sử dụng trong Script

#### PowerShell
```powershell
# Khai báo proxy ở đầu script
$GH_PROXY  = "[https://gh.bibica.net](https://gh.bibica.net)"
$API_PROXY = "[https://gh.bibica.net/_api](https://gh.bibica.net/_api)"
$RAW_PROXY = "[https://gh.bibica.net/_raw](https://gh.bibica.net/_raw)"

# Gọi API lấy version mới nhất
$release = Invoke-RestMethod "$API_PROXY/repos/AdguardTeam/dnsproxy/releases/latest"

# Rewrite URL download về proxy
$url = $release.assets[0].browser_download_url -replace 'https://github\.com', $GH_PROXY

# Download raw file
Invoke-WebRequest -Uri "$RAW_PROXY/user/repo/master/file.exe" -OutFile "file.exe"
```

#### Curl / Wget
```bash
# Thay github.com → gh.bibica.net
curl -L [https://gh.bibica.net/user/repo/releases/download/v1.0/file.zip](https://gh.bibica.net/user/repo/releases/download/v1.0/file.zip) -o file.zip

# Tải Raw file
wget [https://gh.bibica.net/_raw/user/repo/main/install.sh](https://gh.bibica.net/_raw/user/repo/main/install.sh) -O install.sh

# Gọi API
curl [https://gh.bibica.net/_api/repos/user/repo/releases/latest](https://gh.bibica.net/_api/repos/user/repo/releases/latest)
```

---

### ⚠️ Lưu ý quan trọng
* **Phạm vi:** Proxy này chỉ dành cho mục đích **tải file và gọi API công khai**. Không hỗ trợ đăng nhập, OAuth hoặc các tính năng yêu cầu Session/Cookie của GitHub.
* **Tự động hóa:** Các lệnh Redirect giữa các subdomain (như `release-assets.githubusercontent.com`) được hệ thống xử lý tự động, người dùng chỉ cần thay đúng cấu trúc domain ở bảng trên.
