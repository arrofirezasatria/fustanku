import React from "react";
import second from "@sanity/types";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { getSanityClient } from "lib/sanity";
import { getAllDocSlugs } from "@/lib/data/getProduct";
import sanityClient from "@sanity/client";

interface props {
  params: { slug: string };
  preview: string;
  previewData: string;
}

export default function Product({ data }: any) {
  console.log("diproduct");
  console.log(data);
  return <div>{data.slug.current}</div>;
}

export async function getStaticProps({ params }: any) {
  console.log(params.slug);
  const spesificProducts = await sanityClient({
    projectId: "yiwrdd80",
    dataset: "production",
    useCdn: false,
  }).fetch(
    `*[_type=="product" && slug.current=="${params.slug}"]{slug,categories}[0]`,
    {}
  );

  console.log(spesificProducts);

  return {
    props: {
      data: spesificProducts,
    },
  };
}

export async function getStaticPaths() {
  const allProducts = await sanityClient({
    projectId: "yiwrdd80",
    dataset: "production",
    useCdn: false,
  }).fetch(`*[_type=="product"]{"slug":slug.current}`, {});

  // console.log(allProducts);

  return {
    paths:
      allProducts?.map((data: { slug: any }) => {
        return {
          params: {
            slug: data.slug,
          },
        };
      }) || [],
    fallback: false,
  };
}
