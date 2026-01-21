import React, { useState } from 'react';
import { useMedicineSearch } from '../hooks/useMedicineSearch';

const DRUG_SHAPES = ['원형', '타원형', '장방형', '사각형', '기타'];
const DRUG_COLORS = ['하양', '노랑', '주황', '분홍', '빨강', '갈색', '기타'];

function SearchPage() {
  // 커스텀 훅 사용
  const { searchMedicine, isLoading } = useMedicineSearch();

  const [formData, setFormData] = useState({
    itemName: '',   
    drugShape: '',  
    drugShapeOther: '', 
    colorClass1: '',
    colorClass1Other: '', 
    printFront: '', 
    printBack: '',  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // '기타'가 아닐 경우 Other 필드 초기화 (선택사항)
      [`${field}Other`]: value !== '기타' ? '' : prev[`${field}Other`]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMedicine(formData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto"> 
      
      <h1 className="mb-6 text-3xl font-bold text-gray-800">약품 검색</h1>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded-lg shadow-md">
        
        {/* 1. 약품명 */}
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">약품명</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="약품명으로 검색 (예: 타이레놀)"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 2. 모양 / 색상 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 모양 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">모양</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {DRUG_SHAPES.map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => handlePresetChange('drugShape', shape)}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    formData.drugShape === shape
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
            {formData.drugShape === '기타' && (
              <div className="mt-3">
                <input
                  type="text"
                  name="drugShapeOther"
                  value={formData.drugShapeOther}
                  onChange={handleChange}
                  placeholder="모양 직접 입력 (예: 삼각형)"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
          
          {/* 색상 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">색상</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {DRUG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetChange('colorClass1', color)}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    formData.colorClass1 === color
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            {formData.colorClass1 === '기타' && (
              <div className="mt-3">
                <input
                  type="text"
                  name="colorClass1Other"
                  value={formData.colorClass1Other}
                  onChange={handleChange}
                  placeholder="색상 직접 입력 (예: 파랑)"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* 3. 식별표시 (앞/뒤) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="printFront" className="block text-sm font-medium text-gray-700">앞면 식별표시</label>
            <input
              type="text"
              id="printFront"
              name="printFront"
              value={formData.printFront}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="printBack" className="block text-sm font-medium text-gray-700">뒷면 식별표시</label>
            <input
              type="text"
              id="printBack"
              name="printBack"
              value={formData.printBack}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 4. 검색 버튼 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-3 font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? '검색 중...' : '검색하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchPage;