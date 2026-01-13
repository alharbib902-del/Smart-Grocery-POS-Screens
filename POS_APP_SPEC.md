# 🛒 POS App - Implementation Specification v2.0
## مواصفات التنفيذ التفصيلية (معتمدة)

> **Version:** 2.0.0 | **Date:** 2026-01-13 | **Status:** ✅ Approved with Critical Updates

---

# 📋 جدول المحتويات

1. [القرارات المعتمدة](#القرارات-المعتمدة)
2. [قائمة الشاشات](#قائمة-الشاشات)
3. [User Stories & Acceptance Criteria](#user-stories)
4. [Sprint Planning](#sprint-planning)
5. [Database Schema](#database-schema)
6. [Roles & Permissions](#roles-permissions)

---

# ✅ القرارات المعتمدة

| القرار | التفاصيل |
|--------|----------|
| خصم المخزون | حجز عند Accept + خصم فعلي عند Delivered |
| الفوائد | بسيطة شهرية + إقفال شهري + تخصيص لكل عميل + periodKey لمنع التكرار |
| الديون | حركات مبسطة: INVOICE(+), PAYMENT(-), INTEREST(+), WAIVE(-) |
| السداد من التطبيق | جزئي/كلي عبر بوابة دفع |
| التقارير | فصل القنوات POS / APP |
| State Management | Riverpod (Providers) + ChangeNotifier ViewModels (per DEVELOPER_STANDARDS) |
| Local DB | SQLite (Drift) |
| Sync | Sync Queue من Sprint 1 + Auth/API في Sprint 2 |
| Returns | إلغاء فاتورة = حركة عكسية (VOIDED) بدون حذف |

> **ملاحظة State Management:** Riverpod يُستخدم فقط كـ composition root لإدارة الـ DI و lifecycle.
> جميع الـ ViewModels تبقى `ChangeNotifier` كما في DEVELOPER_STANDARDS (§7).

---

# 📱 قائمة الشاشات النهائية

## Phase 0: الأساس التقني
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| - | Setup + Architecture + Sync Skeleton | P0 |

## Phase 1: POS الأساسي
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| شاشة البيع | `/pos` | P0 |
| اختيار طريقة الدفع | `/pos/payment` | P0 |
| الفاتورة/إتمام | `/pos/receipt` | P0 |
| اختيار عميل (Drawer) | `/pos` (drawer) | P1 |
| **إعدادات الطابعة** ★ | `/settings/printer` | P1 |

## Phase 2: المنتجات والمخزون
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| قائمة المنتجات | `/products` | P0 |
| تفاصيل/تعديل منتج | `/products/:id` | P0 |
| إضافة منتج | `/products/add` | P0 |
| المخزون | `/inventory` | P1 |
| تعديل المخزون | `/inventory/adjust` | P1 |

## Phase 3: المشتريات + AI
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| قائمة الموردين | `/suppliers` | P1 |
| إضافة مورد | `/suppliers/add` | P1 |
| فاتورة مشتريات جديدة | `/purchases/add` | P1 |
| استيراد فاتورة (AI) | `/purchases/import` | P2 |
| مراجعة الفاتورة المستوردة | `/purchases/review` | P2 |

## Phase 4: الديون والفوائد
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| قائمة العملاء | `/customers` | P1 |
| حساب العميل | `/customers/:id/account` | P1 |
| تسجيل دفعة | `/customers/:id/payment` | P1 |
| إعدادات الفوائد | `/settings/interest` | P2 |
| إقفال الشهر | `/debts/close-month` | P2 |

## Phase 5: الطلبات (App Integration)
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| قائمة الطلبات | `/orders` | P1 |
| تفاصيل الطلب | `/orders/:id` | P1 |

## Phase 6: التقارير
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| لوحة التحكم | `/dashboard` | P1 |
| تقرير المبيعات | `/reports/sales` | P1 |
| تقرير الديون | `/reports/debts` | P2 |
| تقرير المخزون | `/reports/inventory` | P2 |

## Phase 7: الميزات المتقدمة ★ جديد
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| تقرير الضريبة (VAT) | `/reports/vat` | P0 |
| قائمة المناديب | `/drivers` | P1 |
| تفاصيل/إضافة مندوب | `/drivers/:id` | P1 |
| الطلب الذكي من المورد | `/purchases/smart-order` | P1 |
| إعدادات WhatsApp | `/settings/whatsapp` | P2 |
| العروض الذكية | `/promotions` | P2 |
| نقاط الولاء | `/loyalty` | P3 |
| إعدادات ZATCA | `/settings/zatca` | P0 |

## Phase 7B: الإعدادات والعمليات ★ جديد
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| الإعدادات العامة | `/settings/general` | P0 |
| بيانات المتجر | `/settings/store` | P0 |
| أجهزة الدفع | `/settings/payment-devices` | P1 |
| تعليق الفاتورة | `/pos/hold` | P1 |
| المرتجعات | `/pos/returns` | P1 |
| الوردية والصندوق | `/cash-drawer` | P1 |
| صلاحية المنتجات | `/inventory/expiry` | P2 |

## Phase 8: ميزات مستقبلية
| الشاشة | المسار | الأولوية |
|--------|--------|----------|
| إدارة المستخدمين | `/settings/users` | P2 |
| النسخ الاحتياطي | `/settings/backup` | P3 |
| المصروفات | `/expenses` | P2 |
| جرد المخزون | `/inventory/count` | P2 |
| تقرير أداء الكاشير | `/reports/cashier` | P3 |

---

# 📝 User Stories & Acceptance Criteria

## US-1.6: إتمام البيع والطباعة (محدث)
**ككاشير**، أريد إتمام البيع وطباعة الفاتورة

**Acceptance Criteria:**
- [ ] حفظ البيع مع:
  - `receiptNo` رقم فاتورة مقروء
  - `channel` = "POS"
  - `cashierId`
  - `paymentMethod`
  - `status` = COMPLETED
  - `customerId` / `sourceOrderId` (إن وجد)
- [ ] خصم المخزون مع `channel` = POS
- [ ] إذا آجل: إنشاء Transaction (+)
- [ ] طباعة الفاتورة (Thermal 80mm)
- [ ] زر "إعادة طباعة آخر فاتورة"
- [ ] **زر "إلغاء فاتورة"** (للمدير فقط) → status=VOIDED + حركة عكسية

---

## US-1.7: إعدادات الطابعة ★ جديد
**كمدير**، أريد ضبط إعدادات الطابعة

**Acceptance Criteria:**
- [ ] اختيار نوع الطابعة (Thermal USB / Bluetooth / PDF)
- [ ] زر "اختبار طباعة"
- [ ] Toggle: طباعة تلقائية بعد إتمام البيع
- [ ] اختيار القالب (مختصر / تفصيلي)
- [ ] حفظ الإعدادات محلياً

---

## US-3.3: استيراد فاتورة بالـ AI (محدث)
**كمدير**، أريد تصوير الفاتورة واستيرادها تلقائياً

**Acceptance Criteria:**
- [ ] التقاط/رفع صورة
- [ ] **حفظ الصورة مع الفاتورة** (محلياً + سيرفر)
- [ ] تحسين الصورة (قص/ميلان)
- [ ] إرسال للـ AI Backend
- [ ] شاشة مراجعة:
  - سطور: `rawName` (الاسم الأصلي) + `matchedProductId`
  - Confidence indicator لكل سطر
  - **سطور منخفضة الثقة (<70%) يجب تأكيدها يدوياً**
  - مطابقة تلقائية (اقتراح ذكي)
  - خيار "إنشاء منتج جديد"
- [ ] بعد المراجعة: زيادة المخزون + إنشاء دين إن لم يُدفع

---

## US-5.2: تفاصيل الطلب (محدث - منطق الحجز)
**ككاشير**، أريد عرض تفاصيل الطلب وتحديث حالته

**Acceptance Criteria:**
- [ ] عرض: العميل، العناصر، الإجمالي، طريقة الدفع، العنوان
- [ ] أزرار تغيير الحالة بحسب الصلاحية
- [ ] **عند Accept:**
  - [ ] التحقق من توفر الكميات
  - [ ] إذا غير متوفرة: منع Accept أو اقتراح تعديل الكميات
  - [ ] حجز المخزون `RESERVATION` per item
  - [ ] تسجيل InventoryMovement (type=RESERVATION)
- [ ] **عند Cancel/Reject:**
  - [ ] فك الحجز `UNRESERVE`
  - [ ] تسجيل InventoryMovement (type=UNRESERVE)
- [ ] **عند Delivered:**
  - [ ] خصم المخزون الفعلي `DEDUCT_FROM_RESERVATION`
  - [ ] إنشاء Sale {channel=APP, sourceOrderId}
  - [ ] إذا آجل: Transaction (+) على العميل

---

## US-4.5: إقفال الشهر (محدث)
**كمدير**، أريد إقفال الشهر وحساب الفوائد

**Acceptance Criteria:**
- [ ] زر "إقفال الشهر"
- [ ] **التحقق من `periodKey` لمنع التكرار** (مثال: 2026-01)
- [ ] عرض preview: العملاء + الفوائد المتوقعة (مع احترام graceDaysOverride)
- [ ] تأكيد
- [ ] إنشاء Transaction (type=INTEREST, periodKey)
- [ ] تسجيل `lastMonthClose` في Settings

---

## US-7.1: تقرير الضريبة (VAT) ★ جديد
**كمدير**، أريد عرض تقرير ضريبة القيمة المضافة

**Acceptance Criteria:**
- [ ] فلتر بالفترة (شهري/ربع سنوي/سنوي)
- [ ] عرض: إجمالي المبيعات + الضريبة المحصلة
- [ ] عرض: إجمالي المشتريات + الضريبة المدفوعة
- [ ] صافي الضريبة = المحصلة - المدفوعة
- [ ] تصدير PDF

---

## US-7.2: إدارة المناديب ★ جديد
**كمدير**، أريد إدارة المناديب (داخلي/خارجي)

**Acceptance Criteria:**
- [ ] قائمة المناديب مع الفلترة بالنوع
- [ ] إضافة مندوب (اسم، جوال، نوع: INTERNAL/EXTERNAL)
- [ ] تعيين مندوب للطلب
- [ ] تقييم المندوب بعد التسليم (1-5 نجوم)
- [ ] عرض إحصائيات المندوب (الطلبات، التقييم)

---

## US-7.3: الطلب الذكي من المورد ★ جديد
**كمدير**، أريد إنشاء طلب توريد ذكي بناءً على معدل الدوران

**Acceptance Criteria:**
- [ ] إدخال المبلغ المراد إنفاقه
- [ ] الـ AI يوزع المبلغ على المنتجات حسب:
  - [ ] معدل الدوران (المنتجات الأكثر مبيعاً أولاً)
  - [ ] المخزون الحالي vs الحد الأدنى
  - [ ] الموسمية (اختياري)
- [ ] تعديل الكميات يدوياً
- [ ] اختيار المورد
- [ ] اختيار طريقة الدفع (نقد/آجل/شبكة/تحويل/تطبيق)
- [ ] إرسال الطلب للمورد (WhatsApp/Email)

---

## US-7.4: رسائل WhatsApp ★ جديد
**كمدير**، أريد إرسال رسائل WhatsApp للعملاء

**Acceptance Criteria:**
- [ ] إعداد WhatsApp Business API
- [ ] تذكير آلي للديون المتأخرة
- [ ] إرسال العروض للعملاء
- [ ] قوالب رسائل جاهزة

---

## US-7.5: العروض الذكية بالـ AI ★ جديد
**كمدير**، أريد أن يقترح النظام عروضاً ذكية

**Acceptance Criteria:**
- [ ] اقتراح خصم على الأصناف الراكدة
- [ ] اقتراح "اشترِ X واحصل على Y" للقريبة من الانتهاء
- [ ] إشعار Geo-Fencing (للعملاء القريبين)
- [ ] تحديد دائرة الإشعار (1-5 كم)

---

## US-7.6: نقاط الولاء ★ جديد
**كعميل**، أريد تجميع نقاط واستبدالها

**Acceptance Criteria:**
- [ ] كل 1 ريال = 1 نقطة
- [ ] عرض رصيد النقاط في حساب العميل
- [ ] استبدال النقاط بخصم
- [ ] سجل حركات النقاط

---

## US-7.7: الفوترة الإلكترونية ZATCA ★ جديد
**كمدير**، أريد إصدار فواتير متوافقة مع ZATCA

**Acceptance Criteria:**
- [ ] إعدادات ZATCA (الرقم الضريبي، المعرفات)
- [ ] QR Code على كل فاتورة
- [ ] صيغة XML/JSON للـ e-invoice
- [ ] حفظ الفواتير للتدقيق

---

## US-7B.1: الإعدادات العامة ★ جديد
**كمستخدم**، أريد تغيير إعدادات التطبيق

**Acceptance Criteria:**
- [ ] تبديل Dark Mode / Light Mode
- [ ] اختيار اللغة (عربي/إنجليزي)
- [ ] إعدادات الصوت والإشعارات
- [ ] حفظ الإعدادات محلياً

---

## US-7B.2: بيانات المتجر ★ جديد
**كمدير**، أريد تعديل بيانات المتجر

**Acceptance Criteria:**
- [ ] اسم المتجر (عربي/إنجليزي)
- [ ] رفع اللوغو
- [ ] العنوان الكامل
- [ ] رقم الجوال والإيميل
- [ ] أوقات العمل

---

## US-7B.3: أجهزة الدفع ★ جديد
**كمدير**، أريد ربط أجهزة الدفع الإلكتروني

**Acceptance Criteria:**
- [ ] إضافة جهاز (mada, STC Pay, Apple Pay, Tabby)
- [ ] اختبار الاتصال
- [ ] تفعيل/تعطيل الجهاز
- [ ] عرض حالة الاتصال

---

## US-7B.4: تعليق الفاتورة (Hold) ★ جديد
**ككاشير**، أريد تعليق فاتورة واسترجاعها لاحقاً

**Acceptance Criteria:**
- [ ] زر "تعليق" في شاشة POS
- [ ] إضافة اسم/ملاحظة للفاتورة المعلقة
- [ ] قائمة الفواتير المعلقة
- [ ] استرجاع الفاتورة للسلة
- [ ] حذف فاتورة معلقة

---

## US-7B.5: المرتجعات ★ جديد
**ككاشير**، أريد عمل مرتجع لفاتورة سابقة

**Acceptance Criteria:**
- [ ] البحث بالفاتورة (رقم/تاريخ)
- [ ] اختيار المنتجات المرتجعة
- [ ] سبب المرتجع
- [ ] إرجاع المبلغ (نقد/بطاقة/رصيد)
- [ ] طباعة إيصال المرتجع
- [ ] تحديث المخزون (+)

---

## US-7B.6: إدارة الوردية والصندوق ★ جديد
**ككاشير**، أريد فتح/إغلاق الوردية وتسوية الصندوق

**Acceptance Criteria:**
- [ ] فتح وردية (المبلغ الافتتاحي)
- [ ] إغلاق وردية (المبلغ الفعلي)
- [ ] حساب الفرق (عجز/زيادة)
- [ ] تقرير الوردية (المبيعات، المرتجعات، المصروفات)
- [ ] صلاحية: الكاشير يرى ورديته فقط

---

## US-7B.7: تتبع صلاحية المنتجات ★ جديد
**كمدير**، أريد تتبع تواريخ انتهاء الصلاحية

**Acceptance Criteria:**
- [ ] إضافة تاريخ الصلاحية للمنتج
- [ ] قائمة المنتجات القريبة من الانتهاء
- [ ] تنبيهات (30 يوم، 15 يوم، 7 أيام)
- [ ] عرض في Dashboard
- [ ] فلترة حسب الفئة

---

# 📆 Sprint Planning (محدث - Sync مبكراً)

## Sprint 1 (Week 1-2): Foundation + Sync Skeleton
| Task | Hours |
|------|-------|
| Project setup + DI + Router | 8 |
| Drift setup + Models | 8 |
| **Sync Queue skeleton (Local)** | 8 |
| POS Screen layout (Split View) | 8 |
| Products Grid + Categories | 8 |
| Cart Panel | 8 |
| **Total** | **48** |

## Sprint 2 (Week 3-4): POS Complete + API Integration
| Task | Hours |
|------|-------|
| **Auth + Login** | 8 |
| **Basic Push/Pull Sync** | 8 |
| Payment selection + Customer Drawer | 8 |
| Sale creation + Inventory deduct | 8 |
| Receipt printing (Thermal) | 6 |
| Printer settings screen | 4 |
| Products CRUD screens | 10 |
| **Total** | **52** |

## Sprint 3 (Week 5-6): Inventory + Suppliers + Purchases
| Task | Hours |
|------|-------|
| Inventory view + adjust | 8 |
| Suppliers CRUD | 8 |
| Manual purchase invoice | 12 |
| AI Invoice import (UI) | 8 |
| AI Backend integration | 16 |
| Review & matching screen | 12 |
| **Total** | **64** |

## Sprint 4 (Week 7-8): Debts + Interest
| Task | Hours |
|------|-------|
| Customers list | 6 |
| Customer account (Ledger) | 12 |
| Payment recording | 6 |
| Interest settings | 8 |
| Monthly close + periodKey | 12 |
| **Total** | **44** |

## Sprint 5 (Week 9-10): Orders + Dashboard
| Task | Hours |
|------|-------|
| Orders list + details | 12 |
| Order status flow + Reservation logic | 12 |
| Dashboard | 12 |
| Sales report + channel filter | 8 |
| Debts report | 6 |
| PDF export | 6 |
| **Total** | **56** |

## Sprint 6 (Week 11-12): Polish + Testing + Permissions
| Task | Hours |
|------|-------|
| Sync improvements (retry/conflicts) | 12 |
| Background sync | 6 |
| Role-based permissions (Manager/Cashier) | 8 |
| Audit log (sensitive operations) | 6 |
| Unit tests | 12 |
| Widget tests | 8 |
| Bug fixes | 8 |
| **Total** | **60** |

## Sprint 7 (Week 13-14): ميزات المتقدمة ★ جديد
| Task | Hours |
|------|-------|
| VAT Report (تقرير الضريبة) | 8 |
| ZATCA Integration (QR Code) | 12 |
| Drivers management (قائمة/إضافة/تقييم) | 12 |
| Driver assignment to orders | 6 |
| Smart Reorder (الطلب الذكي من المورد) | 16 |
| **Total** | **54** |

## Sprint 8 (Week 15-16): التسويق والولاء ★ جديد
| Task | Hours |
|------|-------|
| WhatsApp Integration (رسائل الديون والعروض) | 12 |
| Smart Promotions (العروض الذكية بالـ AI) | 12 |
| Geo-Fencing Notifications | 12 |
| Loyalty Program (نقاط الولاء) | 16 |
| Supplier Marketplace (basic) | 8 |
| **Total** | **60** |

## Sprint 9 (Week 17-18): الإعدادات والعمليات ★ جديد
| Task | Hours |
|------|-------|
| General Settings (Dark Mode + Language) | 8 |
| Store Settings (Logo + Address) | 8 |
| Payment Devices Integration (mada/STC Pay) | 16 |
| Hold Invoice (تعليق الفاتورة) | 8 |
| Returns (المرتجعات) | 12 |
| **Total** | **52** |

## Sprint 10 (Week 19-20): الصندوق والصلاحية ★ جديد
| Task | Hours |
|------|-------|
| Cash Drawer (إدارة الوردية) | 12 |
| Expiry Tracking (تتبع الصلاحية) | 12 |
| Expiry Alerts + Dashboard | 8 |
| Integration tests | 12 |
| Final polish | 8 |
| **Total** | **52** |

## Sprint 11+ (مستقبلي): Phase 8
| Task | Hours |
|------|-------|
| User Management | 12 |
| Backup/Restore | 8 |
| Expenses | 10 |
| Inventory Count | 12 |
| Cashier Report | 8 |
| **Total** | **50** |

---

# 🗄️ Database Schema (Local) - محدث

```
┌─────────────────────────────────────────────────────────────┐
│                        PRODUCTS                             │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ name, nameEn?                                               │
│ barcode                                                     │
│ categoryId                                                  │
│ sellPrice                                                   │
│ purchasePrice                                               │
│ minStock                                                    │
│ imageUrl?                                                   │
│ isActive                                                    │
│ createdAt, updatedAt                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        INVENTORY                            │
├─────────────────────────────────────────────────────────────┤
│ productId (PK)                                              │
│ quantity                                                    │
│ reservedQty                                                 │
│ → availableQty = quantity - reservedQty (computed)         │
│ lastUpdated                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   INVENTORY_MOVEMENTS ★ محدث                │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ productId                                                   │
│ type: SALE_OUT | PURCHASE_IN | ADJUSTMENT |                │
│       RESERVATION | UNRESERVE | DEDUCT_FROM_RESERVATION    │
│ quantity (+/-)                                              │
│ unitCost? (للمشتريات)                                       │
│ unitPrice? (للمبيعات)                                       │
│ channel? (POS/APP)                                          │
│ referenceType (SALE/PURCHASE/ORDER/ADJUSTMENT)              │
│ referenceId                                                 │
│ reason?                                                     │
│ createdBy                                                   │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        SALES ★ محدث                         │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ receiptNo (رقم مقروء للطباعة)                               │
│ channel (POS/APP)                                           │
│ sourceOrderId? (ربط بالطلب إن كان من التطبيق)              │
│ customerId?                                                 │
│ cashierId                                                   │
│ paymentMethod (CASH/CARD/CREDIT)                           │
│ subtotal                                                    │
│ discount                                                    │
│ tax (0 إن لم يكن)                                           │
│ total                                                       │
│ status (COMPLETED/VOIDED)                                   │
│ voidedAt?, voidedBy?, voidReason?                          │
│ createdAt                                                   │
│ syncStatus (PENDING/SYNCED/FAILED)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       SALE_ITEMS                            │
├─────────────────────────────────────────────────────────────┤
│ id | saleId | productId | quantity | unitPrice             │
│ unitCost (لحساب الربح) | total                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      ACCOUNTS ★ محدث                        │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ type (CUSTOMER/SUPPLIER)                                    │
│ name                                                        │
│ phone?                                                      │
│ balance                                                     │
│ interestRateOverride? (null = اتبع الافتراضي)               │
│ interestEnabledOverride? (null = اتبع العام)                │
│ graceDaysOverride? (null = اتبع الافتراضي)                  │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               ACCOUNT_TRANSACTIONS ★ محدث                   │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ accountId                                                   │
│ type: INVOICE | PAYMENT | INTEREST | WAIVE                 │
│ amount (+/-)                                                │
│ balanceAfter                                                │
│ periodKey? (للفوائد فقط: 2026-01)                          │
│ paymentMethod? (للدفعات فقط: CASH/CARD/ONLINE)             │
│ referenceId?                                                │
│ notes?                                                      │
│ createdBy (POS/APP/ADMIN)                                   │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      PURCHASES ★ محدث                       │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ supplierId                                                  │
│ total                                                       │
│ isPaid                                                      │
│ invoiceDate                                                 │
│ invoiceImageUrl? (محفوظة للرجوع)                            │
│ aiRawJson? (JSON الخام من AI)                               │
│ status (COMPLETED/VOIDED)                                   │
│ createdBy                                                   │
│ createdAt                                                   │
│ syncStatus                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PURCHASE_ITEMS ★ محدث                     │
├─────────────────────────────────────────────────────────────┤
│ id                                                          │
│ purchaseId                                                  │
│ productId? (قد يكون null قبل المطابقة)                      │
│ rawName (الاسم كما ظهر في الفاتورة)                         │
│ quantity                                                    │
│ unitCost                                                    │
│ total                                                       │
│ aiConfidence?                                               │
│ isConfirmed (تم تأكيده يدوياً)                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         ORDERS                              │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ customerId                                                  │
│ status: PENDING | ACCEPTED | PREPARED | DELIVERED | CANCELLED
│ paymentMethod                                               │
│ subtotal, discount, total                                   │
│ address?, notes?                                            │
│ createdAt, updatedAt                                        │
│ acceptedAt?, preparedAt?, deliveredAt?, cancelledAt?        │
│ syncStatus                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       SYNC_QUEUE                            │
├─────────────────────────────────────────────────────────────┤
│ id                                                          │
│ entityType (SALE/PURCHASE/ORDER/ACCOUNT_TX...)              │
│ entityId                                                    │
│ action (CREATE/UPDATE/DELETE)                               │
│ payload (JSON)                                              │
│ status (PENDING/SYNCED/FAILED)                              │
│ attempts                                                    │
│ lastError?                                                  │
│ createdAt                                                   │
│ syncedAt?                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         USERS                               │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ name                                                        │
│ phone                                                       │
│ pin? (للـ POS)                                              │
│ role (MANAGER/CASHIER)                                      │
│ isActive                                                    │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       AUDIT_LOG                             │
├─────────────────────────────────────────────────────────────┤
│ id                                                          │
│ userId                                                      │
│ action (VOID_SALE/ADJUST_INVENTORY/CLOSE_MONTH/CHANGE_PRICE)│
│ entityType                                                  │
│ entityId                                                    │
│ oldValue? (JSON)                                            │
│ newValue? (JSON)                                            │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        SETTINGS                             │
├─────────────────────────────────────────────────────────────┤
│ key | value | updatedAt                                    │
│ ─────────────────────────────────────────────────────────── │
│ interestEnabled        : "true"/"false"                    │
│ defaultInterestRate    : "5" (%)                           │
│ defaultGraceDays       : "0"                               │
│ lastMonthClose         : "2026-01"                         │
│ printerType            : "THERMAL"/"PDF"                   │
│ printerTemplate        : "COMPACT"/"DETAILED"              │
│ autoPrint              : "true"/"false"                    │
│ lastReceiptNo          : "1234"                            │
│ whatsappApiKey?        : "..."                             │
│ zatcaEnabled           : "true"/"false"                    │
│ zatcaTaxNumber?        : "..."                             │
│ loyaltyEnabled         : "true"/"false"                    │
│ pointsPerRiyal         : "1"                               │
│ geoFenceRadius         : "3" (km)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      DRIVERS ★ جديد                         │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ name                                                        │
│ phone                                                       │
│ type (INTERNAL/EXTERNAL)                                    │
│ avgRating                                                   │
│ totalDeliveries                                             │
│ isActive                                                    │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   DRIVER_RATINGS ★ جديد                     │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ driverId                                                    │
│ orderId                                                     │
│ rating (1-5)                                                │
│ comment?                                                    │
│ createdBy                                                   │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PROMOTIONS ★ جديد                        │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ type (DISCOUNT/BUY_X_GET_Y/BUNDLE)                         │
│ name                                                        │
│ description?                                                │
│ discountPercent?                                            │
│ discountAmount?                                             │
│ productIds? (JSON array)                                    │
│ minPurchaseAmount?                                          │
│ startDate                                                   │
│ endDate                                                     │
│ geoFenceEnabled                                             │
│ isActive                                                    │
│ isAiGenerated                                               │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                LOYALTY_TRANSACTIONS ★ جديد                  │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ accountId                                                   │
│ type (EARN/REDEEM)                                          │
│ points (+/-)                                                │
│ balanceAfter                                                │
│ referenceType (SALE/REDEMPTION)                             │
│ referenceId                                                 │
│ createdAt                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  SMART_ORDERS ★ جديد                        │
├─────────────────────────────────────────────────────────────┤
│ id (UUID)                                                   │
│ supplierId                                                  │
│ totalAmount                                                 │
│ paymentMethod (CASH/CREDIT/CARD/TRANSFER/APP)              │
│ status (DRAFT/SENT/CONFIRMED/DELIVERED)                     │
│ sentVia? (WHATSAPP/EMAIL)                                   │
│ itemsJson (JSON array of products)                          │
│ createdAt                                                   │
│ sentAt?                                                     │
│ confirmedAt?                                                │
└─────────────────────────────────────────────────────────────┘
```

---

# 👥 Roles & Permissions

| الصلاحية | Manager | Cashier |
|----------|---------|---------|
| البيع (POS) | ✅ | ✅ |
| إلغاء فاتورة (Void) | ✅ | ❌ |
| إدارة المنتجات | ✅ | 👁️ (عرض فقط) |
| تعديل الأسعار | ✅ | ❌ |
| تعديل المخزون | ✅ | ❌ |
| المشتريات | ✅ | ❌ |
| الديون والفوائد | ✅ | ❌ |
| إقفال الشهر | ✅ | ❌ |
| الطلبات | ✅ | ✅ |
| التقارير | ✅ | 👁️ (Dashboard فقط) |
| الإعدادات | ✅ | ❌ |
| المناديب (Phase 7) | ✅ | 👁️ (عرض فقط) |
| تقرير VAT (Phase 7) | ✅ | ❌ |
| العروض (Phase 7) | ✅ | ❌ |
| الطلب الذكي (Phase 7) | ✅ | ❌ |
| ZATCA (Phase 7) | ✅ | ❌ |

---

# 🚀 الخطوة التالية

✅ هذه الوثيقة معتمدة نهائياً

التالي:
1. **API Contract** (Request/Response)
2. UX Wireframes
3. بدء Sprint 1

---

> **Approved by:** _________ | **Date:** 2026-01-13
