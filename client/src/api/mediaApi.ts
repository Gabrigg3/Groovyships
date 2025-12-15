export async function uploadMedia(
    file: File,
    type: "image" | "video" | "audio"
): Promise<string> {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const endpoint =
        type === "image"
            ? "image"
            : type === "video"
                ? "video"
                : "raw"; // audio

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) throw new Error("Error subiendo media");

    const data = await res.json();
    return data.secure_url;
}
