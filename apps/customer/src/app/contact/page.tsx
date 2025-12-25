'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { api } from '@/lib/api';

interface ContactFormInputs {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormInputs>();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data: ContactFormInputs) => {
        setStatus('loading');
        try {
            await api.post('/contact', data);
            setStatus('success');
            reset();
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have questions or need assistance? Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Info */}
                    <div>
                        <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Get In Touch</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">📍</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Head Office</h4>
                                        <p className="text-slate-600">Jalan Teknologi Raya No. 1, Jakarta, Indonesia</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">📧</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Email</h4>
                                        <p className="text-slate-600">support@tokova.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">📞</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Phone</h4>
                                        <p className="text-slate-600">+62 21 1234 5678</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/help" className="text-orange-500 hover:text-orange-600 font-medium">Visit Help Center →</Link>
                                </li>
                                <li>
                                    <Link href="/shipping" className="text-orange-500 hover:text-orange-600 font-medium">Shipping Information →</Link>
                                </li>
                                <li>
                                    <Link href="/returns" className="text-orange-500 hover:text-orange-600 font-medium">Returns Policy →</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Send Message</h3>

                        {status === 'success' ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                                <p className="text-green-700 mb-6">Thank you for contacting us. Check your email for a confirmation receipt.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {status === 'error' && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            {...register('name', { required: 'Name is required' })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            placeholder="Your Name"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                                            })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        {...register('subject', { required: 'Subject is required' })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        {...register('message', { required: 'Message is required' })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
