import Image from "next/image";
import Link from "next/link";
export default function SectionGrid({ title, logo, content, image, url }) {
  return (
    <div className="h-full bg-sand flex flex-col pt-6 section-grid">
      {logo && (
        <div className="p-8 flex justify-center mx-auto">
          <div className="relative h-16 w-16">
            {url ? (
              <Link href={url} passHref>
                <Image
                  className="object-cover "
                  src={logo}
                  alt=""
                  fill
                />
              </Link>
            ) : (
              <Image
                className="object-cover "
                src={logo}
                alt=""
                fill
              />
            )}
          </div>
        </div>
      )}
      <div className="px-8 flex justify-center text-center">
        <h2 className="text-2xl uppercase">{title}</h2>
      </div>
      <div
        className={`prose p-8 flex flex-col justify-start flex-1 text-lg`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div>
        <div className="aspect-w-3 aspect-h-2 h-32 relative">
          {image && (
            <Image
              className="object-cover"
              src={image}
              alt="Image related to the corresponding service"
              fill
            />
          )}
        </div>
      </div>
    </div>
  );
}
