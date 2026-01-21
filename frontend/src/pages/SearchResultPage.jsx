import React from 'react';
import toast from 'react-hot-toast'; 
import { useNavigation } from '../contexts/NavigationContext';

/**
 * 약품 검색 결과 페이지
 * NavigationContext에 저장된 검색 결과를 보여줍니다.
 */
function SearchResultPage() {
  const { onNavigate, searchResults, searchQuery } = useNavigation();

  const handleAddMedicine = (selectedDrug) => {
    toast.success(`'${selectedDrug.medItemName}'을(를) 선택했습니다.`);
    // 선택한 약품 정보를 가지고 등록 페이지로 이동
    onNavigate('medicine-add', { selectedDrug });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => onNavigate('search')} // 검색 조건 입력 화면으로 복귀
          className="p-2 mr-4 text-gray-600 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">약품 검색 결과</h1>
      </div>

      {/* 검색 결과 요약 */}
      <p className="mb-4 text-sm text-gray-600">
        <span className="font-bold text-indigo-600">'{searchQuery || '전체'}'</span> 검색 결과 
        <span className="font-bold"> {searchResults.length}건</span>
      </p>

      {/* 결과 목록 */}
      <div className="space-y-3">
        {searchResults.length === 0 ? (
          <p className="p-10 text-center text-gray-500">검색 결과가 없습니다.</p>
        ) : (
          searchResults.map((drug) => (
            <div key={drug.medItemSeq} className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              
              {/* 약 이미지 */}
              <div className="flex-shrink-0 w-16 h-16 mr-4 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={drug.medItemImage || "https://placehold.co/100x100/e2e8f0/94a3b8?text=약"}
                  alt={drug.medItemName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/100x100/e2e8f0/94a3b8?text=약"; }}
                />
              </div>

              {/* 약 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 truncate">{drug.medEntpName}</p>
                <p className="font-semibold text-gray-900 truncate">{drug.medItemName}</p>
                <p className="text-xs text-gray-500 mt-1">{drug.medClassName || '분류 정보 없음'}</p>
              </div>

              {/* 추가 버튼 */}
              <button
                onClick={() => handleAddMedicine(drug)}
                className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-shrink-0"
              >
                '내 약통'에 추가
              </button>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
}

export default SearchResultPage;