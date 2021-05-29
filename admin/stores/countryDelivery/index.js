import importer from '../../lib/importer/importer.js';

export default new Promise(async $export => {
	// grab many modules at once
	const [countryRules, specificProducts, specificCollections] = await importer(
		import(`./countryRules/index.js?v=${window.v}`),
		import(`./specificProducts/index.js?v=${window.v}`),
		import(`./specificCollections/index.js?v=${window.v}`)
	);

	const modules = {
		countryRules,
		specificProducts,
		specificCollections,
	};

	$export({
		namespaced: true,
		modules,
	});
});
