import React, { useState } from 'react'; 
import toast from 'react-hot-toast'; 
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function LoginPage() {
  const { onNavigate } = useNavigation();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    userId: '',
    userPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.userId || !formData.userPassword) {
      toast.error('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // useAuth 훅을 통해 로그인 시도
    const result = await login(formData.userId, formData.userPassword);

    if (result.success) {
      
      const { userKey, userName, isPregnant } = result.data;

      if (userKey) {
        
        toast.success(result.data.userMsg || '로그인 성공');
        
        // 필요한 정보를 담아 메인으로 이동
        onNavigate('main-dashboard', { userName, userKey, isPregnant });
      } else {
        toast.error('로그인 응답 데이터가 올바르지 않습니다.');
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-md">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">My Medicine (마이슨)</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">로그인</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">아이디</label>
            <input
              id="userId"
              name="userId" 
              type="text"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="아이디를 입력하세요"
              value={formData.userId} 
              onChange={handleChange}   
            />
          </div>

          <div>
            <label htmlFor="userPassword" 
              className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              id="userPassword" 
              name="userPassword" 
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="비밀번호"
              value={formData.userPassword} 
              onChange={handleChange}       
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
              아이디/비밀번호 찾기
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>

        {/* 소셜 로그인 섹션 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는 소셜 계정으로 로그인</span>
            </div>
          </div>

          <div className="mt-6">
            <a 
              href={`${API_BASE_URL}/oauth2/authorization/google`}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <img 
                className="h-5 w-5 mr-2" 
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
                alt="Google" 
              />
              Google 계정으로 시작하기
            </a>
          </div>
        </div>

        <div className="mt-6 text-sm text-center">
          <span className="text-gray-600">계정이 없으신가요? </span>
          <button
            onClick={() => onNavigate('register')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;