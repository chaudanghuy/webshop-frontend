import React from "react";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dg5multm4/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'estate_3979';

export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error("Upload to Cloudinary failed");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};