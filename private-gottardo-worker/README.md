# Gottardo Family protected gallery

Four supplied photographs from Crosswind Farms, Manhattan. Public cover derivatives are separate from the protected gallery image files. The gallery requires its own password and independent session/image keys, cookie and rate-limit namespace. Original supplied JPEG bytes are encrypted with AES-256-GCM, AAD `gottardo:<id>` and independent 12-byte nonces. `ASSET_REF` pins an immutable encrypted-asset commit. The upstream payload limit is 1,500,000 bytes. No passwords, private keys, attachment originals or private manifests belong in this checkout.
