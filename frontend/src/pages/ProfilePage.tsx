import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Shield, 
  Bell,
  Download,
  Upload,
  Edit3,
  Save,
  X,
  Camera,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, Button, Input, Alert } from '../components';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // بيانات الملف الشخصي
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.language || 'ar',
    timezone: user?.timezone || 'Asia/Riyadh',
    currency: user?.currency || 'SAR',
    bio: user?.bio || ''
  });

  // بيانات تغيير كلمة المرور
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // إعدادات الإشعارات
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    analysisUpdates: true,
    documentProcessing: true,
    subscriptionReminders: true,
    marketingEmails: false
  });

  // معالجة تحديث الملف الشخصي
  const handleProfileUpdate = async () => {
    try {
      // هنا سيتم إرسال البيانات إلى API
      console.log('Updating profile:', profileData);
      setIsEditing(false);
      // await updateProfile(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // معالجة تغيير كلمة المرور
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('profile.passwordMismatch'));
      return;
    }

    try {
      // هنا سيتم إرسال البيانات إلى API
      console.log('Changing password');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  // معالجة رفع الصورة
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // هنا سيتم رفع الصورة
      console.log('Uploading avatar:', file);
    }
  };

  // اللغات المتاحة
  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  // العملات المتاحة
  const currencies = [
    { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  // المناطق الزمنية
  const timezones = [
    { value: 'Asia/Riyadh', name: 'الرياض (GMT+3)' },
    { value: 'Asia/Dubai', name: 'دبي (GMT+4)' },
    { value: 'Europe/London', name: 'لندن (GMT+0)' },
    { value: 'America/New_York', name: 'نيويورك (GMT-5)' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('profile.pageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('profile.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('profile.personalInfo')}
                </h2>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleProfileUpdate}
                        size="sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {t('profile.save')}
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('profile.cancel')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {t('profile.edit')}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.firstName')}
                  </label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    icon={User}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.lastName')}
                  </label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    icon={User}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.email')}
                  </label>
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    type="email"
                    icon={Mail}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.phone')}
                  </label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    icon={Phone}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.language')}
                  </label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.timezone')}
                  </label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.currency')}
                  </label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {currencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('profile.bio')}
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t('profile.bioPlaceholder')}
                />
              </div>
            </Card>

            {/* Change Password */}
            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('profile.changePassword')}
                </h2>
                <Button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  variant="outline"
                  size="sm"
                >
                  {isChangingPassword ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      {t('profile.cancel')}
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      {t('profile.changePassword')}
                    </>
                  )}
                </Button>
              </div>

              {isChangingPassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.currentPassword')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        icon={Shield}
                        fullWidth
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.newPassword')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        icon={Shield}
                        fullWidth
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        icon={Shield}
                        fullWidth
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handlePasswordChange}>
                      <Save className="w-4 h-4 mr-2" />
                      {t('profile.updatePassword')}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Avatar */}
            <Card className="p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {user?.email}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('profile.uploadAvatar')}
                  </Button>
                  {user?.avatar && (
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('profile.removeAvatar')}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('profile.notifications')}
              </h3>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t(`profile.${key}`)}
                    </span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Account Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('profile.accountInfo')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.memberSince')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.lastLogin')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.status')}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t('profile.active')}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
