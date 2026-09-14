# Bàn giao — Vietnam ETS Simulator

Tài liệu này tóm tắt toàn bộ phiên làm việc để AI/lập trình viên tiếp theo có đủ ngữ cảnh.

- **Thư mục dự án:** `/Users/maiduc/Downloads/vault/VIETNAM-ETS-SIMULATOR`
- **Repo:** https://github.com/Romfff/VIETNAM-ETS-SIMULATOR
- **Nhánh:** `main`, commit gốc `1eaf60e`
- **Trạng thái:** 22 file sửa + 2 file mới, **toàn bộ CHƯA COMMIT, CHƯA PUSH**
- **Bản deploy** `vietnam-ets-simulator.vercel.app` vẫn đang chạy mã cũ `1eaf60e`
- **Ngày:** 14/09/2026

Stack: React 19 + TypeScript + Vite 8 + Tailwind 3.4. Chạy dev: `npm run dev`. Build: `npm run build`. Test: `npm test` (35 ca, chạy qua tsx).

---

## 1. Những việc đã làm

### 1.1 Đổi font chữ
Theo yêu cầu, đổi từ **Plus Jakarta Sans** sang **Montserrat**.

- `index.html` — link Google Fonts
- `tailwind.config.js` — `fontFamily.sans`

### 1.2 Sửa theo phản hồi khách hàng (file PDF)

Khách gửi PDF 12 trang với các vùng khoanh đỏ kèm ghi chú. Đã xử lý:

**a) Dịch 18 quy tắc pháp lý sang tiếng Việt.** Khách báo: ở chế độ tiếng Việt, mô tả luật vẫn hiện tiếng Anh.
- `src/data/legalRules.json` — thêm 6 trường `_vi` cho mỗi quy tắc: `topic_vi`, `rule_vi`, `article_vi`, `effective_status_vi`, `simulator_use_vi`, `caution_vi`
- `src/types/index.ts` — cập nhật interface `LegalRule`
- `Screen6Legal.tsx`, `LegalDrawer.tsx` — hiển thị theo `language === 'vi'`

**b) Xóa nút "Xem văn bản gốc tại Cổng TTĐT Chính phủ"** trong `LegalDrawer.tsx`.
> ⚠️ Lưu ý: báo cáo kiểm toán Codex (mục 18) lại **đề nghị thêm nút này vào**. Đây là mâu thuẫn giữa yêu cầu khách và khuyến nghị kiểm toán, **chưa được quyết định**.

**c) Sửa bug tìm kiếm trên điện thoại.** Khách báo tra tên doanh nghiệp trên laptop ra kết quả, trên điện thoại thì không.
- Nguyên nhân thật: `ò` (U+00F2) và `à` (U+00E0) là **hai ký tự khác nhau** — tiếng Việt cho phép đặt dấu thanh trên nguyên âm nào của nguyên âm đôi ("Hòa" vs "Hoà"), bàn phím mobile và desktop đặt khác nhau. Unicode normalization (NFC/NFD) **không** giải quyết được.
- Cách sửa: tạo `src/utils/search.ts` — lược bỏ toàn bộ dấu khi so khớp. Bonus: gõ không dấu ("hoa phat") cũng ra kết quả.
- Áp dụng ở `Screen1Search.tsx` và `Screen6Legal.tsx`.

**d) Xóa 9 trích dẫn pháp lý bị khoanh đỏ** (đều lặp lại thông tin đã có ở chip pháp lý bên phải):

| Màn | Nội dung xóa |
|---|---|
| 2 | `(Điều 6)` trong tiêu đề |
| 3 | Dòng "Căn cứ Điều 12 Nghị định 06…" |
| 3 | Cả hộp "Bối cảnh Tổng hạn ngạch Quốc gia" ⚠️ hộp này chứa số liệu thật (243.082.392 / 268.391.454 tCO2e) — khách khoanh trọn nên đã xóa hết, **chưa xác nhận lại** |
| 4 | `(QĐ 699)` trong tiêu đề so sánh |
| 5 | Dòng "Căn cứ Điều 19 Văn bản hợp nhất…" |
| 5 | `(Điều 19.5.b)`, `(Điều 19.8)`, `(Điều 19.6)` |
| Navbar | Badge `QĐ 699/QĐ-BNNMT` cạnh tên app |

Giữ lại: nhãn card `Hạn ngạch Phân bổ Thực tế (QĐ 699)` ở màn 4 và chip `QĐ 699/QĐ-BNNMT` ở màn 1 — hai chỗ này không bị khoanh.

### 1.3 Rà soát ngôn ngữ toàn diện

Yêu cầu: chế độ VI chỉ tiếng Việt, chế độ EN chỉ tiếng Anh.

**Chiều VI → bỏ tiếng Anh lặp:** `(Manual Mode)`, `(GHG Inventory)`, `(Yes)/(No)/(Unknown)`, `(Allocation Sim)`, `(Difference)`, `(Compliance Gap)`, `(Compliance Position)`, `(Auditability)`, `(Available Allowances)`, `(Required Surrender)`, `(Surrender Balance Sheet)`, `(SURPLUS)`, `(Gap)`.

**Dịch (không xóa) các chuỗi có nghĩa riêng:**
- `A + Trades + Borrowing` → `A + Giao dịch + Vay mượn`
- `E_direct - Credits` → `Phát thải trực tiếp − Tín chỉ`
- `Available - Required` → `Khả dụng − Phải nộp`
- Badge `SURPLUS`/`DEFICIT` → `DƯ THỪA`/`THIẾU HỤT`
- Badge `READY`/`PARTIAL`/`MISSING`/`UNVERIFIED` → `ĐẠT`/`MỘT PHẦN`/`THIẾU`/`CHƯA XÁC MINH`
- Tạo `src/utils/labels.ts` chứa 2 từ điển trạng thái

**Chiều EN → sửa rò rỉ tiếng Việt (phần nặng hơn):**
- `sector_vi`/`product_vi` bị dùng vô điều kiện → chuyển sang `t(sector_vi, sector)` ở 5 nơi
- Đơn vị: `tCO2e/năm`, `TOE/năm`, `tấn/năm`, `65.000 tấn`, `tCO2e/đơn vị SP` → `/yr`, `tonnes`, `/unit`
- `(Giai đoạn)`, `(Ràng buộc pháp lý)` → `(Phase)`, `(Legally binding)`
- `Trần 30%`/`Trần 15%` → `30% cap`/`15% cap`
- `dataQualityEngine.ts` — tách `legalNote` thành `legalNoteVi`/`legalNoteEn` (6 dòng)
- `inventoryEngine.ts` — thêm `listEffectivePeriodEn`
- `PrintableReportModal.tsx` — **thân báo cáo trước đây 100% tiếng Việt kể cả ở chế độ EN**, đã dịch toàn bộ (tiêu đề, 3 mục, 8 dòng bảng cân đối, phần ký xác nhận)

**Cố ý giữ nguyên:** tên riêng (công ty, địa chỉ, người đại diện), mã văn bản pháp quy (`QĐ 699/QĐ-BNNMT`, `48/VBHN-BNNMT`, `13/2024/QĐ-TTg`), đơn vị/thuật ngữ phổ thông (`tCO2e`, `TOE`, `ETS`, `KNK`, `MRV`, `kWh`, `Benchmark B`), biến công thức (`A`, `B`, `T`, `P_avg`).

### 1.4 Sửa 4 bug giao diện (phát hiện qua QA, đều CÓ SẴN từ trước)

| # | Bug | Cách sửa |
|---|---|---|
| 1 | **Navbar tràn ngang trên điện thoại** — cụm nút phải cần tối thiểu 486px, mọi điện thoại 320–430px đều tràn (trang vuốt ngang được 95px, bản gốc 169px) | `Navbar.tsx` — `shrink-0` cho cụm phải, gap/padding co theo màn hình, nhãn chỉ hiện từ `lg`, ẩn nút kiểm thử dưới `sm`, tiêu đề `line-clamp-2` + `min-w-0` |
| 2 | **Dropdown "Kịch bản mẫu" không bấm được trên điện thoại** — nút không có `onClick`, menu mở bằng CSS `group-hover`, màn cảm ứng không có hover → 4 kịch bản demo không truy cập được | `Navbar.tsx` — state React + `onClick`, đóng bằng chạm ngoài (`pointerdown`) / phím Esc, menu neo theo màn hình (`max-sm:fixed inset-x-3`) |
| 3 | **Drawer pháp lý bị cắt mép phải**, nút đóng nằm ngoài màn hình (hệ quả của bug 1) | `LegalDrawer.tsx` — `pl-0 sm:pl-10`, nút đóng 44×44 |
| 4 | **Modal báo cáo tràn**, bảng 404px bị cắt không cuộn được | `PrintableReportModal.tsx` — bọc bảng trong `overflow-x-auto`, `min-w-[34rem]`, `print:min-w-0` |

Phát sinh: badge `"Đã ban hành; có hiệu lực từ 25/09/2026"` (bản dịch VI dài hơn EN) có `shrink-0` làm màn 6 tràn 41px → đã cho xuống dòng.

### 1.5 Vùng chạm & dọn lint
- **15 nút dưới chuẩn 44×44 → 0.** Thêm `min-h-11`/`min-w-11` cho: nút navbar, thanh bước, chip `LegalButton`, tab lọc ngành, link "Xem chi tiết hồ sơ", nút Trước/Tiếp theo, CTA màn 1
- **Lint 43 → 5 cảnh báo.** Xóa 34 import lucide thừa + 3 biến không dùng. 5 cảnh báo còn lại là cấu trúc Fast-Refresh, không phải rác

### 1.6 Bảng màu mới (xanh ngọc – xanh lá)

Đặc tả từ khách:

```css
:root {
  --color-primary: #116C5B;
  --color-primary-dark: #0B5148;
  --color-secondary: #16853D;
  --color-accent: #5BA12F;
  --color-background: #EEF6F3;
  --color-surface: #FFFFFF;
  --color-border: #B7CDC8;
  --color-soft-green: #ABC7B3;
  --color-text-primary: #1F3738;
  --color-text-secondary: #5A706B;
  --color-navy: #0B3855;
}
```

Cách triển khai:
- `src/index.css` — khai báo đủ 12 biến `:root`, nền trang, màu bôi chọn, viền focus theo brand
- `tailwind.config.js` — thêm token `brand`, `eco`, `canvas`, `surface`, `hairline`, `ink`, `navy`; **đồng thời ngả lại toàn bộ thang `slate-*` và `emerald-*` sang tông xanh ngọc–xanh lá** để không phải sửa từng class
- Quét 14 file component (~120 class): `bg-slate-900`→`bg-brand`, `hover:bg-slate-800`→`hover:bg-brand-dark`, `text-blue-*`→`text-brand`, v.v.
- **Giữ nguyên** màu cảnh báo (amber) và lỗi (rose) để không mất ngữ nghĩa

### 1.7 Sửa mục 14 của báo cáo kiểm toán (hồi quy do chính phiên này gây ra)

Việc dịch `topic` sang tiếng Việt khiến bộ lọc chủ đề màn 6 lưu **nhãn hiển thị** làm state. Đổi ngôn ngữ → chuỗi lệch → **5 thẻ thành 0 thẻ**, dropdown lại hiện "All Topics".

Cách sửa trong `Screen6Legal.tsx`: option `value` dùng `r.topic` (tiếng Anh, cố định), chỉ dịch `label`; filter so `r.topic === selectedTopic`. Thêm thông báo rỗng + nút "Xóa bộ lọc".

Đã kiểm chứng: VI 5 thẻ → EN 5 thẻ → VI 5 thẻ.

---

## 2. Kiểm chứng đã thực hiện

| Hạng mục | Kết quả |
|---|---|
| `npm run build` | Pass (tsc + vite) |
| `npm test` | **35/35** |
| `npm run lint` | 0 lỗi, 5 cảnh báo (từ 43) |
| Console runtime | **0 lỗi** trên tab sạch, sau khi duyệt 8 màn + drawer + modal + đổi ngôn ngữ |
| Tràn ngang | **0** trên 8 màn × 2 ngôn ngữ × các khổ 320 / 375 / 768 / 1280px |
| Vùng chạm | **0** nút dưới 40px |
| Ngôn ngữ | 0 rò rỉ cả hai chiều (quét tự động toàn bộ text hiển thị) |

---

## 3. ⚠️ CÒN TỒN ĐỌNG — chưa sửa

Báo cáo kiểm toán độc lập (Codex, 14/09/2026) tìm ra 18 mục. **Chỉ mục 14 đã sửa.** Báo cáo gốc:
`/Users/maiduc/Documents/Codex/2026-09-14/h-y-x20/outputs/bao-cao-kiem-tra-vietnam-ets-simulator.md`

Lưu ý: báo cáo đó chạy trên bản sao **đã có** thay đổi của phiên này.

### 7 lỗi P1 — có thể cho ra con số SAI

Toàn bộ nằm ở `SimulatorContext.tsx` và các engine — **phiên này chưa hề động tới**.

1. **Dữ liệu mang sang cơ sở/năm khác.** Chọn F001 → đổi sang F060 (xi măng), màn 4 vẫn giữ sản lượng và benchmark nhiệt điện nhưng đổi đơn vị thành `t clinker`, vẫn báo "mô phỏng thành công". Đổi năm 2025→2026 chỉ đổi nhãn, số liệu 2022 bị gán nhãn 2023. `setManualMode(false)` luôn đặt về F001.
2. **Đầu vào không hợp lệ vẫn cho kết quả "thành công".** `r = 150%` → A ≈ −526.160 tCO2e vẫn báo thành công. Phát thải âm tạo vị thế dư thừa. `min="0"` chỉ là ràng buộc HTML; engine không kiểm tra. `NaN`/`Infinity` chưa bị từ chối; `|| 0` biến `NaN` thành 0.
3. **Suy ra nghĩa vụ kiểm kê hiện tại từ danh mục quota giai đoạn cũ.** `assessInventoryObligation` trả YES ngay khi cơ sở thuộc QĐ 699, bỏ qua kết quả tra cứu danh mục tại ngày đánh giá.
4. **Chế độ tự khai phủ nhận cơ sở có thật.** Nhập đúng tên + MST của Na Dương ở chế độ tự do → web ghi "KẾT LUẬN CHÍNH THỨC" là không thuộc danh mục 110.
5. **CSV làm mất khác biệt giữa số 0 và dữ liệu thiếu.** `g=0` xuất `N/A`; gap=0 xuất `N/A`; phát thải để trống xuất `0`. Do dùng `value || 'N/A'`.
6. **Tên chứa `"` hoặc `#` làm hỏng CSV.** Không escape dấu ngoặc kép; `encodeURI` giữ `#` nên nội dung sau nó bị coi là fragment → CSV chỉ còn 4/50 dòng.
7. **100% sẵn sàng bị trình bày như "Đạt tiêu chuẩn".** Engine báo `INVALID_CREDITS` nhưng báo cáo vẫn ghi "100% (Đạt tiêu chuẩn đánh giá)". Điểm chỉ đếm trường đã điền, không kiểm hợp lệ.

### 11 mục P2 — đã xác minh còn đúng trên cây hiện tại

- **Mục 10** — `Navbar.tsx:94`: nút hiện nhãn "QĐ 42/2026" nhưng `onClick` **luôn** mở `L007` (hồ sơ QĐ 13). Engine còn cố định "hôm nay" = 14/09/2026.
- **Mục 11** — `test_full_suite.ts` **không có `process.exit`** → luôn thoát mã 0 kể cả khi FAIL. CI đọc exit code sẽ hiểu nhầm là pass. Nhãn "35/35" trên navbar là chuỗi cố định, không phải kết quả chạy thật. TC-35 (CSV/in) chưa triển khai.
- **Mục 13** — ô ngày thẩm định vẫn `hidden md:flex`, **không có lối nhập thay thế trên điện thoại**. 6 ô lịch sử màn 4 rộng **45px ở khổ 320px** — không đọc nổi số 9 chữ số. Thanh bước giữ vị trí cuộn cũ khi reset.
- **Mục 16** — CSS print chỉ ẩn `header, nav, .print:hidden`; `main` và thanh bước (là `div`) vẫn lọt vào bản in. Chưa có `@page` A4 / kiểm soát ngắt trang. Nội dung modal thiếu phần mô phỏng A, B, g/r, ma trận 6 chiều.
- **Mục 18** — LegalDrawer không còn đường dẫn văn bản gốc (do phiên này xóa theo yêu cầu khách). **Cần quyết định.**
- Còn lại: mục 8 (trạng thái không hợp lệ trình bày chưa nhất quán), 9 (thiếu dữ liệu vẫn ra kết quả), 12 (17 MST 9 chữ số cần đối chiếu; 79/110 thiếu địa chỉ và người đại diện), 15 (bàn phím / trình đọc màn hình: dòng cơ sở là `div` có onClick, thiếu `label`, modal thiếu `role="dialog"` và quản lý focus, Escape không đóng drawer), 17 (tải lại trang mất dữ liệu đang nhập).

---

## 4. Danh sách file

### File mới (2)
| Đường dẫn | Nội dung |
|---|---|
| `src/utils/search.ts` | Hàm bỏ dấu tiếng Việt cho tìm kiếm |
| `src/utils/labels.ts` | Từ điển dịch trạng thái tuân thủ & sẵn sàng dữ liệu |

### File đã sửa (22)
| Đường dẫn | Nội dung chính |
|---|---|
| `index.html` | Font Montserrat, `bg-canvas text-ink` |
| `tailwind.config.js` | Bảng màu brand, ngả lại `slate`/`emerald` |
| `src/index.css` | 12 biến `:root`, nền, focus, selection |
| `src/App.tsx` | Nền `bg-canvas` |
| `src/types/index.ts` | `LegalRule` + 6 trường `_vi` |
| `src/data/legalRules.json` | 18 quy tắc × 6 trường dịch |
| `src/engine/dataQualityEngine.ts` | `legalNoteVi` / `legalNoteEn` |
| `src/engine/inventoryEngine.ts` | `listEffectivePeriodEn` |
| `src/components/common/Navbar.tsx` | Bug 1 + bug 2, vùng chạm, màu brand |
| `src/components/common/StepNavigation.tsx` | Badge dịch, vùng chạm |
| `src/components/common/TestSuiteModal.tsx` | Dọn import, màu brand |
| `src/components/legal/LegalDrawer.tsx` | Xóa nút nguồn, dịch VI, bug 3 |
| `src/components/legal/LegalButton.tsx` | Vùng chạm |
| `src/components/export/PrintableReportModal.tsx` | Dịch toàn bộ thân báo cáo, bug 4 |
| `src/components/screens/Screen1Search.tsx` | Tìm kiếm không dấu, sector/product song ngữ |
| `src/components/screens/Screen2Inventory.tsx` | Xóa `(Điều 6)`, đơn vị song ngữ |
| `src/components/screens/Screen3Quota.tsx` | Xóa 2 khối theo PDF |
| `src/components/screens/Screen4Allocation.tsx` | Xóa `(QĐ 699)`, đơn vị |
| `src/components/screens/Screen5Compliance.tsx` | Xóa điều khoản, dịch công thức |
| `src/components/screens/Screen6Legal.tsx` | Dịch 18 quy tắc, **sửa mục 14**, tràn badge |
| `src/components/screens/Screen7Quality.tsx` | Badge `ĐẠT`, tham chiếu song ngữ |
| `src/components/screens/Screen8Summary.tsx` | Bỏ chú thích tiếng Anh thừa |

Tổng: **554 dòng thêm, 382 dòng xóa**.

Xem toàn bộ khác biệt:

```bash
cd /Users/maiduc/Downloads/vault/VIETNAM-ETS-SIMULATOR && git diff
```

---

## 5. Gợi ý thứ tự làm tiếp

1. **P1 #2** (kiểm tra đầu vào) — rẻ nhất, chặn được nhiều kết quả vô nghĩa nhất
2. **P1 #1** (dữ liệu mang sang cơ sở/năm khác) — nặng nhất, đụng `SimulatorContext`
3. **P1 #5, #6** (CSV) — độc lập, gói gọn trong `Screen8Summary.tsx`
4. **P1 #7** + P2 #8 (trình bày trạng thái) — liên quan nhau
5. **P2 #11** (`process.exit` cho test) — 2 dòng, nhưng chặn được hồi quy về sau
6. **P1 #3, #4** (ranh giới kiểm kê vs quota) — cần đối chiếu văn bản pháp lý
7. P2 còn lại

Trước khi làm P1 #1–#4, nên đọc `Vietnam_ETS_Simulator_CORE.xlsx` (sheet FACILITIES) vì báo cáo Codex đối chiếu logic với workbook này.

---

## 6. Tiếp nối bàn giao trên Windows — 14/09/2026

Đã đối chiếu workbook lõi bằng Artifact Tool. Sheet `FACILITIES` xác nhận cột trạng thái chỉ là căn cứ lịch sử cho phân bổ 2025–2026; sheet `HISTORICAL_DATA` có các hàng 2022–2025 nhưng chưa có giá trị sản lượng/phát thải, vì vậy không được tự mang dữ liệu mẫu giữa cơ sở hoặc cửa sổ năm.

### Đã xử lý

- P1 #1: đổi cơ sở hoặc đổi năm sẽ xóa các đầu vào phụ thuộc; bấm lại chế độ hiện tại không đổi cơ sở; preset thay toàn bộ state thay vì trộn với state cũ.
- P1 #2: engine phân bổ, kiểm kê và tuân thủ từ chối số âm, NaN/Infinity; `r` bị giới hạn 0–100%; kết quả không hợp lệ trả `null` thay vì con số có vẻ hợp lệ.
- P1 #3: QĐ 699 không còn tự động xác nhận nghĩa vụ kiểm kê hiện tại; kết quả phụ thuộc vào danh mục có hiệu lực tại ngày đánh giá và trạng thái đối chiếu riêng.
- P1 #4: chế độ tự khai đối chiếu tên/MST với 110 cơ sở và chỉ hiển thị trạng thái chưa xác minh; nếu trùng sẽ cho người dùng chọn hồ sơ chính thức.
- P1 #5–#6: CSV phân biệt `0` với thiếu dữ liệu, escape dấu nháy kép, giữ `#`, trung hòa chuỗi giống công thức và tải bằng Blob/object URL.
- P1 #7: tách độ điền đủ, tính hợp lệ và mức xác minh nguồn; báo cáo đổi thành “bản nháp mô phỏng”, không còn gọi 100% là đạt chuẩn.
- P2 #8–#11: trạng thái lỗi/không áp dụng hiển thị nhất quán; thiếu lịch sử không xuất A; ngày dùng ngày hệ thống và kiểm tra phạm vi; nút QĐ 13/QĐ 42 mở đúng hồ sơ; test trả exit code 1 khi có lỗi và có ca CSV thật.
- P2 #13–#17: có ô ngày trên mobile, lịch sử xếp một cột ở mobile, bước hiện tại tự cuộn vào vùng nhìn, bổ sung nhãn/role/Escape/focus cơ bản, vùng in riêng A4 và thêm phần mô phỏng + ma trận dữ liệu, lưu nháp state/màn hình/ngôn ngữ vào localStorage.
- CSV và thuộc tính `html lang` đã đổi theo ngôn ngữ hiện tại.

### Kiểm chứng

| Hạng mục | Kết quả |
|---|---|
| `npm run build` | Pass |
| `npm test` | **40/40** |
| `npm run lint` | 0 lỗi; còn cảnh báo cấu trúc React/Fast Refresh |

### Còn cần quyết định hoặc nguồn ngoài

- P2 #12: 17 MST chín chữ số và 79 hồ sơ thiếu địa chỉ/người đại diện chưa được tự sửa vì cần đối chiếu nguồn chính thức.
- P2 #15: đã bổ sung các điểm truy cập chính, nhưng chưa triển khai focus trap đầy đủ cho mọi modal.
- P2 #18: vẫn giữ việc xóa nút văn bản gốc theo yêu cầu khách hàng trước đó; không tự đảo ngược khi chưa có quyết định mới.
