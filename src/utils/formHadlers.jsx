export const handleChange = (e, setTarget, setTargetErrors) => {
    const {name, value} = e.target;
    setTarget(prevState => ({
        ...prevState,
        [name]: value
    }));
    setTargetErrors(prev => ({...prev, [name]: !value}));
};

export const validateForm = (target, setTargetErrors) => {
    const newErrors = {};
    Object.keys(target).forEach(key => {
        if (!target[key] && key != "other") {
            newErrors[key] = true;
        }
    });
    setTargetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

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

