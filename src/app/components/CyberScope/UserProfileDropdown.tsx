import React, { useRef, useEffect } from 'react';
import { User, LogOut, Settings, Mail, Calendar } from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';

// Use the return type from useUser hook
type UserType = ReturnType<typeof useUser>['user'];

interface UserProfileDropdownProps {
  user: NonNullable<UserType>;
  onClose: () => void;
}

export function UserProfileDropdown({ user, onClose }: UserProfileDropdownProps) {
  const { signOut } = useClerk();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || user.emailAddresses[0]?.emailAddress || 'User'}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {user.fullName || 'User'}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        
        {/* User Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <Mail size={12} />
              <span className="font-medium">Email</span>
            </div>
            <div className="text-gray-500">
              {user.emailAddresses[0]?.verification?.status === 'verified' ? (
                <span className="text-green-600 font-medium">✓ Verified</span>
              ) : (
                <span className="text-orange-600 font-medium">Pending</span>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <Calendar size={12} />
              <span className="font-medium">Joined</span>
            </div>
            <div className="text-gray-500">
              {user.createdAt ? formatJoinDate(new Date(user.createdAt)) : 'Recently'}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => {
            // Add your profile/settings navigation logic here
            console.log('Navigate to profile settings');
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
        >
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Settings size={14} className="text-blue-600" />
          </div>
          <span>Account Settings</span>
        </button>
        
        <button
          onClick={() => {
            // Add your profile view logic here
            console.log('View profile');
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
        >
          <div className="p-1.5 bg-green-100 rounded-lg">
            <User size={14} className="text-green-600" />
          </div>
          <span>View Profile</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-2" />

      {/* Logout Button */}
      <div className="py-2">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150 font-medium"
        >
          <div className="p-1.5 bg-red-100 rounded-lg">
            <LogOut size={14} className="text-red-600" />
          </div>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}