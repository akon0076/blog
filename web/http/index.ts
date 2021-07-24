import axios from 'axios';
import { AxiosRequestConfig } from 'axios/index.d';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type IAxiosConfig = Omit<AxiosRequestConfig, 'url'>;
type IConfig = IAxiosConfig & {
	api: string;
};

type returnProps = {
	success: boolean;
	data: any;
};

export const http = async (params: IConfig): Promise<returnProps> => {
	/** 获取环境信息 */
	// const env: 'development' | 'production' = (document.getElementById('env') as any).value;

	const { api } = params;
	const { data, status } = await axios({
		...params,
		url: `/api${api}`
	});
	return {
		success: status === 200,
		data
	};
};
