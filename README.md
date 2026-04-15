# Cloudflare-Pages-Reverse-Proxy-Github
---
## 🛠️ GitHub Proxy Mirror (gh.bibica.net)

Hệ thống Proxy giúp tăng tốc truy cập, gọi API và tải tài nguyên từ GitHub tại Việt Nam.

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
