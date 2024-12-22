export const uploadToCloudinary = async (file) => {

    const uploadPreset = process.env.REACT_APP_IMAGE_SECRET;
    const cloudName = process.env.REACT_APP_IMAGE_SECRET_2;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset); //Cloudinary'deki upload preset adı
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url; //Yüklenen dosyanın URL'si
    } catch (error) {
      console.error("Fotoğraf yükleme hatası:", error);
      return null;
    }
  };
  