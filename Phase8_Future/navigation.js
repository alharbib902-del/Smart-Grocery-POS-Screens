// Smart Grocery POS - Navigation System
// This script adds a floating navigation menu to all screens

document.addEventListener('DOMContentLoaded', function () {
    // Create floating menu button
    const menuBtn = document.createElement('button');
    menuBtn.id = 'floating-menu-btn';
    menuBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
    `;
    menuBtn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; z-index: 9999;
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white; border: none; cursor: pointer;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
    `;
    menuBtn.onmouseenter = () => { menuBtn.style.transform = 'scale(1.1)'; };
    menuBtn.onmouseleave = () => { menuBtn.style.transform = 'scale(1)'; };

    // Create menu panel
    const menuPanel = document.createElement('div');
    menuPanel.id = 'floating-menu-panel';
    menuPanel.innerHTML = `
        <div style="background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); max-height: 80vh; overflow-y: auto; width: 320px;">
            <div style="padding: 16px 20px; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; z-index: 1;">
                <h3 style="font-weight: bold; font-size: 16px; margin: 0;">التنقل السريع</h3>
                <button id="close-menu" style="background: none; border: none; cursor: pointer; padding: 4px;">✕</button>
            </div>
            <div style="padding: 12px;">
                <a href="index.html" class="nav-item" style="background: #4CAF50; color: white;">🏠 الرئيسية</a>
                
                <div class="nav-section">نقاط البيع</div>
                <a href="pos.html" class="nav-item">🛒 شاشة البيع</a>
                <a href="payment.html" class="nav-item">💳 الدفع</a>
                <a href="Receipt.html" class="nav-item">🧾 الفاتورة</a>
                
                <div class="nav-section">المنتجات والمخزون</div>
                <a href="Product_List.html" class="nav-item">📦 قائمة المنتجات</a>
                <a href="Add_Product_Form.html" class="nav-item">➕ إضافة منتج</a>
                <a href="Inventory_List.html" class="nav-item">📊 المخزون</a>
                <a href="Inventory_Adjust.html" class="nav-item">± تعديل المخزون</a>

                <div class="nav-section">الموردين والمشتريات</div>
                <a href="Supplier_List.html" class="nav-item">🏭 الموردين</a>
                <a href="Add_Purchase.html" class="nav-item">📥 فاتورة مشتريات</a>
                <a href="Import_Purchase.html" class="nav-item">📷 استيراد AI</a>

                <div class="nav-section">العملاء والديون</div>
                <a href="Customer_List.html" class="nav-item">👥 العملاء</a>
                <a href="Customer_Account.html" class="nav-item">📋 حساب العميل</a>
                <a href="Interest_Settings.html" class="nav-item">% إعدادات الفوائد</a>
                <a href="Close_Month.html" class="nav-item">📅 إقفال الشهر</a>

                <div class="nav-section">الطلبات</div>
                <a href="Order_List.html" class="nav-item">📋 قائمة الطلبات</a>
                <a href="Order_Details.html" class="nav-item">📝 تفاصيل الطلب</a>

                <div class="nav-section">التقارير</div>
                <a href="dashboard.html" class="nav-item">📊 لوحة التحكم</a>
                <a href="Sales_Report.html" class="nav-item">💰 تقرير المبيعات</a>
                <a href="Debt_Report.html" class="nav-item">💳 تقرير الديون</a>
                <a href="Inventory_Report.html" class="nav-item">📦 تقرير المخزون</a>

                <div class="nav-section">الميزات المتقدمة</div>
                <a href="advanced.html" class="nav-item">🤖 المتقدمة / AI</a>
                <a href="operations.html" class="nav-item">⚙️ العمليات</a>
                <a href="Driver_List.html" class="nav-item">🚗 المناديب</a>
                <a href="Smart_Order.html" class="nav-item">🧠 الطلب الذكي</a>
                <a href="Promotions.html" class="nav-item">🏷️ العروض</a>
                <a href="Loyalty.html" class="nav-item">⭐ نقاط الولاء</a>

                <div class="nav-section">الإعدادات</div>
                <a href="Printer_Settings.html" class="nav-item">🖨️ إعدادات الطابعة</a>
                <a href="WhatsApp_Settings.html" class="nav-item">📱 إعدادات واتساب</a>
                <a href="Login_Screen.html" class="nav-item">🔐 تسجيل الدخول</a>
            </div>
        </div>
    `;
    menuPanel.style.cssText = `
        position: fixed; bottom: 90px; left: 20px; z-index: 9998;
        display: none; animation: slideUp 0.2s ease;
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .nav-section {
            font-size: 11px; font-weight: bold; color: #6B7280;
            padding: 12px 12px 4px; text-transform: uppercase;
        }
        .nav-item {
            display: block; padding: 10px 12px; margin: 2px 0;
            border-radius: 8px; text-decoration: none; color: #1F2937;
            font-size: 14px; transition: background 0.2s;
        }
        .nav-item:hover { background: #F3F4F6; }
        #floating-menu-panel a[href="${window.location.pathname.split('/').pop()}"] {
            background: #E8F5E9 !important; color: #4CAF50 !important; font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(menuBtn);
    document.body.appendChild(menuPanel);

    // Toggle menu
    let isOpen = false;
    menuBtn.onclick = () => {
        isOpen = !isOpen;
        menuPanel.style.display = isOpen ? 'block' : 'none';
        menuBtn.innerHTML = isOpen ? `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        ` : `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        `;
    };

    // Close menu button
    document.getElementById('close-menu').onclick = () => {
        isOpen = false;
        menuPanel.style.display = 'none';
        menuBtn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        `;
    };

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menuPanel.contains(e.target) && !menuBtn.contains(e.target) && isOpen) {
            isOpen = false;
            menuPanel.style.display = 'none';
            menuBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            `;
        }
    });
});
