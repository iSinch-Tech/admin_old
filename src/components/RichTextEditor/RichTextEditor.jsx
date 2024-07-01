import React, { useEffect, useState, memo, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { downloadLink, postFile } from "../../api/files";

const RichTextEditor = (props) => {
    const { valueRef, setIsDirty, initialValue, init, ...rest } = props;

    const [value, setValue] = useState(initialValue ?? '');
    useEffect(() => setValue(initialValue ?? ''), [initialValue]);

    const imagesUploadHandler = useCallback(async (blobInfo, _progress) => {
        try {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            const data = await postFile(formData);
            return downloadLink(data.id);
        } catch (e) {
            console.log(e);
        }
    }, []);

    return (
        <Editor
            // TODO: register apiKey. This one from codepen
            // apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
            apiKey="8cp4ny9mhscvaojgr2qe3jlu5e7zp2smewbi4f7dklxrid81"
            initialValue={initialValue}
            value={value}
            onEditorChange={(newValue, _editor) => {
                valueRef.current = newValue;
                setValue(newValue);
                setIsDirty(initialValue !== newValue);
            }}
            init={{
                toolbar: 'undo redo | styles | bold italic | list | alignleft aligncenter alignright alignjustify | outdent indent | link image',
                plugins: ['link', 'image'],
                language: 'ru',
                automatic_uploads: true,
                image_caption: true,
                images_upload_credentials: true,
                images_upload_handler: imagesUploadHandler,
                ...init,
            }}
            {...rest}
        />
    )
};

export default memo(RichTextEditor);
