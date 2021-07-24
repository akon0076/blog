import { ISSRContext } from 'ssr-types-react';
interface IApiService {
	index: () => Promise<any>;
}

export default async (
	ctx: ISSRContext<{
		apiService?: IApiService;
	}>
) => {
	// 阅读文档获得更多信息 http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
  console.log('window', window)
	const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx.apiService?.index?.();
	return {
		// 建议根据模块给数据加上 namespace防止数据覆盖
		indexData: { key: 1 }
	};
};
