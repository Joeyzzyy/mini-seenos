import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// PayPal API 基础配置
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// 定价配置 (美元)
const PRICING_PLANS = {
  starter: { price: '9.90', credits: 10, name: 'Starter Plan' },
  standard: { price: '19.90', credits: 20, name: 'Standard Plan' },
  pro: { price: '39.90', credits: 50, name: 'Pro Plan' },
} as const;

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to create authenticated Supabase client
function createAuthenticatedClient(request: NextRequest) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: request.headers.get('Authorization') || '',
        },
      },
    }
  );
}

// 获取 PayPal Access Token
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get PayPal access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const supabase = createAuthenticatedClient(request);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '请先登录后再购买' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { plan } = body as { plan: keyof typeof PRICING_PLANS };

    if (!plan || !PRICING_PLANS[plan]) {
      return NextResponse.json(
        { error: '无效的订阅计划' },
        { status: 400 }
      );
    }

    const selectedPlan = PRICING_PLANS[plan];

    // 获取 PayPal Access Token
    const accessToken = await getPayPalAccessToken();

    // 创建 PayPal 订单
    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `${user.id}_${plan}_${Date.now()}`,
            description: `SEOPages Pro - ${selectedPlan.name}`,
            custom_id: JSON.stringify({
              user_id: user.id,
              plan: plan,
              credits: selectedPlan.credits,
            }),
            amount: {
              currency_code: 'USD',
              value: selectedPlan.price,
            },
          },
        ],
        application_context: {
          brand_name: 'SEOPages Pro',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('Failed to create PayPal order:', errorData);
      return NextResponse.json(
        { error: '创建订单失败，请稍后重试' },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();

    // 可选：将订单记录到数据库
    await supabaseAdmin.from('payment_orders').insert({
      id: orderData.id,
      user_id: user.id,
      plan: plan,
      amount: selectedPlan.price,
      currency: 'USD',
      credits: selectedPlan.credits,
      status: 'CREATED',
      provider: 'paypal',
      created_at: new Date().toISOString(),
    }).catch(err => {
      // 如果表不存在，忽略错误（可选功能）
      console.log('Note: payment_orders table may not exist:', err.message);
    });

    return NextResponse.json({
      orderID: orderData.id,
      status: orderData.status,
    });

  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
