# Khaosok River Hills Resort – website (phase 1)

Static bilingual (English / ไทย) site. No server, no online payment – bookings are **requests** via email (mailto) or LINE.

**Build:** `node build.js` → output in `dist/` (Node 18+, no dependencies).
**Preview:** `cd dist && python3 -m http.server 8080` then open http://localhost:8080
**Cloudflare Pages:** Build command `node build.js`, Build output directory `dist`.

⚠ Room prices are still sample figures. Tour and listed transfer prices, plus WhatsApp numbers, are from the resort’s current list. Edit `content/settings.json` and each `info.json`.

---
## English – how to manage photos and items (no coding needed)

Every room type, tour and transfer is one folder:
```
content/rooms/01-river-view-deluxe/info.json   ← text & price (EN + TH)
content/rooms/01-river-view-deluxe/photos/     ← put photos here
content/tours/...      content/transfers/...
content/settings.json  ← phone, LINE ID, LINE link, email
```
- **Add photos:** copy .jpg / .png / .webp files into the item's `photos` folder. They are shown in file-name order (name them `1.jpg`, `2.jpg`… to control order; the first is the main photo).
- **Replace a photo:** delete the old file, add the new one.
- **Remove a photo:** delete the file. Delete the sample `1-placeholder.svg` once you add real photos.
- **Add a new room/tour/transfer:** copy an existing folder, rename it (e.g. `03-garden-room`), edit `info.json`, put photos in `photos/`.
- **Hide an item:** add `"hidden": true` in its `info.json`, or delete the folder.
- `"order"` controls the display order. Keep both `"en"` and `"th"` text.
- After changes, commit/upload to GitHub – Cloudflare Pages rebuilds automatically.
- If the build fails, a JSON file has a typo (missing comma or quote); the error message names the file.

---
## ภาษาไทย – วิธีจัดการรูปภาพและข้อมูล (ไม่ต้องแก้โค้ด)

ห้องพัก ทัวร์ และรถรับส่ง แต่ละรายการคือ 1 โฟลเดอร์:
- `info.json` = ชื่อ คำอธิบาย ราคา (มีทั้ง "en" ภาษาอังกฤษ และ "th" ภาษาไทย)
- โฟลเดอร์ `photos` = รูปภาพของรายการนั้น
- `content/settings.json` = เบอร์โทร ไลน์ไอดี ลิงก์ไลน์ อีเมล

**เพิ่มรูป:** คัดลอกไฟล์ .jpg / .png / .webp ไปไว้ในโฟลเดอร์ `photos` ของรายการนั้น รูปจะเรียงตามชื่อไฟล์ (ตั้งชื่อ `1.jpg`, `2.jpg` … รูปแรกคือรูปหลัก)
**เปลี่ยนรูป:** ลบไฟล์เก่า แล้วใส่ไฟล์ใหม่
**ลบรูป:** ลบไฟล์ออก (เมื่อมีรูปจริงแล้ว ให้ลบไฟล์ตัวอย่าง `1-placeholder.svg`)
**เพิ่มห้อง/ทัวร์/รถรับส่งใหม่:** คัดลอกโฟลเดอร์เดิม เปลี่ยนชื่อ (เช่น `03-garden-room`) แก้ไข `info.json` แล้วใส่รูปใน `photos`
**ซ่อนรายการ:** ใส่ `"hidden": true` ใน `info.json` หรือลบโฟลเดอร์ทิ้ง
`"order"` คือลำดับการแสดงผล กรุณาใส่ข้อความทั้ง "en" และ "th"
เมื่อแก้ไขเสร็จ อัปโหลดขึ้น GitHub แล้ว Cloudflare Pages จะสร้างเว็บใหม่ให้อัตโนมัติ
ถ้าสร้างเว็บไม่สำเร็จ แปลว่าไฟล์ JSON พิมพ์ผิด (เช่น ลืมเครื่องหมาย , หรือ ") ข้อความแจ้งเตือนจะบอกชื่อไฟล์

⚠ ราคา เบอร์โทร ไลน์ไอดี และอีเมลทั้งหมดเป็น **ข้อมูลตัวอย่าง** กรุณาแก้ไขเป็นข้อมูลจริง
