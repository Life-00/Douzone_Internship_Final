import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister';

function RegisterPage() {
  // 커스텀 훅 사용
  const { register, isSubmitting, onNavigate } = useRegister();

  const [formData, setFormData] = useState({
    userId: '',
    userPassword: '',
    confirmPassword: '',
    userName: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-md">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">My Medicine (마이슨)</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">회원가입</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="로그인 시 사용할 아이디"
            />
          </div>

          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="실명 입력 (예: 홍길동)"
            />
          </div>

          <div>
            <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="agreeTerms" className="block ml-2 text-sm text-gray-900">
              이용약관 및 개인정보 처리 방침에 동의합니다.
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-center">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <button
            onClick={() => onNavigate('login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;