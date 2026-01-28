# Vũng Tàu Landing Page

Landing page giới thiệu Vũng Tàu và Admin Dashboard để quản lý địa điểm.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Lucide React** (Icons)

## Setup

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Cấu trúc dự án

```
├── app/
│   ├── admin/           # Admin dashboard
│   │   ├── login/       # Trang đăng nhập
│   │   ├── places/      # Quản lý địa điểm
│   │   └── layout.tsx   # Layout admin với sidebar
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/
│   ├── admin/           # Components cho admin
│   │   └── PlaceModal.tsx
│   ├── About.tsx
│   ├── Categories.tsx
│   ├── FeaturedPlaces.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── WhyVisit.tsx
└── lib/
    └── data.ts          # Data management (localStorage)
```

## Tính năng

### Landing Page
- Hero section với background image
- Giới thiệu về Vũng Tàu
- Danh mục địa điểm (Ăn uống, Hẹn hò, Check-in, Du lịch)
- Danh sách địa điểm nổi bật
- Lý do nên đến Vũng Tàu
- Footer với social links

### Admin Dashboard
- **Đăng nhập**: admin / admin123 (mock authentication)
- **Tổng quan**: Thống kê số lượng địa điểm
- **Quản lý địa điểm**: CRUD đầy đủ
  - Thêm địa điểm mới
  - Sửa địa điểm
  - Xóa địa điểm
  - Xem danh sách dạng bảng

## Data Storage

Dữ liệu được lưu trong `localStorage` của trình duyệt. Key: `vungtau_places`

## Deploy

Project sẵn sàng deploy lên Vercel:

```bash
npm run build
```

Sau đó push code lên GitHub và connect với Vercel.

## Notes

- Authentication là mock (chỉ check username/password trong code)
- Images sử dụng Unsplash placeholders, có thể thay bằng ảnh thật
- Google Maps URLs là placeholder, cần thay bằng links thật
