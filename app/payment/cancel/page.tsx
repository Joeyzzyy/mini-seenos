'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
            <svg 
              className="w-10 h-10 text-yellow-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-white mb-4">
          支付已取消
        </h1>
        <p className="text-gray-400 mb-8">
          您已取消了本次支付。如果这是误操作，您可以随时返回重新购买。
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            返回项目
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            返回首页
          </Link>
        </div>

        {/* Help Info */}
        <div className="mt-12 p-4 bg-[#1a1a2e] rounded-lg border border-[#2d2d44]">
          <h3 className="text-white font-medium mb-2">遇到问题？</h3>
          <p className="text-gray-400 text-sm mb-3">
            如果您在支付过程中遇到任何问题，可以尝试以下方法：
          </p>
          <ul className="text-gray-400 text-sm text-left space-y-1">
            <li>• 检查您的 PayPal 账户状态</li>
            <li>• 确保您的支付方式有效</li>
            <li>• 尝试使用其他浏览器</li>
            <li>• 联系我们的支持团队获取帮助</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
