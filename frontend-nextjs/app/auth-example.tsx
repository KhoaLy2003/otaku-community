// 'use client';

// import React from 'react';
// import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
// import { UserSyncProvider, useUserSyncContext } from '@/components/auth/UserSyncProvider';
// import { UserSyncStatus, UserInfo } from '@/components/auth/UserSyncStatus';

// /**
//  * Example of how to integrate Auth0 user sync into your app
//  */
// export function AuthExampleApp() {
//   return (
//     <UserProvider>
//       <UserSyncProvider>
//         <div className="min-h-screen bg-gray-100">
//           <header className="bg-white shadow">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex justify-between items-center py-6">
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   Otaku Community
//                 </h1>
//                 <AuthButton />
//               </div>
//             </div>
//           </header>

//           <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//             <div className="px-4 py-6 sm:px-0">
//               {/* User sync status notifications */}
//               <UserSyncStatus />
              
//               {/* User info display */}
//               <div className="mt-4">
//                 <UserInfo />
//               </div>

//               {/* Your app content here */}
//               <div className="mt-8">
//                 <AppContent />
//               </div>
//             </div>
//           </main>
//         </div>
//       </UserSyncProvider>
//     </UserProvider>
//   );
// }

// /**
//  * Authentication button component
//  */
// function AuthButton() {
//   const { user, isLoading } = useUser();

//   if (isLoading) {
//     return (
//       <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
//     );
//   }

//   if (user) {
//     return (
//       <a
//         href="/api/auth/logout"
//         className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
//       >
//         Logout
//       </a>
//     );
//   }

//   return (
//     <a
//       href="/api/auth/login"
//       className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
//     >
//       Login
//     </a>
//   );
// }

// /**
//  * Your main app content
//  */
// function AppContent() {
//   const { user } = useUser();
//   const { syncedUser } = useUserSyncContext();

//   if (!user) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">
//           Welcome to Otaku Community
//         </h2>
//         <p className="text-gray-600">
//           Please log in to access the community features.
//         </p>
//       </div>
//     );
//   }

//   if (!syncedUser) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="text-gray-600 mt-4">Loading your profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-4">
//         Welcome back, {syncedUser.username}!
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Info</h3>
//           <dl className="space-y-2">
//             <div>
//               <dt className="text-sm font-medium text-gray-500">Username</dt>
//               <dd className="text-sm text-gray-900">{syncedUser.username}</dd>
//             </div>
//             <div>
//               <dt className="text-sm font-medium text-gray-500">Role</dt>
//               <dd className="text-sm text-gray-900">{syncedUser.role}</dd>
//             </div>
//             <div>
//               <dt className="text-sm font-medium text-gray-500">Member Since</dt>
//               <dd className="text-sm text-gray-900">
//                 {new Date(syncedUser.createdAt).toLocaleDateString()}
//               </dd>
//             </div>
//           </dl>
//         </div>

//         <div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
//           <div className="space-y-2">
//             <button className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
//               View Posts
//             </button>
//             <button className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded transition-colors">
//               Create Post
//             </button>
//             <button className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded transition-colors">
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Don't forget to add these environment variables to your .env.local:
// /*
// NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
// NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
// NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.otaku-community.com
// NEXT_PUBLIC_API_URL=http://localhost:8080/api
// */