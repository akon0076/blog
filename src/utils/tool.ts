import { v4 as uuidv4 } from 'uuid';

export const getUUId = () => uuidv4().replace(/-/g, '');
