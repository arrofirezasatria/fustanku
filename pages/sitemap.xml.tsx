import { GetServerSideProps } from "next";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

// import { getAllDocSlugs } from "@data";

import sanityClient from "@sanity/client";

const url = [{ link: "shop" }, { link: "product" }, {}];

export async function getAllDocSlugs(doc) {
  const data = await sanityClient({
    projectId: "yiwrdd80",
    dataset: "production",
    useCdn: false,
  }).fetch(`*[_type == "${doc}"]{ "slug": slug.current }`);
  return data;
}

const Sitemap = () => {
  return (
    <div>
      Should not be navigated via Next Link. Use a standard {`<a>`} tag!
    </div>
  );
};

export default Sitemap;

let sitemap: Buffer | null = null;

const addUrls = async (smStream: SitemapStream) => {
  const allPages = await getAllDocSlugs("page");
  const allCollections = await getAllDocSlugs("product");

  allCollections.map((collection) => {
    smStream.write({
      url: `/product/${collection.slug}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  allPages.map((page) => {
    smStream.write({
      url: `/${page.slug}`,
      changefreq: "weekly",
      priority: 0.7,
    });
  });
};

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  if (!req || !res) {
    return {
      props: {},
    };
  }
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Content-Encoding", "gzip");

  // If our sitemap is cached, we write the cached sitemap, no query to the CMS.
  if (sitemap) {
    res.write(sitemap);
    res.end();
    return {
      props: {},
    };
  }
  const smStream = new SitemapStream({
    hostname: `https://${req.headers.host}/`,
  });
  const pipeline = smStream.pipe(createGzip());

  try {
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/product", changefreq: "daily", priority: 0.9 });
    await addUrls(smStream);
    smStream.end();

    const resp = await streamToPromise(pipeline);

    sitemap = resp;

    res.write(resp);
    res.end();
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.write("Could not generate sitemap.");
    res.end();
  }

  return {
    props: {},
  };
};
