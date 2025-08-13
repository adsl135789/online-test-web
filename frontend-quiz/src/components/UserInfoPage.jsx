import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function UserInfoPage({ setSessionData }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age_group: '',
    gender: '',
    education: '',
    vision_status: '',
    injury_age: '',
    braille_ability: '',
    mobility_ability: '',
  });
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['age_group', 'gender', 'education', 'vision_status', 
                           'braille_ability', 'mobility_ability'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setStatus({ loading: false, error: t('fillRequired') });
        return;
      }
    }

    setStatus({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/quiz/start', formData);
      setSessionData(response.data);
      navigate('/quiz');
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.error || t('startTestError') });
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cornsilk p-8">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-4xl bg-papaya-whip p-10 rounded-2xl shadow-lg border-2 border-beige">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('userInfoTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 姓名 */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                {t('name')} <span className="text-sm text-gray-500">{t('optional')}</span>
              </label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff" 
              />
            </div>

            {/* 年齡區間 */}
            <div>
              <label htmlFor="age_group" className="block text-lg font-medium text-gray-700">
                {t('age')} <span className="text-red-500">{t('required')}</span>
              </label>
              <select 
                name="age_group" 
                id="age_group" 
                value={formData.age_group} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff"
                required
              >
                <option value="">{t('selectAge')}</option>
                <option value="9以下">{t('under9')}</option>
                <option value="10-19">{t('age10to19')}</option>
                <option value="20-29">{t('age20to29')}</option>
                <option value="30-39">{t('age30to39')}</option>
                <option value="40-49">{t('age40to49')}</option>
                <option value="50-59">{t('age50to59')}</option>
                <option value="60-69">{t('age60to69')}</option>
                <option value="70以上">{t('over70')}</option>
              </select>
            </div>

            {/* 生理性別 */}
            <div>
              <label htmlFor="gender" className="block text-lg font-medium text-gray-700">
                {t('gender')} <span className="text-red-500">{t('required')}</span>
              </label>
              <select 
                name="gender" 
                id="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff"
                required
              >
                <option value="">{t('selectGender')}</option>
                <option value="生理男性">{t('male')}</option>
                <option value="生理女性">{t('female')}</option>
                <option value="其它">{t('other')}</option>
              </select>
            </div>

            {/* 教育程度 */}
            <div>
              <label htmlFor="education" className="block text-lg font-medium text-gray-700">
                {t('education')} <span className="text-red-500">{t('required')}</span>
              </label>
              <select 
                name="education" 
                id="education" 
                value={formData.education} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff"
                required
              >
                <option value="">{t('selectEducation')}</option>
                <option value="小學">{t('elementary')}</option>
                <option value="國中">{t('middleSchool')}</option>
                <option value="高中職">{t('highSchool')}</option>
                <option value="大學">{t('university')}</option>
                <option value="研究所">{t('graduate')}</option>
              </select>
            </div>

            {/* 視力狀況 */}
            <div>
              <label htmlFor="vision_status" className="block text-lg font-medium text-gray-700">
                {t('visionStatus')} <span className="text-red-500">{t('required')}</span>
              </label>
              <select 
                name="vision_status" 
                id="vision_status" 
                value={formData.vision_status} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff"
                required
              >
                <option value="">{t('selectVision')}</option>
                <option value="全盲無光覺">{t('totalBlind')}</option>
                <option value="重度視障">{t('severe')}</option>
                <option value="中度視障">{t('moderate')}</option>
                <option value="輕度視障">{t('mild')}</option>
                <option value="無視覺障礙">{t('noImpairment')}</option>
              </select>
            </div>

            {/* 損傷時間 */}
            <div>
              <label htmlFor="injury_age" className="block text-lg font-medium text-gray-700">
                {t('injuryAge')} <span className="text-sm text-gray-500">{t('injuryAgeHint')}</span>
              </label>
              <input 
                type="number" 
                name="injury_age" 
                id="injury_age" 
                value={formData.injury_age} 
                onChange={handleChange} 
                placeholder={t('injuryAgePlaceholder')}
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff" 
              />
            </div>

            {/* 點字能力 */}
            <div>
              <label htmlFor="braille_ability" className="block text-lg font-medium text-gray-700">
                {t('brailleAbility')} <span className="text-red-500">{t('required')}</span>
              </label>
              <select 
                name="braille_ability" 
                id="braille_ability" 
                value={formData.braille_ability} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff"
                required
              >
                <option value="">{t('selectBraille')}</option>
                <option value="會">{t('yes')}</option>
                <option value="不會">{t('no')}</option>
                <option value="正在學習">{t('learning')}</option>
              </select>
            </div>

            {/* 定向行動能力 */}
            <div>
              <label htmlFor="mobility_ability" className="block text-lg font-medium text-gray-700">
                {t('mobilityAbility')} <span className="text-red-500">{t('required')}</span>
              </label>
              <select 
                name="mobility_ability" 
                id="mobility_ability" 
                value={formData.mobility_ability} 
                onChange={handleChange} 
                className="mt-1 block w-full px-4 py-3 border border-beige rounded-lg shadow-sm focus:outline-none focus:ring-buff focus:border-buff"
                required
              >
                <option value="">{t('selectMobility')}</option>
                <option value="會">{t('yes')}</option>
                <option value="不會">{t('no')}</option>
                <option value="正在學習">{t('learning')}</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={status.loading} 
              className="w-full bg-buff hover:bg-opacity-90 text-white text-xl font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400"
            >
              {status.loading ? t('preparing') : t('startQuiz')}
            </button>
            {status.error && (
              <p className="mt-4 text-center text-red-500">{status.error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
