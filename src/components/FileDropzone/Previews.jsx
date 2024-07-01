import React, { memo } from "react";
import { IconButton, ImageList, ImageListItem } from "@mui/material";
import HighlightOff from "@mui/icons-material/HighlightOff";
import { downloadLink } from "../../api/files";

const Previews = ({ namePrefix, images, onDelete }) => {
    return (
        <ImageList
            sx={{
                m: 0,
                gridTemplateColumns: {
                    xs: 'repeat(1, minmax(0px, 1fr))!important',
                    sm: 'repeat(2, minmax(0px, 1fr))!important',
                    lg: 'repeat(3, minmax(0px, 1fr))!important',
                }
            }}
        >
            {(images || []).map((id, index) => {
                const name = `${namePrefix}_${index + 1}`;

                return (
                    <ImageListItem key={id} sx={{ position: 'relative', aspectRatio: '1' }}>
                        <img
                            src={downloadLink(id)}
                            alt={name}
                            loading="lazy"
                            style={{ borderRadius: '0.25rem', objectFit: 'cover' }}
                        />
                        <IconButton
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(id);
                            }}
                            color="error"
                            title={`Удалить ${name}`}
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <HighlightOff fontSize="small" />
                        </IconButton>
                    </ImageListItem>
                )
            })}
        </ImageList>
    )
};

export default memo(Previews);