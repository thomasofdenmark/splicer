import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnDeals = nextUrl.pathname.startsWith('/deals');
      const isOnProducts = nextUrl.pathname.startsWith('/products');
      const isOnUnauthorized = nextUrl.pathname === '/unauthorized';
      
      // Allow access to unauthorized page
      if (isOnUnauthorized) {
        return true;
      }
      
      // Dashboard routes are admin-only
      if (isOnDashboard) {
        if (!isLoggedIn) {
          return false; // Redirect to login
        }
        if (auth.user?.role !== 'admin') {
          return Response.redirect(new URL('/unauthorized', nextUrl));
        }
        return true;
      }
      
      // Deal and product creation/management requires login
      if ((isOnDeals || isOnProducts) && nextUrl.pathname.includes('/create')) {
        return isLoggedIn;
      }
      
      // Public routes
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'admin';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
