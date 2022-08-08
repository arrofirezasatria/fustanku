import { getSanityClient } from "lib/sanity";
import * as queries from "./queries";

// async function getProduct(slug, preview) {
//   const query = `
//     {
//       "page": *[_type == "product" && slug.current == "${slug}" && wasDeleted != true && isDraft != true] | order(_updatedAt desc)[0]{
//         "id": _id,
//         hasTransparentHeader,
//         modules[]{
//           defined(_ref) => { ...@->content[0] {
//             ${queries.modules}
//           }},
//           !defined(_ref) => {
//             ${queries.modules},
//           }
//         },
//         "product": ${queries.product},
//         title,
//         seo
//       },
//       ${queries.site}
//     }
//   `;

//   const data = await getSanityClient(preview).fetch(query);

//   return data;
// }

// export default getProduct;

import sanityClient from "@sanity/client";

export async function getAllDocSlugs() {
  const data = await sanityClient({
    projectId: "yiwrdd80", // you can find this in sanity.json
    dataset: "production", // or the name you chose in step 1
    useCdn: true, // `false` if you want to ensure fresh data
  }).fetch(`*[_type == products]{ title }`);
  return data;
}
