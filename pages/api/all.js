import getDbData from '../../src/services/get-dbData';

export default async function handler(req, response) {
	const allData = await getDbData();

	response.status(200).json(allData);
}
