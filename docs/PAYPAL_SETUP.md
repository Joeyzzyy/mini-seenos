# PayPal 支付集成配置指南

本文档介绍如何配置 PayPal 支付功能。

## 1. 环境变量配置

在 `.env.local` 文件中添加以下环境变量：

```bash
# PayPal Configuration
# 从 PayPal Developer Dashboard 获取
# https://developer.paypal.com/dashboard/applications/sandbox

# 沙盒环境（测试）
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_WEBHOOK_ID=your_sandbox_webhook_id

# 前端使用的 Client ID（需要是 NEXT_PUBLIC_ 前缀）
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id

# 应用 URL（用于支付回调）
NEXT_PUBLIC_APP_URL=http://localhost:3007
```

### 生产环境

生产环境请使用 Live 凭证：

```bash
# PayPal Configuration - Production
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_WEBHOOK_ID=your_live_webhook_id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

## 2. PayPal 开发者账户设置

### 2.1 创建应用

1. 登录 [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. 点击 "Apps & Credentials"
3. 点击 "Create App"
4. 填写应用名称（如 "SEOPages Pro"）
5. 选择 "Merchant" 类型
6. 创建后获取 Client ID 和 Secret

### 2.2 配置 Webhook

1. 在应用详情页面，滚动到 "Webhooks" 部分
2. 点击 "Add Webhook"
3. 输入 Webhook URL：`https://your-domain.com/api/paypal/webhook`
4. 选择以下事件：
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
5. 保存后获取 Webhook ID

### 2.3 沙盒测试账户

PayPal 会自动创建沙盒测试账户：
- 进入 "Sandbox > Accounts"
- 使用 Personal 账户进行测试支付
- 使用 Business 账户接收支付

## 3. 数据库迁移

运行以下 SQL 迁移来创建支付订单表：

```bash
# 使用 Supabase CLI
supabase migration up

# 或者直接在 Supabase Dashboard 执行 SQL
# 文件位置: supabase/migrations/add_payment_orders.sql
```

## 4. 使用定价组件

在需要显示定价的页面中使用 `PricingModal` 组件：

```tsx
import PricingModal from '@/components/PricingModal';

// 在组件中
const [showPricing, setShowPricing] = useState(false);

// 处理支付成功
const handlePaymentSuccess = (newCredits: number, newTier: string) => {
  setUserCredits(newCredits);
  setSubscriptionTier(newTier);
  // 显示成功提示等
};

// 渲染
<PricingModal
  isOpen={showPricing}
  onClose={() => setShowPricing(false)}
  currentCredits={userCredits}
  currentTier={subscriptionTier}
  onPaymentSuccess={handlePaymentSuccess}
/>

// 触发打开
<button onClick={() => setShowPricing(true)}>
  升级计划
</button>
```

## 5. 定价计划配置

当前定价配置（可在代码中修改）：

| 计划 | 价格 (USD) | 积分数 |
|------|-----------|--------|
| Starter | $9.90 | 10 |
| Standard | $19.90 | 20 |
| Pro | $39.90 | 50 |

修改位置：
- `app/api/paypal/create-order/route.ts` - PRICING_PLANS
- `app/api/paypal/capture-order/route.ts` - PRICING_PLANS
- `components/PricingModal.tsx` - PLANS

## 6. 测试流程

1. 确保环境变量正确配置
2. 启动开发服务器：`npm run dev`
3. 登录到应用
4. 点击升级按钮打开定价弹窗
5. 选择一个计划
6. 点击 PayPal 按钮
7. 使用沙盒测试账户完成支付
8. 验证积分是否正确增加

## 7. 上线检查清单

- [ ] 切换到 PayPal Live 凭证
- [ ] 更新 `NEXT_PUBLIC_APP_URL` 为生产域名
- [ ] 配置生产环境的 Webhook
- [ ] 测试完整支付流程
- [ ] 确保 Webhook 可以正常接收通知
- [ ] 检查 SSL 证书（PayPal 要求 HTTPS）

## 8. 常见问题

### Q: PayPal 按钮不显示？
A: 检查 `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 是否正确配置。

### Q: 支付后积分没有增加？
A: 1) 检查 API 路由日志 2) 确认数据库函数存在 3) 检查用户认证状态

### Q: Webhook 验证失败？
A: 1) 确认 `PAYPAL_WEBHOOK_ID` 正确 2) 检查 Webhook URL 是否可访问

### Q: 沙盒支付失败？
A: 使用 PayPal 提供的沙盒测试账户，不要使用真实账户。

## 9. 安全注意事项

- **永远不要**在前端暴露 `PAYPAL_CLIENT_SECRET`
- 生产环境**必须**验证 Webhook 签名
- 定期检查订单状态，防止重复充值
- 保留所有支付记录用于对账
