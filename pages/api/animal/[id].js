import { dbConnect } from '../../../src/lib/db/database';
import Animal from '../../../src/models/Animal';
import Organizer from '../../../src/models/Organizer';

export default async function handler(req, res) {
	const { id } = req.query;

	if (req.method === 'PUT') {
		const data = JSON.parse(req.body);
		await dbConnect();

		if (data.newId) {
			if (data.checkedRefs.organizers !== []) {
				const updatedOrganizers = await Organizer.updateMany(
					{ id: { $in: data.checkedRefs.organizers } },
					{
						$push: { 'spots.$[element].animalsRef': id },
					},
					{
						arrayFilters: [
							{
								'element.spotsRef': {
									$in: data.checkedRefs.spots,
								},
							},
						],
					}
				);
				res.status(200).json({
					message: 'New Animal added to Organizer',
					entry: updatedOrganizers,
				});
			}
		}

		/*
		const updatedAnimal = await Animal.findByIdAndUpdate(
			id,
			{
				name: data.name,
				spotsRef: data.checkedRefs.spots,
				description: data.description,
				wiki: data.wiki,
			},
			{
				new: true,
			}
		);
		res.status(200).json({
			message: 'Animal updated',
			entry: updatedAnimal,
		});

		if (data.checkedRefs.organizers !== []) {
			const updatedOrganizersAdd = await Organizer.updateMany(
				{
					$and: [
						{ _id: { $in: data.checkedRefs.organizers } },
						{ animalsRef: { $nin: id } },
					],
				},
				{
					$push: { animalsRef: id },
				}
			);
			res.status(200).json({
				message: 'Organizers to add updated',
				entry: updatedOrganizersAdd,
			});

			const updatedOrganizersCut = await Organizer.updateMany(
				{
					$and: [
						{ _id: { $nin: data.checkedRefs.organizers } },
						{ animalsRef: { $in: id } },
					],
				},
				{
					$pull: { animalsRef: id },
				}
			);
			res.status(200).json({
				message: 'Organizers to cut updated',
				entry: updatedOrganizersCut,
			});
		}

		res.status(500).json({
			message: 'Something went wrong',
			entry: req.body,
		});
		*/
	} else if (req.method === 'DELETE') {
		await dbConnect();

		const updatedOrganizersCut = await Organizer.updateMany(
			{ 'spots.$[element].animalsRef': id },
			{
				$pull: { 'spots.$[element].animalsRef': id },
			}
		);

		const deletedAnimal = await Animal.findByIdAndDelete(id);
		res.status(200).json({
			message: 'Animal deleted',
			deletedEntry: [deletedAnimal, updatedOrganizersCut],
		});
	} else {
		res.status(400).json({ error: 'wrong method' });
	}
}
