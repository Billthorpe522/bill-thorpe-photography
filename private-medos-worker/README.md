# Jessica & Ken wedding story

The protected story lives at `/galleries/jessica-ken-medos/`. Every thumbnail,
viewer image and photograph download requires this gallery's own signed session.
The four opening photographs are protected with the rest of the collection.

`photos.mjs` contains public routing metadata for encrypted assets. `selection.mjs`
contains four cover IDs and the ordered chapters. Every selected photograph must
appear exactly once in the chapter sequence; covers also belong to that sequence.
Captions describe visible content without inferring names or relationships.

Keep Lightroom originals, private provenance, manifests and credentials outside
this checkout. Only AES-256-GCM ciphertext belongs in `assets/private-medos/`.
Each encrypted variant uses a unique nonce and `medos:<id>:<kind>` AAD (download reuses the photo variant). Pin
`ASSET_REF` to the immutable asset commit before deployment. The Worker requires
independent `IMAGE_KEY`, `SESSION_SECRET`, `PASSWORD_MAC` and `LOGIN_LIMIT`
bindings. Its deployment config belongs in the private work directory.

No source image, password or key is contained in these modules. Do not deploy the
empty scaffold: fill the photo metadata and story sequence, verify all hashes,
and test the gate, images, viewer and logout first.

The current surname is Medo. Four separate, resized homepage cover derivatives are public with the owner's October 29 authorization; the 90-photo story routes stay protected. Existing internal URLs/asset IDs are retained for compatibility.
