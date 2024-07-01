import React, { useState } from 'react';
import FileDropzone from "./FileDropzone";

export const useFileDropzone = (params) => {
    const [isLoading, setIsLoading] = useState(false);

    return {
        isLoading,
        FileDropzone: <FileDropzone {...params} setIsLoading={setIsLoading} />,
    }
};
