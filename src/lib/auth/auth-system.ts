import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  name: string;
  company_name: string;
  sector: string;
  activity: string;
  legal_entity: string;
  subscription_type: 'monthly' | 'yearly' | 'guest';
  subscription_status: 'active' | 'inactive' | 'expired';
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
  language: 'ar' | 'en';
  is_guest: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  type: 'monthly' | 'yearly';
  price: number;
  currency: 'SAR';
  features: string[];
  featuresAr: string[];
  discount?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export class AuthSystem {
  private static instance: AuthSystem;
  
  public static getInstance(): AuthSystem {
    if (!AuthSystem.instance) {
      AuthSystem.instance = new AuthSystem();
    }
    return AuthSystem.instance;
  }

  /**
   * Guest user credentials as specified in prompt
   */
  private readonly GUEST_CREDENTIALS = {
    email: 'Guest@FinClick.AI',
    password: 'GuestFinClickAI@123321'
  };

  /**
   * Subscription plans as specified in prompt
   */
  private readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      nameAr: 'الخطة الشهرية',
      type: 'monthly',
      price: 5000,
      currency: 'SAR',
      features: [
        'Full access to all 181 analysis types',
        'Unlimited document uploads',
        'Real-time market data',
        'Advanced AI analysis',
        'Detailed reports and presentations',
        'Multi-language support',
        'Priority customer support'
      ],
      featuresAr: [
        'وصول كامل لجميع أنواع التحليل الـ 181',
        'رفع مستندات غير محدود',
        'بيانات السوق في الوقت الفعلي',
        'تحليل ذكي متقدم',
        'تقارير وعروض تقديمية مفصلة',
        'دعم متعدد اللغات',
        'دعم عملاء ذو أولوية'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      nameAr: 'الخطة السنوية',
      type: 'yearly',
      price: 60000,
      currency: 'SAR',
      discount: 10,
      features: [
        'Full access to all 181 analysis types',
        'Unlimited document uploads',
        'Real-time market data',
        'Advanced AI analysis',
        'Detailed reports and presentations',
        'Multi-language support',
        'Priority customer support',
        '10% discount on annual subscription',
        'Exclusive premium features',
        'Advanced portfolio analysis'
      ],
      featuresAr: [
        'وصول كامل لجميع أنواع التحليل الـ 181',
        'رفع مستندات غير محدود',
        'بيانات السوق في الوقت الفعلي',
        'تحليل ذكي متقدم',
        'تقارير وعروض تقديمية مفصلة',
        'دعم متعدد اللغات',
        'دعم عملاء ذو أولوية',
        'خصم 10% على الاشتراك السنوي',
        'ميزات حصرية مميزة',
        'تحليل محافظ متقدم'
      ]
    }
  ];

  /**
   * Register new user
   */
  async registerUser(userData: {
    email: string;
    password: string;
    name: string;
    company_name: string;
    sector: string;
    activity: string;
    legal_entity: string;
    language: 'ar' | 'en';
  }): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'User already exists with this email'
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: userData.email,
          name: userData.name,
          company_name: userData.company_name,
          sector: userData.sector,
          activity: userData.activity,
          legal_entity: userData.legal_entity,
          language: userData.language,
          subscription_type: 'monthly',
          subscription_status: 'inactive',
          is_guest: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        return {
          success: false,
          error: profileError.message
        };
      }

      return {
        success: true,
        user: profileData,
        message: 'User registered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  /**
   * Login user
   */
  async loginUser(email: string, password: string): Promise<AuthResponse> {
    try {
      // Check for guest user
      if (email === this.GUEST_CREDENTIALS.email && password === this.GUEST_CREDENTIALS.password) {
        return await this.getGuestUser();
      }

      // Regular user login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user?.id)
        .single();

      if (profileError) {
        return {
          success: false,
          error: profileError.message
        };
      }

      // Check subscription status
      if (profileData.subscription_status === 'expired') {
        return {
          success: false,
          error: 'Subscription has expired. Please renew your subscription.'
        };
      }

      return {
        success: true,
        user: profileData,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  /**
   * Get guest user (as specified in prompt)
   */
  async getGuestUser(): Promise<AuthResponse> {
    try {
      // Check if guest user exists
      let { data: guestUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', this.GUEST_CREDENTIALS.email)
        .single();

      if (!guestUser) {
        // Create guest user if doesn't exist
        const { data: newGuestUser, error } = await supabase
          .from('users')
          .insert({
            id: 'guest-user-id',
            email: this.GUEST_CREDENTIALS.email,
            name: 'Guest User',
            company_name: 'FinClick.AI Guest',
            sector: 'technology',
            activity: 'financial_analysis',
            legal_entity: 'individual',
            language: 'ar',
            subscription_type: 'guest',
            subscription_status: 'active',
            subscription_expires_at: null,
            is_guest: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: error.message
          };
        }

        guestUser = newGuestUser;
      }

      return {
        success: true,
        user: guestUser,
        message: 'Guest login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Guest login failed'
      };
    }
  }

  /**
   * Logout user
   */
  async logoutUser(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          error: 'No authenticated user'
        };
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return {
          success: false,
          error: profileError.message
        };
      }

      return {
        success: true,
        user: profileData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed'
      };
    }
  }

  /**
   * Get subscription plans
   */
  getSubscriptionPlans(): SubscriptionPlan[] {
    return this.SUBSCRIPTION_PLANS;
  }

  /**
   * Create subscription
   */
  async createSubscription(
    userId: string,
    planId: string,
    paymentData: any
  ): Promise<AuthResponse> {
    try {
      const plan = this.SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return {
          success: false,
          error: 'Invalid subscription plan'
        };
      }

      // Calculate subscription expiry
      const now = new Date();
      const expiresAt = new Date(now);
      
      if (plan.type === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      // Update user subscription
      const { data, error } = await supabase
        .from('users')
        .update({
          subscription_type: plan.type,
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          plan_type: plan.type,
          amount: plan.price,
          currency: plan.currency,
          status: 'active',
          starts_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_data: paymentData,
          created_at: new Date().toISOString()
        });

      if (subscriptionError) {
        return {
          success: false,
          error: subscriptionError.message
        };
      }

      return {
        success: true,
        user: data,
        message: 'Subscription created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription creation failed'
      };
    }
  }

  /**
   * Check subscription status
   */
  async checkSubscriptionStatus(userId: string): Promise<{
    isActive: boolean;
    expiresAt: string | null;
    planType: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_status, subscription_expires_at, subscription_type, is_guest')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return {
          isActive: false,
          expiresAt: null,
          planType: 'none'
        };
      }

      // Guest users always have active access
      if (data.is_guest) {
        return {
          isActive: true,
          expiresAt: null,
          planType: 'guest'
        };
      }

      // Check if subscription is expired
      if (data.subscription_status === 'active' && data.subscription_expires_at) {
        const expiresAt = new Date(data.subscription_expires_at);
        const now = new Date();
        
        if (expiresAt > now) {
          return {
            isActive: true,
            expiresAt: data.subscription_expires_at,
            planType: data.subscription_type
          };
        } else {
          // Update expired subscription
          await supabase
            .from('users')
            .update({ subscription_status: 'expired' })
            .eq('id', userId);
        }
      }

      return {
        isActive: false,
        expiresAt: data.subscription_expires_at,
        planType: data.subscription_type
      };
    } catch (error) {
      return {
        isActive: false,
        expiresAt: null,
        planType: 'none'
      };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          subscription_status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data,
        message: 'Subscription cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription cancellation failed'
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed'
      };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password update failed'
      };
    }
  }
}

// Export singleton instance
export const authSystem = AuthSystem.getInstance();

