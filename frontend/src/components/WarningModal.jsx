import React from 'react';

/**
 * 병용/임부 금기 경고 모달
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 닫기 핸들러
 * @param {function} onConfirm - 강제 등록 핸들러
 * @param {object} conflictInfo - 충돌 상세 정보
 * @param {string} conflictType - 'COMBINATION'(병용) | 'PREGNANT'(임부)
 */
function WarningModal({ isOpen, onClose, onConfirm, conflictInfo, conflictType }) {
  if (!isOpen) return null;

  const isPregnantWarning = conflictType === 'PREGNANT';

  // 경고 타입별 테마 및 텍스트 설정
  const config = isPregnantWarning ? {
      title: "임부 금기 경고!",
      theme: "pink",
      iconPath: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      ),
      messageMain: "임산부에게 투여 시 태아에게 영향을 줄 수 있습니다.",
      labelTarget: "금기 등급:",
      targetValue: conflictInfo?.typeName || "등급 정보 없음",
  } : {
      title: "병용 금기 경고!",
      theme: "red",
      iconPath: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      ),
      messageMain: "현재 복용 중인 약품과 함께 복용 시 심각한 부작용이 발생할 수 있습니다.",
      labelTarget: "충돌 약품:",
      targetValue: conflictInfo?.conflictingDrugName || "약품명 없음",
  };

  // Tailwind CSS 클래스 매핑
  const colors = isPregnantWarning ? {
    bgHeader: "bg-pink-50",
    borderHeader: "border-pink-100",
    bgIcon: "bg-pink-100",
    textTitle: "text-pink-800",
    textIcon: "text-pink-600",
    textHighlight: "text-pink-600",
    btnConfirm: "bg-pink-600 hover:bg-pink-700 focus:ring-pink-500"
  } : {
    bgHeader: "bg-red-50",
    borderHeader: "border-red-100",
    bgIcon: "bg-red-100",
    textTitle: "text-red-800",
    textIcon: "text-red-600",
    textHighlight: "text-red-600",
    btnConfirm: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className={`${colors.bgHeader} p-4 border-b ${colors.borderHeader} flex items-center`}>
          <div className={`${colors.bgIcon} rounded-full p-2 mr-3`}>
            <svg className={`w-6 h-6 ${colors.textIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {config.iconPath}
            </svg>
          </div>
          <h3 className={`text-lg font-bold ${colors.textTitle}`}>
            {config.title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 font-medium mb-4">
            {config.messageMain}<br/>
            <span className={`${colors.textHighlight} font-bold`}>주의가 필요합니다.</span>
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">{config.labelTarget}</span>
              <span className="font-bold text-gray-800">{config.targetValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">금기 사유:</span>
              <span className={`font-bold ${colors.textHighlight} text-right pl-4`}>{conflictInfo?.reason}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            의사나 약사의 별도 처방이 있는 경우에만 등록하세요.
          </p>
        </div>

        {/* Footer / Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            등록 취소
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 border border-transparent rounded-md text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${colors.btnConfirm}`}
          >
            그래도 등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;