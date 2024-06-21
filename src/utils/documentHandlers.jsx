export const handleFileChange = (e, index, setFile, file) => {
    const files = [...file];
    const target_file = e.target.files[0];
    const fileLabels = document.querySelectorAll('.file-upload-label');
    const fileWrappers = document.querySelectorAll('.file-upload-wrapper');
    const fileLabel = fileLabels[index];
    const fileWrapper = fileWrappers[index];

    if (target_file) {
        fileLabel.textContent = `Выбран файл: ${target_file.name}`;
        fileLabel.style.color = "black";
        fileWrapper.style.border = "2px dashed #333";
        files[index] = target_file;
        setFile(files);
    } else {
        fileLabel.textContent = "Загрузить файл:";
    }
};

export const addFileInput = (setFile, file) => {
    setFile([...file, null])
	console.log(file)
}

export const removeFileInput = (index, file, setFile) => {
    const newFiles = [...file];
    newFiles.splice(index, 1);
    setFile(newFiles);
}
