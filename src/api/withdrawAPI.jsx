const BASE_URL = 'https://tradivabe.felixtien.dev/api';

// API để lấy thông tin tài khoản ví của guide
export const getMyBankAccount = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const response = await fetch(`${BASE_URL}/BankAccount/my-account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `Lỗi: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// API để lấy danh sách yêu cầu rút tiền của bản thân (cho guide)
export const getMyWithdrawRequests = async (pageIndex = 1, pageSize = 10) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const response = await fetch(`${BASE_URL}/WithdrawRequest/my-requests?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `Lỗi: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// API để tạo yêu cầu rút tiền mới
export const createWithdrawRequest = async (requestData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const response = await fetch(`${BASE_URL}/WithdrawRequest/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      let errorMessage = `Lỗi: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// API để lấy danh sách yêu cầu rút tiền
export const getWithdrawRequests = async (pageIndex = 1, pageSize = 10) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${BASE_URL}/WithdrawRequest/all?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// API để xử lý yêu cầu rút tiền (approve hoặc reject)
export const processWithdrawRequest = async (requestId, action, adminNote = '', rejectReason = '') => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const body = {
      action: action, // Giữ nguyên action không lowercase
      adminNote: adminNote || '',
      rejectReason: rejectReason || ''
    };
    
    const response = await fetch(`${BASE_URL}/WithdrawRequest/process/${requestId}`, {
      method: 'PUT', // Đổi từ POST sang PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// API để xử lý yêu cầu rút tiền (approve hoặc reject) - Phiên bản PATCH
export const processWithdrawRequestPatch = async (requestId, action, adminNote = '', rejectReason = '') => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const body = {
      action: action,
      adminNote: adminNote || '',
      rejectReason: rejectReason || ''
    };
    
    const response = await fetch(`${BASE_URL}/WithdrawRequest/process/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}; 