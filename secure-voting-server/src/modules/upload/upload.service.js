import axios from "axios";
import FormData from "form-data";

const uploadToPinata = async (file) => {
  const formData = new FormData();

  formData.append(
    "file",
    file.buffer,
    file.originalname
  );

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    }
  );

  return {
    cid: response.data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
  };
};

export default {
  uploadToPinata,
};