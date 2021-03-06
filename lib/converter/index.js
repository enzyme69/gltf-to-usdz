// Arguments
const { scale } = require('./../argsHandler');

// Converter
const constructOBJ = require('./constructOBJ');
const constructUSDA = require('./constructUSDA');
const handleTextures = require('./handleTextures');
const parseGLTF = require('./parseGLTF');

function convert(gltf) {
	const gltfData = parseGLTF(gltf);

	return new Promise(resolve =>
		gltfData.then((parsedGLTF) => {
			// Extract and write to disk all textures from the glTF file
			const textures = handleTextures(parsedGLTF.textures);

			// Construct and write to disk .obj file
			const objData = constructOBJ(parsedGLTF.meshes);

			Promise.all([textures, objData]).then((data) => {
				const {
					baseColorTexture,
					emissiveTexture,
					occlusionTexture,
					normalTexture,
					metallicTexture,
					roughnessTexture,
				} = data[0];

				const { objPath } = data[1];

				const usdaData = constructUSDA({
					objPath: `${objPath}`,
					objScale: `${scale}, ${scale}, ${scale}`,
					colorTexture: baseColorTexture,
					emissiveTexture,
					metallicTexture,
					normalTexture,
					aoTexture: occlusionTexture,
					roughnessTexture,
				});

				resolve(usdaData);
			});
		}));
}

module.exports = convert;
