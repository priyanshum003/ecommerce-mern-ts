import {toast} from 'react-toastify';

type MessageType = 'success' | 'error' | 'warning' | 'info';

export const notify = (message: string, type: MessageType) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        default:
            toast.info(message);
    }
};
