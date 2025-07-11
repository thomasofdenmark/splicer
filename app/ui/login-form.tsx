'use client';

import { ArrowRightIcon } from '@heroicons/react/20/solid';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useActionState, useState, useEffect } from 'react';

import { authenticate } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { display } from '@/app/ui/fonts';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errorMessage] = useActionState(
    authenticate,
    undefined,
  );
  const [clientError, setClientError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle redirect after successful login
  useEffect(() => {
    if (status === 'authenticated' && session?.user && isSubmitting) {
      if (callbackUrl) {
        router.push(callbackUrl);
        return;
      }
      
      // Role-based redirect when no callback URL is provided
      if (session.user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/my-dashboard');
      }
    }
  }, [session, status, callbackUrl, router, isSubmitting]);

  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setClientError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setClientError('Invalid credentials.');
        setIsSubmitting(false);
        return;
      }
      
      // Success - the useEffect will handle the redirect
    } catch (_error) {
      setClientError('Something went wrong.');
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleClientSubmit}
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${display.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isSubmitting}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {(errorMessage || clientError) && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage || clientError}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
