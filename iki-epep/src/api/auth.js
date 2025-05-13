export const loginUser = async ({ username, password }) => {
    await new Promise(res => setTimeout(res, 500));
    return { message: `Selamat datang, ${username}!` };
  };
  
  export const registerUser = async ({ username, email, password }) => {
    await new Promise(res => setTimeout(res, 500));
    return { message: `Akun ${username} berhasil dibuat!` };
  };  