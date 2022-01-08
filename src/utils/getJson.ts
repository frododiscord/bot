import fetch from 'node-fetch';

export default async function getJson<resType = any>(url): Promise<resType> {
	const req = await fetch(url);
	const json = await req.json();
	return <resType> json;
}
