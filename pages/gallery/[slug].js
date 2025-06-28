import Hero from "../../components/hero";
import Image from "next/image";
export default function Gallery({ gallery }) {
  return (
    <main>
      <Hero title={gallery.title} />
      <div className="max-w-2xl mx-auto lg:max-w-none">
        <div className="relative">
          <div className="wide-load space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8">
            {gallery.gallery_images &&
              gallery.gallery_images.map((image, idx) => (
                <div
                  className="col-span-2 sm:col-span-1 flex flex-col"
                  key={idx}
                >
                  <div className="relative image h-full">
                    {image.image_url && (
                      <Image
                        className="object-cover shadow-lg"
                        src={image.image_url}
                        alt=""
                        fill
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${params.slug}/?format=json`
  );
  var body = await res.json();
  return {
    props: {
      gallery: body[0],
    },
  };
}
export async function getStaticPaths() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/?format=json`
  );
  const galleries = await res.json();
  const paths = galleries.map((gallery) => {
    return {
      params: {
        slug: gallery.slug.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
