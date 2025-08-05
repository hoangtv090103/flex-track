# FlexTrack - Fitness Tracker App

FlexTrack là một ứng dụng theo dõi tập luyện thể dục hiệu quả được thiết kế theo phong cách mobile-first để ghi lại chi tiết các buổi tập của bạn.

## ✨ Tính năng chính

- **📝 Ghi lại buổi tập**: Thêm bài tập với số set, số rep và mức tạ một cách dễ dàng
- **📊 Lịch sử tập luyện**: Xem lại tất cả các buổi tập đã hoàn thành
- **📈 Biểu đồ tiến độ**: Theo dõi sự phát triển qua biểu đồ hiệu suất chi tiết
- **📉 Thống kê tổng quan**: Xem các số liệu thống kê và thành tựu cá nhân
- **🎯 UI/UX tối ưu**: Thiết kế thuận tiện cho việc ghi lại dữ liệu nhanh chóng

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Charts**: Chart.js + React Chart.js 2

## 🎨 Thiết kế

- **Màu sắc**: Bảng màu xanh dương và xám chuyên nghiệp
- **Responsive**: Mobile-first design, tối ưu cho điện thoại
- **Performance**: Hiệu suất cao, phù hợp cho vận động viên sử dụng thường xuyên

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- Node.js 18.17.0 hoặc mới hơn
- npm hoặc yarn

### Cài đặt

1. Clone repository
```bash
git clone <repository-url>
cd flex-track
```

2. Cài đặt dependencies
```bash
npm install
```

3. Chạy ứng dụng development
```bash
npm run dev
```

4. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

### Cấu hình Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Cập nhật thông tin cấu hình trong `src/lib/firebase.ts`
3. Thiết lập Firestore Database
4. Cấu hình Security Rules

## 📱 Tính năng chi tiết

### 1. Trang chủ (Dashboard)
- Hiển thị thời gian thực
- Thống kê nhanh: tổng buổi tập, buổi tập tuần này, tạ nâng cao nhất
- Menu điều hướng nhanh
- Hoạt động gần đây

### 2. Ghi lại Workout
- Timer theo dõi thời gian tập
- Thêm/xóa bài tập linh hoạt
- Quản lý set với reps và weight
- Đánh dấu set hoàn thành
- Lưu workout với timestamp

### 3. Lịch sử Workout
- Danh sách tất cả workout đã thực hiện
- Lọc theo thời gian (tuần/tháng)
- Hiển thị chi tiết: số bài tập, tổng set, total volume
- Thông tin thời gian và ghi chú

### 4. Biểu đồ Tiến độ
- Chọn bài tập cụ thể để theo dõi
- Lọc theo khung thời gian
- Biểu đồ trọng lượng tiến triển
- Thống kê hiện tại và mục tiêu
- Theo dõi xu hướng phát triển

### 5. Thống kê Tổng quan
- Tổng quan toàn diện về hiệu suất
- Hoạt động hàng tuần (heatmap)
- Thành tựu và streak
- Top bài tập yêu thích
- Các chỉ số hiệu suất chi tiết

## 🔧 Cấu trúc Project

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Trang chủ
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── workout/
│   │   ├── new/           # Trang tạo workout mới
│   │   └── history/       # Lịch sử workout
│   ├── progress/          # Biểu đồ tiến độ
│   └── stats/             # Thống kê
├── components/            # Reusable components
├── lib/                   # Utilities & configs
│   └── firebase.ts        # Firebase configuration
├── services/              # API services
│   └── workoutService.ts  # Workout CRUD operations
└── types/                 # TypeScript type definitions
    └── index.ts           # App-wide types
```

## 📈 Roadmap

### Phase 1 (Hoàn thành) ✅
- [x] Thiết kế UI/UX cơ bản
- [x] Tính năng ghi lại workout
- [x] Lịch sử workout
- [x] Biểu đồ tiến độ cơ bản
- [x] Thống kê tổng quan

### Phase 2 (Kế hoạch)
- [ ] Tích hợp Firebase Authentication
- [ ] Đồng bộ dữ liệu thời gian thực
- [ ] Backup & restore dữ liệu
- [ ] Tối ưu performance
- [ ] PWA support

### Phase 3 (Tương lai)
- [ ] Chia sẻ workout với bạn bè
- [ ] Template workout có sẵn
- [ ] Thông báo nhắc nhở
- [ ] Export dữ liệu
- [ ] Dark mode

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem `LICENSE` file để biết thêm chi tiết.

## 📞 Liên hệ

- Email: support@flextrack.app
- Website: https://flextrack.app

---

**FlexTrack** - Theo dõi tiến độ, đạt được mục tiêu! 💪
