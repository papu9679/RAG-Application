const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const uploadDocument = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

    const api = `${BASE_URL}/api/documents/upload`
    const options = {
    method: "POST",
    body: formData,
  };

  const response = await fetch(api, options);
  const result = await response.json();
  
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Failed to upload PDF");
  }
  return result;
};