import React, { useState } from 'react';
import toast from 'react-hot-toast'; 
import { useNavigation } from '../contexts/NavigationContext';
import WarningModal from '../components/WarningModal';
import { useMedicineRegistration } from '../hooks/useMedicineRegistration';

function MedicineAddPage() {
  const { onNavigate, selectedDrugData } = useNavigation();

  const drugToAdd = selectedDrugData || {
    medItemSeq: '200808875',
    medItemName: '타이레놀정500밀리그람',
    medEntpName: '(주)한국얀센',
    medItemImage: 'https://placehold.co/100x100/e2e8f0/94a3b8?text=약+이미지',
    medClassName: '해열, 진통, 소염제',
  };

  const [formData, setFormData] = useState({
    alias: '',        
    expiryDate: '',    
    memo: '',          
    drugType: '상비약', 
    purchaseDate: '',  
  });

  // 커스텀 훅을 통해 등록 로직 가져오기
  const { 
    startRegistrationProcess, 
    proceedToNextStep, 
    showWarningModal, 
    setShowWarningModal, 
    currentConflictInfo 
  } = useMedicineRegistration(drugToAdd, formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.alias) { 
      toast.error("약 별칭을 입력해주세요."); 
      return; 
    }
    startRegistrationProcess(); // 등록 프로세스 시작
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* 경고 모달 */}
      <WarningModal 
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={proceedToNextStep}
        conflictInfo={currentConflictInfo}
        conflictType={currentConflictInfo?.type}
      />

      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => onNavigate('search-results')} 
          className="p-2 mr-4 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">'나의 약통'에 추가하기</h1>
      </div>

      {/* 폼 영역 */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 왼쪽: 약품 정보 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">등록할 약품 정보</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={drugToAdd.medItemImage || "https://placehold.co/100x100/e2e8f0/94a3b8?text=약"}
              alt={drugToAdd.medItemName}
              className="w-24 h-24 bg-gray-200 rounded-lg shadow-sm object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/100x100/e2e8f0/94a3b8?text=약"; }}
            />
            <div>
              <p className="text-sm font-medium text-gray-500">{drugToAdd.medEntpName}</p>
              <h2 className="text-2xl font-bold text-gray-900">{drugToAdd.medItemName}</h2>
              <p className="text-sm font-semibold text-indigo-600 mt-1">{drugToAdd.medClassName || '분류 정보 없음'}</p>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            🛡️ <strong>DUR Check:</strong> 식품의약품안전처 기준에 따라 병용/임부 금기 여부를 실시간으로 검사합니다.
          </div>
        </div>

        {/* 오른쪽: 사용자 입력 */}
        <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">사용자 정보 입력</h3>
          
          <div>
            <label htmlFor="alias" className="block text-sm font-semibold text-gray-700">
              약 별칭 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="alias"
              name="alias"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="예: 우리집 상비약"
              value={formData.alias}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">약품 구분</label>
            <div className="flex mt-2 space-x-4">
              {['상비약', '처방약'].map(type => (
                <label key={type} className="flex items-center">
                  <input 
                    type="radio" 
                    name="drugType" 
                    value={type}
                    checked={formData.drugType === type}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-semibold text-gray-700">구매/처방 날짜 (선택)</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700">유통기한 (선택)</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="memo" className="block text-sm font-semibold text-gray-700">메모 (선택)</label>
            <textarea
              id="memo"
              name="memo"
              rows="3"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="복용법, 구매 장소 등"
              value={formData.memo}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* 버튼 */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default MedicineAddPage;