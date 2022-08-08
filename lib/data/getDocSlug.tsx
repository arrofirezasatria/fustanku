import { getSanityClient } from "../sanity";

export async function getAllDocSlugs(doc: string) {
  const data = await getSanityClient().fetch(
    // `*[_type == "${doc}" && !(_id in [${queries.homeID}, ${queries.shopID}, ${queries.errorID}]) && wasDeleted != true && isDraft != true]{ "slug": slug.current }`
    `*[_type == "${doc}" && wasDeleted != true && isDraft != true]{ "slug": slug.current }`
  );
  return data;
}

export default getAllDocSlugs;
