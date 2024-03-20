export const fileToBase64 = file => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
};
