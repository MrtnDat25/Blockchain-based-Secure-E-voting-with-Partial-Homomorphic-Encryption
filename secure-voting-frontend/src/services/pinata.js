import api from "../services/api"

export const uploadToPinata = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await  await api.post(
    "/upload/pinata",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.cid;
};