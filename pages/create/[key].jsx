import PropTypes from 'prop-types';
import getDbData from '../../src/services/get-dbData';
import { useRouter } from 'next/router';
import FormCreateEdit from '../../src/components/FormCreateEdit/FormCreateEdit';
import useStore from '../../src/lib/hooks/useStore';

export async function getServerSideProps() {
	const dataObject = await getDbData();
	const { spots, animals, organizers } = dataObject;

	return {
		props: { spots, animals, organizers },
	};
}

export default function CreateEntry({ spots, animals, organizers }) {
	const data = { spots: spots, animals: animals, organizers: organizers };
	const router = useRouter();
	const key = router.query.key;
	const resetCheckedArrays = useStore(state => state.resetCheckedArrays);
	resetCheckedArrays();

	return <FormCreateEdit keyValue={key} data={data} />;
}
CreateEntry.propTypes = {
	spots: PropTypes.array,
	animals: PropTypes.array,
	organizers: PropTypes.array,
};
