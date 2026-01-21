import React from 'react';
import toast from 'react-hot-toast'; 
import { useNavigation } from '../contexts/NavigationContext';
import { useMedicineDetail } from '../hooks/useMedicineDetail';

function MedicineDetailPage() {
  const { onNavigate, selectedMedicineId } = useNavigation();
  
  // 커스텀 훅으로 로직 위임
  const { 
    formData, 
    setFormData, 
    isLoading, 
    updateMedicine, 
    deleteMedicine 
  } = useMedicineDetail(selectedMedicineId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = () => {
    if (!formData.alias) {
      toast.error('약 별칭은 필수입니다.');
      return;
    }
    updateMedicine(formData);
  };

  const handleDeleteClick = () => {
    toast((t) => (
      <div className="flex flex-col items-center p-2">
        <span className="font-semibold text-center mb-1">
          '{formData.alias}'을(를) 삭제하시겠습니까?
        </span>
        <span className="text-sm text-gray-500 mb-3">(복구할 수 없습니다)</span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              deleteMedicine();
            }}
          >
            삭제
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            취소
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  if (isLoading || !formData) {
    return <div className="w-full max-w-4xl mx-auto p-10 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => onNavigate('main-dashboard')}
          className="p-2 mr-4 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">약품 상세정보</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 약품 기본 정보 (ReadOnly) */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">약품 기본 정보</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={formData.medItemImage || "https://placehold.co/100x100/e2e8f0/94a3b8?text=약"}
              alt={formData.medItemName}
              className="w-24 h-24 bg-gray-200 rounded-lg shadow-sm object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/100x100/e2e8f0/94a3b8?text=약"; }}
            />
            <div>
              <p className="text-sm font-medium text-gray-500">{formData.medEntpName}</p>
              <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{formData.medItemName}</h2>
              <p className="text-sm font-semibold text-indigo-600">{formData.medClassName || '분류 정보 없음'}</p>
            </div>
          </div>
        </div>

        {/* 사용자 입력 폼 */}
        <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">사용자 관리 정보</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="alias" className="block text-sm font-semibold text-gray-700">약 별칭 (필수)</label>
              <input
                type="text"
                id="alias"
                name="alias"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.alias}
                onChange={handleChange}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-semibold text-gray-700">구매/처방 날짜</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.purchaseDate || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700">유통기한</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.expiryDate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700">보관 상태</label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option>보관중</option>
                <option>복용완료</option>
              </select>
            </div>

            <div>
              <label htmlFor="memo" className="block text-sm font-semibold text-gray-700">메모</label>
              <textarea
                id="memo"
                name="memo"
                rows="3"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.memo || ''}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="md:col-span-2 pt-4 flex space-x-2">
          <button
            type="button"
            onClick={handleUpdateClick}
            className="flex-1 px-4 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex-1 px-4 py-3 font-bold text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetailPage;