'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json',
                },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    password,
                    roles: ['ROLE_USER']
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors
                if (data.violations) {
                    const violationMessages = data.violations.map((v: { message: string }) => v.message).join(', ');
                    setError(violationMessages);
                } else {
                    setError(data.error || data['hydra:description'] || 'Registration failed');
                }
                return;
            }

            // Registration successful, redirect to login
            window.location.href = '/login?registered=true';

        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navigation Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <BookOpen className="h-8 w-8 text-orange-500" />
                                <span className="text-xl font-bold ">MangaDex</span>
                            </Link>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-gray-300 hover:text-orange-400 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Register Form Section */}
            <section className="py-16">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold  mb-2">Create Account</h1>
                            <p className="">Join the MangaDex community</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className=" block text-sm font-medium  mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " />
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        minLength={1}
                                        maxLength={64}
                                        className="w-full pl-10 pr-4 py-3 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Choose a username"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className=" block text-sm font-medium  mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        maxLength={255}
                                        className="w-full pl-10 pr-4 py-3 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium  mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        maxLength={1024}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2  hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium  mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        maxLength={1024}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2  hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm ">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500  py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <div className="text-center mt-8">
                            <p className="text-white">
                                Already have an account?{' '}
                                <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800  py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <BookOpen className="h-6 w-6 text-orange-500" />
                            <span className="text-lg font-bold">MangaDex</span>
                        </div>
                        <p className=" text-sm mb-4">
                            Read comics and manga online with high quality images
                        </p>
                        <div className="flex justify-center space-x-6 text-sm ">
                            <Link href="/help" className="hover:text-orange-500 transition-colors">Help</Link>
                            <Link href="/rules" className="hover:text-orange-500 transition-colors">Rules</Link>
                            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
                        </div>
                        <div className="mt-4 text-gray-500 text-xs">
                            &copy; 2024 MangaDex. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
