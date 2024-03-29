import { IApi } from '@/interface/';
import { RouteComponentProps } from 'react-router';

interface ICtx extends IApi, RouteComponentProps<{ id: string }> {
	apiDeatilservice: any;
}

export default async (ctx: ICtx) => {
	// 阅读文档获得更多信息 http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
	console.log('__isBrowser__', __isBrowser__);
	const data = __isBrowser__
		? await (
				await window.fetch(`/api/detail/${ctx.match.params.id}`, {
					body: JSON.stringify({
						name: 'lihong',
						age: 23
					})
				})
		  ).json()
		: await ctx.apiDeatilservice.creat({
				name: 'lihong',
				age: 23
		  });
	return {
		// 建议根据模块给数据加上 namespace防止数据覆盖
		detailData: data
	};
};
