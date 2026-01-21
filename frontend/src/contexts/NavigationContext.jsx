import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('login');
  const [userData, setUserData] = useState(null);
  
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [selectedDrugData, setSelectedDrugData] = useState(null);
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [notificationCount, setNotificationCount] = useState(0);
  
  const [isAuthChecking, setIsAuthChecking] = useState(true); 


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
       
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            credentials: 'include' 
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.retCode === '10') {
               
                setUserData({
                    userKey: data.userKey, 
                    userName: data.userName,
                    isPregnant: data.isPregnant
                });
                
                if (window.location.pathname === '/' || currentPage === 'login') {
                    setCurrentPage('main-dashboard');
                }
            }
        } else {
            
            setCurrentPage('login');
        }
      } catch (e) {
          setCurrentPage('login');
      } finally {
          setIsAuthChecking(false);
      }
    };

    checkLoginStatus();
  }, []);


  // 2. 로그아웃 처리
  const performLogout = async () => {
    try {
        
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        
        setUserData(null);
        setSelectedMedicineId(null);
        setSelectedDrugData(null);
        setSearchResults([]); 
        setSearchQuery('');
        setNotificationCount(0);
        setCurrentPage('login');
    }
  };

  const handleNavigate = (page, data = null) => {
    if (page === 'login') {
      performLogout();
      return;
    }

    if (page === 'main-dashboard' && data?.userName) setUserData(data);
    if (page === 'medicine-detail' && data?.medId) setSelectedMedicineId(data.medId);
    if (page === 'medicine-add' && data?.selectedDrug) setSelectedDrugData(data.selectedDrug);

    setCurrentPage(page);
  };

  const value = {
    currentPage,
    userData,
    selectedMedicineId,
    selectedDrugData,
    searchResults,
    searchQuery,
    notificationCount,
    setNotificationCount,
    onNavigate: handleNavigate,
    setSearchResults,
    setSearchQuery,
  };
  
  
  if (isAuthChecking) return null;

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};