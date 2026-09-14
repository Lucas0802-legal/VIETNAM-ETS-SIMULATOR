# BẢNG ĐẶC TẢ TEST CASE CHUẨN DOANH NGHIỆP — VIETNAM ETS SIMULATOR
**Dự án:** Vietnam ETS Simulator Web Prototype  
**Mục tiêu:** Kiểm toán toàn diện 8 màn hình, động cơ tính toán toán học, các ranh giới pháp lý (guardrails) và bộ dữ liệu 110 cơ sở Quyết định 699/QĐ-BNNMT.  
**Tỷ lệ Pass:** 35 / 35 Test Cases (100%)  
**Lệnh chạy tự động qua Terminal:** `npm test`  
**Chạy trực tiếp trên giao diện web:** Bấm nút **🧪 Kiểm thử (35/35)** tại thanh điều hướng trên cùng.

---

## I. MA TRẬN 35 TEST CASES CHI TIẾT

| Mã TC | Phân hệ / Màn hình | Tên Kịch bản Thẩm định | Dữ liệu Đầu vào (Inputs) | Kết quả Kỳ vọng (Expected) | Căn cứ Pháp lý / Excel Logic | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Data Layer | Toàn vẹn danh mục QĐ 699 | File dữ liệu cơ sở | Đủ đúng 110 cơ sở phát thải chính thức | Quyết định 699/QĐ-BNNMT, Điều 1 & Phụ lục | ✅ PASS |
| **TC-02** | Data Layer | Phân loại 3 ngành kinh tế | Sector tagging | 34 Nhiệt điện, 25 Thép, 51 Xi măng | QĐ 263/QĐ-TTg & QĐ 699 | ✅ PASS |
| **TC-03A**| Data Layer | Đối soát Tổng hạn ngạch 2025 | $\sum A_{2025}$ của 110 cơ sở | 243,082,392 $\text{tCO}_2\text{e}$ | Quyết định 263/QĐ-TTg, Điều 1 | ✅ PASS |
| **TC-03B**| Data Layer | Đối soát Tổng hạn ngạch 2026 | $\sum A_{2026}$ của 110 cơ sở | 268,391,454 $\text{tCO}_2\text{e}$ | Quyết định 263/QĐ-TTg, Điều 1 | ✅ PASS |
| **TC-04** | Legal Layer | Toàn vẹn 18 Quy tắc pháp lý | Legal Rule Register (L001–L018) | Đầy đủ 18 quy tắc có link nguồn Chinhphu.vn và Điều khoản | VBHN 48/VBHN-BNNMT & các Quyết định | ✅ PASS |
| **TC-05** | Legal Layer | Bảng phạm vi quản lý | Regulatory Scope (INV, LIST, ETS, COMP) | Đủ 14 quy tắc điều phối logic hệ thống | Bảng REGULATORY_SCOPE từ Excel | ✅ PASS |
| **TC-06** | Screen 1: Search | Nhận diện cơ sở F001 | ID = `F001` | Tên: Cty Nhiệt điện Na Dương; MST: `0104297034-001` | QĐ 699/QĐ-BNNMT STT 1 | ✅ PASS |
| **TC-07** | Screen 1: Search | Nhận diện cơ sở F060 | ID = `F060` | Tên: Xi măng X18; Ngành: Cement; Hạn ngạch 2025: 109,943 $\text{tCO}_2\text{e}$ | QĐ 699/QĐ-BNNMT STT 60 | ✅ PASS |
| **TC-08** | Screen 1: Search | Nhận diện cơ sở F035 | ID = `F035` | Tên: Luyện kim Việt Trung; Ngành: Iron & steel (Thép thô) | QĐ 699/QĐ-BNNMT STT 35 | ✅ PASS |
| **TC-09** | Screen 2: Inventory | Tự động xác lập kiểm kê cho QĐ 699 | Cơ sở thuộc QĐ 699 | Trạng thái: `YES` (Cơ sở nằm trong danh mục căn cứ) | VBHN 48 Điều 6 & QĐ 699 | ✅ PASS |
| **TC-10** | Screen 2: Inventory | Ngày thẩm định trước 25/09/2026 | Ngày: `2026-09-13` | Danh mục áp dụng: `Quyết định 13/2024/QĐ-TTg` | QĐ 13/2024/QĐ-TTg | ✅ PASS |
| **TC-11** | Screen 2: Inventory | Ngày thẩm định từ 25/09/2026 | Ngày: `2026-09-26` | Danh mục áp dụng: `Quyết định 42/2026/QĐ-TTg` | QĐ 42/2026/QĐ-TTg, Điều 3 | ✅ PASS |
| **TC-12** | Screen 2: Inventory | Ngưỡng phát thải chung Điều 6 | Phát thải $\ge 3,000\text{ tCO}_2\text{e}$ | Trạng thái: `MEETS_CRITERIA` | VBHN 48/VBHN-BNNMT, Điều 6(1) | ✅ PASS |
| **TC-13** | Screen 2: Inventory | Ngưỡng năng lượng Vận tải | Tiêu thụ $\ge 1,000\text{ TOE}$ (Freight transport) | Trạng thái: `MEETS_CRITERIA` | VBHN 48/VBHN-BNNMT, Điều 6(1)(b) | ✅ PASS |
| **TC-14** | Screen 2: Inventory | Ngưỡng công suất Chất thải rắn | Công suất $\ge 65,000\text{ tấn/năm}$ | Trạng thái: `MEETS_CRITERIA` | VBHN 48/VBHN-BNNMT, Điều 6(1)(d) | ✅ PASS |
| **TC-15** | Screen 2: Inventory | **Ranh giới:** Thiếu số liệu ngưỡng | Bỏ trống số liệu, chưa tra cứu danh mục | Trạng thái: `UNDETERMINED` (Tuyệt đối không đoán mò) | Nguyên tắc cấm suy đoán pháp lý | ✅ PASS |
| **TC-16** | Screen 3: Quota Scope | **Ranh giới:** Kiểm kê $\ne$ Hạn ngạch ETS | Đạt tiêu chí kiểm kê nhưng ngoài QĐ 699 | Có nghĩa vụ kiểm kê nhưng KHÔNG tự suy ra có hạn ngạch | Spec trang 2, 7: Inventory $\ne$ Quota | ✅ PASS |
| **TC-17** | Screen 3: Quota Scope | Khớp hạn ngạch chính thức F001 | F001 | 2025: 1,035,566; 2026: 1,134,493 $\text{tCO}_2\text{e}$ | Quyết định 699/QĐ-BNNMT | ✅ PASS |
| **TC-18** | Screen 4: Allocation | Tính Sản lượng bình quân $\bar{P}$ | $P = [600M, 660M, 690M]$ | $\bar{P} = 650,000,000$ đơn vị sản phẩm | Phụ lục I Phương pháp 01 | ✅ PASS |
| **TC-19** | Screen 4: Allocation | Tính Phát thải bình quân $\bar{E}$ | $E = [900K, 930K, 960K]$ | $\bar{E} = 930,000\text{ tCO}_2\text{e}$ | Phụ lục I Phương pháp 01 | ✅ PASS |
| **TC-20** | Screen 4: Allocation | **Ranh giới:** Thiếu tham số chính sách $g/r$ | Bỏ trống $g$ hoặc $r$ | Dừng tính, trạng thái: `MISSING_GR`, $A = \text{null}$ (CẤM mặc định = 0%) | Spec trang 4 mục 4.4 | ✅ PASS |
| **TC-21** | Screen 4: Allocation | Tính Hệ số điều chỉnh $T$ | $g = 3.5\%, r = 2.0\%$ | $T = (1+0.035)\times(1-0.02) = 1.0143$ | Phụ lục I Phương pháp 01 | ✅ PASS |
| **TC-22** | Screen 4: Allocation | Tính Hạn ngạch mô phỏng $A$ | $\bar{P}, B, T$ đầy đủ | $A = \bar{P} \times B \times T$ $(\text{tCO}_2\text{e})$ | Công thức lõi Phương pháp 01 | ✅ PASS |
| **TC-23** | Screen 4: Allocation | So sánh $A$ tính toán với QĐ 699 | $A$ và $A_{\text{official}}$ | Tính ra Độ lệch (Difference) và Tỷ lệ lệch (%) | Spec trang 5: Validation vs Official | ✅ PASS |
| **TC-24** | Screen 5: Compliance | Tính Nghĩa vụ nộp bù (Required Surrender) | $E_{\text{direct}} = 2.0M$, Tín chỉ $= 50K$ | $\text{Required} = 2.0M - 50K = 1,950,000\text{ tCO}_2\text{e}$ | VBHN 48 Điều 19(5)(a) | ✅ PASS |
| **TC-25** | Screen 5: Compliance | Xác định Vị thế Dư thừa (SURPLUS) | Khả dụng $>$ Nghĩa vụ nộp bù | Trạng thái: `SURPLUS` ($+220,059\text{ tCO}_2\text{e}$), bắn Confetti | Spec trang 5-6 | ✅ PASS |
| **TC-26** | Screen 5: Compliance | Xác định Vị thế Thâm hụt (DEFICIT) | Khả dụng $<$ Nghĩa vụ nộp bù | Trạng thái: `DEFICIT` ($-229,941\text{ tCO}_2\text{e}$), cảnh báo đỏ | Spec trang 5-6 | ✅ PASS |
| **TC-27** | Screen 5: Compliance | Tính đúng Trần tín chỉ carbon 30% | Hạn ngạch giai đoạn $= 2,170,059$ | Trần 30% $= 651,017.7\text{ tCO}_2\text{e}$ | VBHN 48 Điều 19(8) | ✅ PASS |
| **TC-28** | Screen 5: Compliance | **Validation:** Vượt trần 30% tín chỉ | Nhập tín chỉ $= 700,000$ ($> 651K$) | Trạng thái: `INVALID_CREDITS`, hiển thị thanh đo đỏ | Spec trang 6 mục 7 | ✅ PASS |
| **TC-29** | Screen 5: Compliance | **Validation:** Vượt trần 15% vay mượn | Nhập vay mượn $= 400,000$ ($> 325.5K$) | Trạng thái: `INVALID_BORROWING`, hiển thị thanh đo đỏ | Spec trang 6 mục 7 & Điều 19.6 | ✅ PASS |
| **TC-30** | Screen 5: Compliance | Xác nhận Hạn nộp bù hạn ngạch | Chu kỳ 2025–2026 | Hạn nộp: `31/12/2027` (Trước 31/12 năm sau chu kỳ) | VBHN 48 Điều 19(5)(b) | ✅ PASS |
| **TC-31** | Screen 7: Data Quality | Kiểm toán 6 chiều chất lượng dữ liệu | Toàn bộ các trường trong State | Đánh giá đủ 6 chiều: Danh tính, Kiểm kê, Lịch sử, B, g/r, Phát thải | Spec trang 8: Screen 7 | ✅ PASS |
| **TC-32** | Screen 7: Data Quality | Tính Điểm sẵn sàng dữ liệu (%) | Đầy đủ 6/6 trường | Điểm sẵn sàng $= 100\%$ | Động cơ DataQualityEngine | ✅ PASS |
| **TC-33** | Screen 7: Data Quality | Minh bạch thiếu sót thay vì báo Error | Khuyết sản lượng lịch sử, khuyết B | Chỉ rõ thiếu sản lượng 3 năm & chưa có benchmark ngành | Spec trang 8: Nói rõ thiếu cái gì | ✅ PASS |
| **TC-34** | Presets | Nạp 4 Kịch bản mẫu demo | Kịch bản 1, 2, 3, 4 | Nạp chính xác dữ liệu Nhiệt điện, Thép, Xi măng, Cơ sở tự do | 4 Presets demo cuộc thi | ✅ PASS |
| **TC-35** | Screen 8: Summary | Cấu trúc Báo cáo xuất file CSV & In | Bấm Xuất CSV / In PDF | Xuất đầy đủ 5 phân hệ dữ liệu, chuẩn in A4 không lỗi CSS | Spec trang 8 & 11 | ✅ PASS |

---

## II. HƯỚNG DẪN THỰC THI KIỂM THỬ

### 1. Chạy tự động qua Terminal (Dành cho Developer & Technical Reviewers)
Chỉ cần mở terminal tại thư mục dự án và chạy:
```bash
npm test
```
Toàn bộ 35 test cases sẽ được thực thi và in ra bảng tổng kết xanh `[PASS]` trong vòng 1-2 giây.

### 2. Chạy tương tác trên Giao diện Web (Dành cho Giám khảo & Người dùng)
1. Mở website tại: `http://localhost:5173`
2. Tại thanh Menu trên cùng (Navbar), nhấp vào nút **🧪 Kiểm thử (35/35)**.
3. Modal kiểm thử tự động sẽ xuất hiện, chạy toàn bộ 35 kịch bản và hiển thị:
   - Tỷ lệ thành công: **35/35 PASS (100%)**
   - Phân loại theo từng phân hệ: Data Layer, Search, Inventory, Quota, Allocation, Compliance, Data Quality, Presets.
   - Thanh tìm kiếm và bộ lọc nhanh theo từng nhóm kiểm thử.
   - Kỳ vọng (Expected) so sánh với Thực tế (Actual) và Căn cứ pháp lý trích dẫn.
