'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Company, SECTORS, LEGAL_ENTITIES } from '@/lib/types';
import { getSectorActivities } from '@/lib/utils/constants';
import { Globe, Building, Activity, Scale, Calendar, BarChart } from 'lucide-react';

interface CompanyDetailsFormProps {
  onSubmit: (data: Company) => void;
}

export default function CompanyDetailsForm({ onSubmit }: CompanyDetailsFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Company>({
    defaultValues: {
      country: 'SA',
      yearsToAnalyze: 1,
      comparisonLevel: 'local'
    }
  });

  const selectedSector = watch('sector');
  const activities = selectedSector ? getSectorActivities(selectedSector) : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Building className="w-4 h-4" />
            اسم الشركة (بالعربية)
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="شركة التقنية المتقدمة"
            {...register('name', { required: 'اسم الشركة مطلوب' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company Name (English)
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Advanced Technology Co."
            {...register('nameEn')}
          />
        </div>
      </div>

      {/* Sector */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <BarChart className="w-4 h-4" />
          القطاع
        </label>
        <div className="select-wrapper">
          <select
            className="form-control"
            {...register('sector', { required: 'القطاع مطلوب' })}
          >
            <option value="">اختر القطاع</option>
            {Object.entries(SECTORS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        {errors.sector && (
          <p className="text-red-500 text-sm mt-1">{errors.sector.message}</p>
        )}
      </div>

      {/* Activity */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Activity className="w-4 h-4" />
          النشاط
        </label>
        <div className="select-wrapper">
          <select
            className="form-control"
            {...register('activity', { required: 'النشاط مطلوب' })}
            disabled={!selectedSector}
          >
            <option value="">اختر النشاط</option>
            {activities.map(activity => (
              <option key={activity} value={activity}>{activity}</option>
            ))}
          </select>
        </div>
        {errors.activity && (
          <p className="text-red-500 text-sm mt-1">{errors.activity.message}</p>
        )}
      </div>

      {/* Legal Entity */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Scale className="w-4 h-4" />
          الكيان القانوني
        </label>
        <div className="select-wrapper">
          <select
            className="form-control"
            {...register('legalEntity', { required: 'الكيان القانوني مطلوب' })}
          >
            <option value="">اختر الكيان القانوني</option>
            {Object.entries(LEGAL_ENTITIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        {errors.legalEntity && (
          <p className="text-red-500 text-sm mt-1">{errors.legalEntity.message}</p>
        )}
      </div>

      {/* Years to Analyze */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          عدد سنوات التحليل
        </label>
        <div className="select-wrapper">
          <select
            className="form-control"
            {...register('yearsToAnalyze', { 
              required: 'عدد السنوات مطلوب',
              valueAsNumber: true 
            })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
              <option key={year} value={year}>
                {year === 1 ? 'سنة واحدة' : `${year} سنوات`}
              </option>
            ))}
          </select>
        </div>
        {errors.yearsToAnalyze && (
          <p className="text-red-500 text-sm mt-1">{errors.yearsToAnalyze.message}</p>
        )}
      </div>

      {/* Comparison Level */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Globe className="w-4 h-4" />
          مستوى المقارنة مع متوسط الصناعة
        </label>
        <div className="select-wrapper">
          <select
            className="form-control"
            {...register('comparisonLevel', { required: 'مستوى المقارنة مطلوب' })}
          >
            <option value="local">محلي (المملكة العربية السعودية)</option>
            <option value="gcc">دول مجلس التعاون الخليجي</option>
            <option value="arab">الدول العربية</option>
            <option value="asia">آسيا</option>
            <option value="africa">أفريقيا</option>
            <option value="europe">أوروبا</option>
            <option value="northAmerica">أمريكا الشمالية</option>
            <option value="southAmerica">أمريكا الجنوبية</option>
            <option value="australia">أستراليا وأوقيانوسيا</option>
            <option value="global">عالمي</option>
          </select>
        </div>
        {errors.comparisonLevel && (
          <p className="text-red-500 text-sm mt-1">{errors.comparisonLevel.message}</p>
        )}
      </div>

      {/* Analysis Type Selection */}
      <div className="form-group">
        <label className="form-label">نوع التحليل المطلوب</label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors">
            <input
              type="radio"
              value="comprehensive"
              {...register('analysisType')}
              defaultChecked
              className="w-4 h-4 text-finclick-gold"
            />
            <div>
              <p className="font-medium text-finclick-gold">التحليل الشامل (181 نوع)</p>
              <p className="text-sm text-finclick-gold/60">
                جميع أنواع التحليل المالي - الأساسي والمتوسط والمتقدم
              </p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors">
            <input
              type="radio"
              value="basic"
              {...register('analysisType')}
              className="w-4 h-4 text-finclick-gold"
            />
            <div>
              <p className="font-medium text-finclick-gold">التحليل الأساسي (55 نوع)</p>
              <p className="text-sm text-finclick-gold/60">
                التحليل الهيكلي، النسب المالية، تحليلات التدفق
              </p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors">
            <input
              type="radio"
              value="intermediate"
              {...register('analysisType')}
              className="w-4 h-4 text-finclick-gold"
            />
            <div>
              <p className="font-medium text-finclick-gold">التحليل المتوسط (38 نوع)</p>
              <p className="text-sm text-finclick-gold/60">
                تحليلات المقارنة، التقييم والاستثمار، الأداء والكفاءة
              </p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors">
            <input
              type="radio"
              value="advanced"
              {...register('analysisType')}
              className="w-4 h-4 text-finclick-gold"
            />
            <div>
              <p className="font-medium text-finclick-gold">التحليل المتقدم (88 نوع)</p>
              <p className="text-sm text-finclick-gold/60">
                النمذجة والمحاكاة، التحليل الإحصائي، المحافظ والمخاطر، الكشف الذكي
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Language Selection */}
      <div className="form-group">
        <label className="form-label">لغة التحليل والتقارير</label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors">
            <input
              type="radio"
              value="ar"
              {...register('language')}
              defaultChecked
              className="w-4 h-4 text-finclick-gold"
            />
            <span className="font-medium text-finclick-gold">العربية</span>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-finclick-gold/5 rounded-lg cursor-pointer hover:bg-finclick-gold/10 transition-colors">
            <input
              type="radio"
              value="en"
              {...register('language')}
              className="w-4 h-4 text-finclick-gold"
            />
            <span className="font-medium text-finclick-gold">English</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button type="submit" className="btn btn-primary">
          حفظ البيانات والمتابعة
        </button>
      </div>
    </form>
  );
}
