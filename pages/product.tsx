import React from "react";
import sanityClient from "@sanity/client";
import Link from "next/link";

export default function products({ data }: any) {
  const stringf = JSON.stringify(data);

  return (
    <>
      {data.map((data, index) => {
        return (
          <div key={index}>
            <Link href={`/product/${data.slug}`}>{data.slug}</Link>
          </div>
        );
      })}
    </>
  );
}

export async function getStaticProps() {
  const allProducts = await sanityClient({
    projectId: "yiwrdd80",
    dataset: "production",
    useCdn: false,
  }).fetch(`*[_type=="product"]{"slug":slug.current}`, {});

  //   console.log(allProducts);

  return {
    props: {
      data: allProducts,
    },
  };
}
