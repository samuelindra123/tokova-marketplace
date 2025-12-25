import Link from 'next/link';

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">

            {/* Illustration / Icon */}
            <div className="mb-8 relative">
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 shadow-sm transform rotate-12">
                    Coming Soon
                </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Returns & Refunds
            </h1>

            <h2 className="text-2xl font-medium text-slate-600 mb-6">
                Feature Under Development
            </h2>

            <p className="max-w-md text-slate-500 text-lg mb-10 leading-relaxed">
                We are currently building a seamless and automated returns process to serve you better. This feature will be available in the next update.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/help"
                    className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
                >
                    Contact Support
                </Link>
                <Link
                    href="/"
                    className="px-8 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                    Back to Home
                </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 w-full max-w-lg">
                <p className="text-sm text-slate-400">
                    Need to return an item urgently? Please contact our Customer Support directly through the Help Center for manual processing.
                </p>
            </div>
        </div>
    );
}
