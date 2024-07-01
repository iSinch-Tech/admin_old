import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  IconButton,
  TextField,
  Box,
  CircularProgress
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DataTable from '../DataTable';

import { getMessages, sendMessage, deleteMessage } from '../../api/messages';

const Messages = ({userId}) => {
  const textInput = useRef(null);
  const [data, setData] = useState([]);
  const isLoadingRef = useRef(false);
  const hasMore = useRef(false);
  const [forceReload, setForceReload] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
	const [paginationState, setPaginationState] = useState({
		count: 0,
		page: 1,
		limit: 20,
	});

  const loadMoreRef = useRef(null);
	const observFn = useCallback(() => {
		if (isLoadingRef.current || !hasMore.current) {
			return;
		}
		setPaginationState(state => ({...state, page: state.page + 1}));
	}, []);
	const observer = useRef(
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if (first.isIntersecting) {
				observFn();
			}
		})
	);

  useEffect(() => {
		const currentObserver = observer.current;
		const currentElement = loadMoreRef.current;
		currentElement && currentObserver.observe(currentElement);
		return () => {
			currentElement && currentObserver.unobserve(currentElement);
		}
	}, [loadMoreRef]);

  useEffect(() => {
		setIsLoading(true);
		getMessages(userId, (paginationState.page - 1) * paginationState.limit, paginationState.limit)
			.then(({ rows, count }) => {
				setData((d) => {
          if (paginationState.page === 1) {
            return rows
          }
          return [...d, ...rows]
        });
				setPaginationState(p => ({
					...p,
					count: Math.ceil(count / paginationState.limit),
				}));
        hasMore.current = paginationState.page < Math.ceil(count / paginationState.limit);
			})
			.finally(() => setIsLoading(false));
	},[userId, paginationState.page, paginationState.limit, forceReload]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const columns = [
    { width: '400px', field: 'text', title: 'Сообщение' },
    { title: 'Дата', cellTemplate: (entity) => (entity.updatedAt.split('T')[0]) },
    { title: 'Отправитель', cellTemplate: (entity) => (entity?.sender?.name) },
    { width: '40px', cellTemplate: (entity) => (<IconButton onClick={() => deleteMess(entity.id)}><DeleteForeverIcon color="error"/></IconButton>) },
  ];

  const deleteMess = (messageId) => {
    deleteMessage(messageId).then(() => {
      setPaginationState(state => ({...state, page: 1}));
      setForceReload(it => ++it);
    });
  };

  const send = useCallback((event) => {
    event.preventDefault();
    if (!textInput.current?.value) {
      return;
    }

    sendMessage(userId, textInput.current.value).then(() => {
      textInput.current.value = '';
      setPaginationState(state => ({...state, page: 1}));
      setForceReload(it => ++it);
    })
  }, [userId, textInput]);

  const formStyles = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 2,
    '&::before': {
      position: 'absolute',
      content: '""',
      backgroundColor: 'white',
      top: '-16px',
      left: '-1px',
      right: '-1px',
      height: '100%'
    }
  }

  return (
    <>
      <Box sx={formStyles}>
        <form onSubmit={(e) => send(e)} style={{display: 'flex'}}>
          <TextField
            inputRef={textInput}
            label="Сообщение"
            variant="outlined"
            size="small"
            fullWidth
          />
          <IconButton 
            type="submit"
            variant="contained"
            sx={{marginLeft: '10px'}}
          >
            <SendIcon />
          </IconButton>
        </form>
      </Box>
      <Box sx={{marginTop: '20px', zIndex: 1}}>
        <DataTable columns={columns} data={data} size="small"/>
      </Box>
      <div ref={loadMoreRef} style={{display: 'flex', justifyContent: 'center', padding: '20px'}}>{isLoading && <CircularProgress />}</div>
    </>
  );
};

export default Messages;